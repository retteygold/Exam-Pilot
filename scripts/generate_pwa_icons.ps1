Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $root 'public'
$inputPath = Join-Path $publicDir 'logo.png'

function Resize-Png {
  param(
    [string]$InPath,
    [string]$OutPath,
    [int]$Size
  )

  $img = [System.Drawing.Image]::FromFile($InPath)
  $bmp = [System.Drawing.Bitmap]::new($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)

  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($img, 0, 0, $Size, $Size)
  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $g.Dispose()
  $bmp.Dispose()
  $img.Dispose()
}

Resize-Png -InPath $inputPath -OutPath (Join-Path $publicDir 'icon-192.png') -Size 192
Resize-Png -InPath $inputPath -OutPath (Join-Path $publicDir 'icon-512.png') -Size 512

Write-Output 'Generated public/icon-192.png and public/icon-512.png'
