# CRootAgent Automated Installer Script for Windows (PowerShell)
# https://crootagent.github.io

$ErrorActionPreference = "Stop"

Write-Host "==> Memulai instalasi CRootAgent di Windows..." -ForegroundColor Cyan

$repo = "CRootAgent/crootagent"
$tag = "v0.1.0"

try {
    $releaseInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/latest"
    if ($releaseInfo.tag_name) {
        $tag = $releaseInfo.tag_name
    }
} catch {
    Write-Host "Menggunakan versi rilis default: $tag" -ForegroundColor Yellow
}

$assetName = "crootagent-windows-x86_64.zip"
$downloadUrl = "https://github.com/$repo/releases/download/$tag/$assetName"

$installDir = "$env:LOCALAPPDATA\CRootAgent\bin"
if (!(Test-Path -Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

$zipPath = "$env:TEMP\$assetName"

Write-Host "Mengunduh $downloadUrl..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $installDir -Force
    Remove-Item -Path $zipPath -Force
} catch {
    Write-Host "Catatan: File rilis belum tersedia di repositori rilis." -ForegroundColor Yellow
}

# Add to User PATH if not present
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installDir", "User")
    Write-Host "Menambahkan $installDir ke PATH lingkungan pengguna." -ForegroundColor Green
}

Write-Host "`n[✔] CRootAgent berhasil dipasang ke $installDir\crootagent.exe" -ForegroundColor Green
Write-Host "Buka terminal baru lalu ketik 'crootagent' untuk memulai!" -ForegroundColor Cyan
