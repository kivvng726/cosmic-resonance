@echo off
chcp 65001 >nul
echo ========================================
echo 寰宇回响 - 快速测试脚本
echo ========================================
echo.

echo [1/3] 检查后端服务...
curl -s http://localhost:8000/api/health >nul
if %errorlevel% equ 0 (
    echo ✅ 后端服务运行正常 (http://localhost:8000)
) else (
    echo ❌ 后端服务未运行，请先启动后端服务
    echo    运行命令: cd backend ^&^& python start_server.py
    pause
    exit /b 1
)

echo.
echo [2/3] 检查前端服务...
curl -s http://localhost:8080 >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务运行正常 (http://localhost:8080)
) else (
    echo ⚠️  前端服务未运行，正在启动...
    start "前端服务器" cmd /k "python -m http.server 8080"
    timeout /t 3 >nul
)

echo.
echo [3/3] 打开浏览器...
echo.
echo ✅ 所有服务已就绪！
echo.
echo 📡 后端 API: http://localhost:8000
echo 🌐 前端页面: http://localhost:8080
echo 📚 API 文档: http://localhost:8000/docs
echo.
echo 正在打开浏览器...
start http://localhost:8080
echo.
echo 按任意键退出...
pause >nul

