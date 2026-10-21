Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("C:\Users\kkour\.gemini\antigravity-ide\brain\54fcc19d-3538-4839-9dbf-8939367c2438\training_drone_compact_1792605192514.jpg")
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
Write-Host "In compact: Y= $minY to $maxY out of H= $($bmp.Height) (Ratio: $([math]::Round(($maxY - $minY) / $bmp.Height, 3)))"
$bmp.Dispose()
