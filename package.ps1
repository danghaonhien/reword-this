# Build the extension
npm run build

# Remove old zip if it exists
if (Test-Path extension.zip) {
    Remove-Item extension.zip
}

# Create new zip from dist directory contents
Compress-Archive -Path "dist\*" -DestinationPath extension.zip

Write-Host "Extension has been packaged to extension.zip" 