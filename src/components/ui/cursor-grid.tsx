import React, { useEffect, useRef } from 'react';

export interface CursorGridProps {
  /** Optional content to wrap with the interactive cursor grid */
  children?: React.ReactNode;
  /** Size of each grid square in pixels (default: 60) */
  cellSize?: number;
  /** Color of the grid lines and highlights (default: '#ffffff') */
  color?: string;
  /** Highlighting style: 'area' (surrounding radius), 'cell' (single cell), or 'cross' (crosshair axes) */
  highlight?: 'area' | 'cell' | 'cross';
  /** Style of the grid structure: 'lines' or 'dots' (default: 'lines') */
  gridStyle?: 'lines' | 'dots';
  /** Interaction radius around the cursor in pixels (default: 140) */
  radius?: number;
  /** How long a cell stays fully lit before fading in milliseconds (default: 400) */
  holdTime?: number;
  /** Duration of the fade out transition in milliseconds (default: 800) */
  fadeDuration?: number;
  /** Peak fill opacity of activated cells (default: 0.06) */
  fillOpacity?: number;
  /** Resting opacity of the background grid lines (default: 0.08) */
  gridOpacity?: number;
  /** Intensity of the cursor spotlight glow 0..1 (default: 0.6) */
  spotlight?: number;
  /** Whether clicking produces an expanding radial shockwave pulse (default: true) */
  clickPulse?: boolean;
  /** Optional additional CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

interface Pulse {
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 255, g: 255, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function CursorGrid({
  children,
  cellSize = 60,
  color = '#ffffff',
  highlight = 'area',
  gridStyle = 'lines',
  radius = 140,
  holdTime = 400,
  fadeDuration = 800,
  fillOpacity = 0.06,
  gridOpacity = 0.08,
  spotlight = 0.6,
  clickPulse = true,
  className = '',
  style,
}: CursorGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current?.parentElement || containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const rgb = hexToRgb(color);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let animationFrameId: number | null = null;
    let isRunning = false;

    // Mouse coordinates relative to canvas
    let mouseX = -9999;
    let mouseY = -9999;
    let isMouseInside = false;

    // Track active cell timestamps: Map key is `${col},${row}`, value is timestamp
    const activeCells = new Map<string, number>();
    const pulses: Pulse[] = [];

    // Handle high DPI
    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (prefersReducedMotion) {
        drawStatic();
      } else {
        requestTick();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      if (gridStyle === 'lines') {
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${gridOpacity})`;
        ctx.beginPath();
        for (let x = 0; x <= width; x += cellSize) {
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, height);
        }
        for (let y = 0; y <= height; y += cellSize) {
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(width, y + 0.5);
        }
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${gridOpacity})`;
        for (let x = 0; x <= width; x += cellSize) {
          for (let y = 0; y <= height; y += cellSize) {
            ctx.beginPath();
            ctx.arc(x, y, 1.25, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw base resting grid
      ctx.lineWidth = 1;
      if (gridStyle === 'lines') {
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${gridOpacity})`;
        ctx.beginPath();
        for (let x = 0; x <= width; x += cellSize) {
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, height);
        }
        for (let y = 0; y <= height; y += cellSize) {
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(width, y + 0.5);
        }
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${gridOpacity})`;
        for (let x = 0; x <= width; x += cellSize) {
          for (let y = 0; y <= height; y += cellSize) {
            ctx.beginPath();
            ctx.arc(x, y, 1.25, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. Process & draw active cell highlights with hold and fade
      let hasActiveDecay = false;
      const totalLifespan = holdTime + fadeDuration;

      activeCells.forEach((timestamp, key) => {
        const elapsed = now - timestamp;
        if (elapsed > totalLifespan) {
          activeCells.delete(key);
          return;
        }

        hasActiveDecay = true;
        let intensity = 1.0;
        if (elapsed > holdTime) {
          intensity = 1.0 - (elapsed - holdTime) / fadeDuration;
        }

        const [colStr, rowStr] = key.split(',');
        const col = parseInt(colStr, 10);
        const row = parseInt(rowStr, 10);
        const cellX = col * cellSize;
        const cellY = row * cellSize;

        // Draw soft cell fill
        const alpha = fillOpacity * intensity;
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.fillRect(cellX, cellY, cellSize, cellSize);

        // Highlight cell borders
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(gridOpacity + 0.14) * intensity})`;
        ctx.strokeRect(cellX + 0.5, cellY + 0.5, cellSize, cellSize);
      });

      // 3. Draw cursor radial spotlight
      if (isMouseInside && spotlight > 0) {
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
        grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${spotlight * 0.22})`);
        grad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${spotlight * 0.08})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight nearby grid lines under the spotlight
        const minCol = Math.max(0, Math.floor((mouseX - radius) / cellSize));
        const maxCol = Math.min(Math.floor(width / cellSize), Math.ceil((mouseX + radius) / cellSize));
        const minRow = Math.max(0, Math.floor((mouseY - radius) / cellSize));
        const maxRow = Math.min(Math.floor(height / cellSize), Math.ceil((mouseY + radius) / cellSize));

        ctx.beginPath();
        for (let col = minCol; col <= maxCol; col++) {
          const x = col * cellSize + 0.5;
          const dy = Math.abs(x - mouseX);
          if (dy < radius) {
            const span = Math.sqrt(radius * radius - dy * dy);
            ctx.moveTo(x, Math.max(0, mouseY - span));
            ctx.lineTo(x, Math.min(height, mouseY + span));
          }
        }
        for (let row = minRow; row <= maxRow; row++) {
          const y = row * cellSize + 0.5;
          const dx = Math.abs(y - mouseY);
          if (dx < radius) {
            const span = Math.sqrt(radius * radius - dx * dx);
            ctx.moveTo(Math.max(0, mouseX - span), y);
            ctx.lineTo(Math.min(width, mouseX + span), y);
          }
        }
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${spotlight * 0.24})`;
        ctx.stroke();
      }

      // 4. Draw click pulse waves
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const elapsed = now - p.startTime;
        if (elapsed > p.duration) {
          pulses.splice(i, 1);
          continue;
        }

        hasActiveDecay = true;
        const progress = elapsed / p.duration;
        const currentR = p.maxRadius * progress;
        const alpha = (1 - progress) * 0.35;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232, 115, 26, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, currentR - 8), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Keep running if mouse is inside or animations are fading out
      if (isMouseInside || hasActiveDecay || pulses.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const requestTick = () => {
      if (!isRunning && !prefersReducedMotion) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Update active cells based on mouse position
    const activateNearbyCells = (x: number, y: number, now: number) => {
      const curCol = Math.floor(x / cellSize);
      const curRow = Math.floor(y / cellSize);

      if (highlight === 'cell') {
        activeCells.set(`${curCol},${curRow}`, now);
      } else if (highlight === 'cross') {
        activeCells.set(`${curCol},${curRow}`, now);
        for (let i = -1; i <= 1; i++) {
          activeCells.set(`${curCol + i},${curRow}`, now);
          activeCells.set(`${curCol},${curRow + i}`, now);
        }
      } else {
        // 'area'
        const cellRadius = Math.ceil(radius / cellSize);
        for (let c = curCol - cellRadius; c <= curCol + cellRadius; c++) {
          for (let r = curRow - cellRadius; r <= curRow + cellRadius; r++) {
            if (c < 0 || r < 0 || c * cellSize > width || r * cellSize > height) continue;
            const cx = (c + 0.5) * cellSize;
            const cy = (r + 0.5) * cellSize;
            const dist = Math.hypot(cx - x, cy - y);
            if (dist <= radius) {
              activeCells.set(`${c},${r}`, now);
            }
          }
        }
      }
    };

    // Pointer events on container
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        isMouseInside = true;
        activateNearbyCells(mouseX, mouseY, performance.now());
        requestTick();
      } else {
        isMouseInside = false;
      }
    };

    const onPointerLeave = () => {
      isMouseInside = false;
      mouseX = -9999;
      mouseY = -9999;
      requestTick();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!clickPulse) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        pulses.push({
          x,
          y,
          startTime: performance.now(),
          duration: 650,
          maxRadius: radius * 2.2,
        });
        requestTick();
      }
    };

    // Observers and event listeners
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointerdown', onPointerDown);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    cellSize,
    color,
    highlight,
    gridStyle,
    radius,
    holdTime,
    fadeDuration,
    fillOpacity,
    gridOpacity,
    spotlight,
    clickPulse,
  ]);

  if (children) {
    return (
      <div
        ref={containerRef}
        className={`cursor-grid-container ${className}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          aria-hidden="true"
        />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`cursor-grid-wrap ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
