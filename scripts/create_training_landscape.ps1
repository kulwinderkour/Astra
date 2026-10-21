Add-Type -AssemblyName System.Drawing
$srcPath = (Resolve-Path "public\assets\images\Drones\drone-4.png").Path
$srcBmp = New-Object System.Drawing.Bitmap($srcPath)

$targetW = 1672
$targetH = 941
$dstBmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dstBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# In drone-4.png (1086 x 1448):
# Drone body is roughly x=50 to x=1036, y=340 to y=1330.
# We want to crop from y=240 to y=1180 in srcBmp (height = 940, width = 1086)
# If we keep the native vertical scale or scale it slightly (e.g. height = 941):
# 941 in dstBmp corresponds to ~1080px in srcBmp (from y=260 to y=1340)
# Let's crop a window of srcBmp:
$srcCropY = 220
$srcCropH = 1120 # from 220 to 1340 covers the entire drone, all ducts, top fin, camera, and reflections!
$srcCropW = $srcBmp.Width # 1086

# When rendered to dstBmp (height 941):
# Scale = 941 / 1120 = 0.84
# Rendered width = 1086 * 0.84 = 912px
# Placed in center: X = (1672 - 912) / 2 = 380px.
# Left gap = 380px, Right gap = 380px.
$cropScale = 941.0 / $srcCropH
$rendW = [int]($srcCropW * $cropScale)
$rendH = 941
$rendX = [int](($targetW - $rendW) / 2)

# Fill left 0..rendX and right (rendX+rendW)..targetW with extended background
# From srcBmp along the left edge and right edge within the crop window:
for ($y = 0; $y -lt $targetH; $y++) {
    $srcY = [int]($srcCropY + ($y / $cropScale))
    if ($srcY -ge $srcBmp.Height) { $srcY = $srcBmp.Height - 1 }
    $leftCol = $srcBmp.GetPixel(5, $srcY)
    $rightCol = $srcBmp.GetPixel($srcBmp.Width - 6, $srcY)
    
    # Draw left line across 0..rendX
    $leftPen = New-Object System.Drawing.Pen($leftCol)
    $g.DrawLine($leftPen, 0, $y, $rendX + 30, $y)
    $leftPen.Dispose()
    
    # Draw right line across (rendX+rendW-30)..targetW
    $rightPen = New-Object System.Drawing.Pen($rightCol)
    $g.DrawLine($rightPen, $rendX + $rendW - 30, $y, $targetW, $y)
    $rightPen.Dispose()
}

# Now draw the cropped drone in the center with a feathered mask on left/right 80 pixels
$droneBmp = New-Object System.Drawing.Bitmap($rendW, $rendH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dg = [System.Drawing.Graphics]::FromImage($droneBmp)
$dg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$srcRect = New-Object System.Drawing.Rectangle(0, $srcCropY, $srcCropW, $srcCropH)
$dstRect = New-Object System.Drawing.Rectangle(0, 0, $rendW, $rendH)
$dg.DrawImage($srcBmp, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$feather = 100
for ($y = 0; $y -lt $rendH; $y++) {
    for ($x = 0; $x -lt $feather; $x++) {
        $p = $droneBmp.GetPixel($x, $y)
        $factor = [Math]::Pow(($x / [double]$feather), 1.5)
        $a = [int](255 * $factor)
        $droneBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
    }
    for ($x = $rendW - $feather; $x -lt $rendW; $x++) {
        $p = $droneBmp.GetPixel($x, $y)
        $factor = [Math]::Pow((($rendW - 1 - $x) / [double]$feather), 1.5)
        $a = [int](255 * $factor)
        $droneBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
    }
}

$g.DrawImage($droneBmp, $rendX, 0)

$outPath = (Resolve-Path "public\assets\images\Drones").Path + "\drone-4-landscape.png"
$dstBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Perfect seamless landscape saved to $outPath"

$dg.Dispose()
$droneBmp.Dispose()
$g.Dispose()
$dstBmp.Dispose()
$srcBmp.Dispose()
