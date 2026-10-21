Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap((Resolve-Path "public\assets\images\Drones\drone-4.png").Path)
$minY = $bmp.Height
$maxY = 0
for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.B -gt 100 -and $p.B -gt ($p.R + 40)) {
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Blue canopy in user drone-4.png: Y= $minY to $maxY out of H= $($bmp.Height)"
$bmp.Dispose()
