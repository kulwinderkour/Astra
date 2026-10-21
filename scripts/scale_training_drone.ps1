Add-Type -AssemblyName System.Drawing

# 1. Load the pristine studio background from the 16:9 generated image
$bgSrc = [System.Drawing.Image]::FromFile('C:\Users\kkour\.gemini\antigravity-ide\brain\54fcc19d-3538-4839-9dbf-8939367c2438\training_drone_zoomed_out_1792605114225.jpg')
$targetW = $bgSrc.Width   # 1920 or 1672
$targetH = $bgSrc.Height  # 1080 or 941

# Load the drone image
$droneSrc = [System.Drawing.Image]::FromFile('C:\Users\kkour\.gemini\antigravity-ide\brain\54fcc19d-3538-4839-9dbf-8939367c2438\training_drone_zoomed_out_1792605114225.jpg')

# We want to scale down the drone by 28% (scale factor = 0.72)
# The drone currently occupies ~60% of height.
# In $droneSrc, let's crop the drone with its local shadow, scale it down to 72% size,
# and place it on a clean studio background.
$dstBmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dstBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Fill the background by sampling the outer studio background gradient from $bgSrc
# Outer edges of $bgSrc are clean dark charcoal:
# Top corners: ~ rgb(26, 30, 38)
# Bottom corners: ~ rgb(18, 21, 26)
$topColor = [System.Drawing.Color]::FromArgb(255, 28, 33, 42)
$botColor = [System.Drawing.Color]::FromArgb(255, 16, 18, 22)
$rect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
$gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $topColor, $botColor, 90.0)
$g.FillRectangle($gradBrush, $rect)

# Draw the drone scaled down by 28%:
$scale = 0.72
$scaledW = [int]($targetW * $scale)
$scaledH = [int]($targetH * $scale)
$destX = [int](($targetW - $scaledW) / 2)
# Position vertically so it is centered / slightly above center (to leave room for bottom text)
$destY = [int](($targetH - $scaledH) / 2) - [int]($targetH * 0.05)

# Render $droneSrc into a temp bitmap and feather outer edges to seamlessly dissolve into the dark background
$temp = New-Object System.Drawing.Bitmap($scaledW, $scaledH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$tg = [System.Drawing.Graphics]::FromImage($temp)
$tg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$tg.DrawImage($droneSrc, 0, 0, $scaledW, $scaledH)

# Feather the outer 14% of edges
$featherX = [int]($scaledW * 0.16)
$featherY = [int]($scaledH * 0.14)

for ($y = 0; $y -lt $scaledH; $y++) {
    for ($x = 0; $x -lt $scaledW; $x++) {
        $distX = [Math]::Min($x, $scaledW - 1 - $x)
        $distY = [Math]::Min($y, $scaledH - 1 - $y)
        
        $factorX = if ($distX -lt $featherX) { $distX / [double]$featherX } else { 1.0 }
        $factorY = if ($distY -lt $featherY) { $distY / [double]$featherY } else { 1.0 }
        $factor = [Math]::Min($factorX, $factorY)
        
        if ($factor -lt 1.0) {
            # Smooth S-curve
            $smoothFactor = $factor * $factor * (3.0 - 2.0 * $factor)
            $p = $temp.GetPixel($x, $y)
            $newA = [int]($p.A * $smoothFactor)
            $temp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $p.R, $p.G, $p.B))
        }
    }
}

$g.DrawImage($temp, $destX, $destY)

# Save to destination
$outPng = (Resolve-Path 'public\assets\images\Drones').Path + '\drone-4.png'
$outJpg = (Resolve-Path 'public\assets\images\Drones').Path + '\drone-4.jpg'
$outLandscape = (Resolve-Path 'public\assets\images\Drones').Path + '\drone-4-landscape.png'

$dstBmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Save($outJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$dstBmp.Save($outLandscape, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Scaled down by 28% and saved successfully to $outPng"

$tg.Dispose()
$temp.Dispose()
$g.Dispose()
$dstBmp.Dispose()
$droneSrc.Dispose()
$bgSrc.Dispose()
