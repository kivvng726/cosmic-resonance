# 寰宇回响 - 快速测试脚本 (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "寰宇回响 - 快速测试脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查后端服务
Write-Host "[1/3] 检查后端服务..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing -TimeoutSec 2
    Write-Host "✅ 后端服务运行正常 (http://localhost:8000)" -ForegroundColor Green
} catch {
    Write-Host "❌ 后端服务未运行，请先启动后端服务" -ForegroundColor Red
    Write-Host "   运行命令: cd backend; python start_server.py" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""

# 检查前端服务
Write-Host "[2/3] 检查前端服务..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 2
    Write-Host "✅ 前端服务运行正常 (http://localhost:8080)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  前端服务未运行，正在启动..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python -m http.server 8080"
    Start-Sleep -Seconds 3
}

Write-Host ""

# 打开浏览器
Write-Host "[3/3] 打开浏览器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ 所有服务已就绪！" -ForegroundColor Green
Write-Host ""
Write-Host "📡 后端 API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "🌐 前端页面: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📚 API 文档: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost:8080"
Write-Host "浏览器已打开！" -ForegroundColor Green
Write-Host ""
Write-Host "按回车键退出..."
Read-Host

