# Install required packages if not already installed
if (!(Get-Command electron-packager -ErrorAction SilentlyContinue)) {
    Write-Host "Installing electron-packager..." -ForegroundColor Yellow
    npm install -g electron-packager
}

# Navigate to the desktop-app directory
Set-Location -Path "$PSScriptRoot\desktop-app"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

# Create a simple icon file (you can replace this with your actual icon)
if (!(Test-Path "icon.ico")) {
    Write-Host "Creating placeholder icon..." -ForegroundColor Yellow
    Add-Content -Path "icon.ico" -Value ""
}

# Package the app for Windows
Write-Host "Packaging app for Windows..." -ForegroundColor Cyan
npm run package-win

# Check if packaging was successful
if ($LASTEXITCODE -eq 0) {
    $releaseDir = "$PSScriptRoot\desktop-app\release-builds"
    $zipFile = "$PSScriptRoot\Day1Health-Windows.zip"
    
    # Create a zip of the packaged app
    Write-Host "Creating zip file..." -ForegroundColor Cyan
    Compress-Archive -Path "$releaseDir\Day1Health-win32-x64\*" -DestinationPath $zipFile -Force
    
    Write-Host "`nPackaging completed successfully!" -ForegroundColor Green
    Write-Host "Downloadable app package: $zipFile" -ForegroundColor Green
    Write-Host "`nYou can now upload this file to a file sharing service or your web server." -ForegroundColor Yellow
} else {
    Write-Host "`nPackaging failed. Please check the error messages above." -ForegroundColor Red
}
