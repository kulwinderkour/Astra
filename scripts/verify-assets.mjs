/**
 * Verifies every image the application references against public/assets/images.
 *
 * Fails (exit 1) on a reference whose file is missing, empty, or whose
 * extension/case does not match what is on disk. Run with --strict in CI once
 * all photography has landed; without it, missing files are reported as
 * warnings so the build stays green while assets are still being supplied.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const imageDir = join(root, 'public/assets/images');
const strict = process.argv.includes('--strict');

/** Every source file that can name an asset. */
function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?|css|html)$/.test(entry.name) ? [full] : [];
  });
}

const files = [...sourceFiles(join(root, 'src')), join(root, 'index.html')];
const referenced = new Map();

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  // Direct paths: /assets/images/foo.jpg
  for (const m of text.matchAll(/\/assets\/(images|videos)\/([\w./-]+\.\w+)/g)) {
    referenced.set(`${m[1]}/${m[2]}`, file);
  }
  // Manifest entries: key: 'foo.jpg'
  for (const m of text.matchAll(/^\s*\w+:\s*'((?!\/)[\w.-]+(?:\/[\w.-]+)*\.(?:jpg|jpeg|png|webp|avif))',?$/gm)) {
    referenced.set(`images/${m[1]}`, file);
  }
}

/** Every image on disk, as a path relative to public/assets/images. */
function imagesOnDisk(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? imagesOnDisk(join(dir, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`],
  );
}

const onDisk = new Set(imagesOnDisk(imageDir));
const lowerToActual = new Map([...onDisk].map((n) => [n.toLowerCase(), n]));

const missing = [];
const problems = [];

for (const [ref, source] of [...referenced].sort()) {
  const kind = ref.slice(0, ref.indexOf('/'));
  const name = ref.slice(ref.indexOf('/') + 1);
  const full = join(root, 'public/assets', kind, name);
  let stat = null;
  try {
    stat = statSync(full);
  } catch {
    /* handled below */
  }
  const rel = source.replace(`${root}/`, '');
  if (!stat) {
    const caseMatch = kind === 'images' ? lowerToActual.get(name.toLowerCase()) : undefined;
    if (caseMatch) problems.push(`CASE MISMATCH  ${ref} -> on disk as "${caseMatch}"  (${rel})`);
    else missing.push(`MISSING        ${ref}  (${rel})`);
  } else if (stat.size === 0) {
    problems.push(`EMPTY FILE     ${ref}  (${rel})`);
  }
}

const used = new Set(
  [...referenced].filter(([r]) => r.startsWith('images/')).map(([r]) => r.slice('images/'.length)),
);
const orphans = [...onDisk].filter((n) => !used.has(n) && !n.split('/').pop().startsWith('.'));

console.log(`Checked ${referenced.size} asset reference(s) across ${files.length} source file(s).\n`);
if (problems.length) {
  console.log('Problems:');
  problems.forEach((p) => console.log('  ' + p));
  console.log('');
}
if (missing.length) {
  console.log(`Not yet supplied (${missing.length}) — each renders the neutral ASTRA fallback panel:`);
  missing.forEach((m) => console.log('  ' + m));
  console.log('');
}
if (orphans.length) {
  console.log(`Unreferenced files in public/assets/images (${orphans.length}):`);
  orphans.forEach((o) => console.log('  ' + o));
  console.log('');
}
if (!problems.length && !missing.length) console.log('All referenced assets resolve. ✓');

if (problems.length || (strict && missing.length)) process.exit(1);
