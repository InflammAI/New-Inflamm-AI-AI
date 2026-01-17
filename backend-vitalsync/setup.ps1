# Clean and reinstall backend dependencies
# Run this from the backend-vitalsync directory

Write-Host "🧹 Cleaning npm cache..." -ForegroundColor Cyan
npm cache clean --force

Write-Host "🗑️  Removing old node_modules..." -ForegroundColor Cyan
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Host "📦 Installing fresh dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Installation successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Starting backend server..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    exit 1
}
