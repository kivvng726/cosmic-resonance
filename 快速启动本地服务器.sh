#!/bin/bash

# 快速启动本地开发服务器

echo "🌌 启动寰宇回响本地开发服务器..."
echo ""

# 获取当前脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查 Python 是否安装
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python 3 启动服务器"
    echo ""
    echo "📡 本地访问地址:"
    echo "   http://localhost:8000"
    echo "   http://127.0.0.1:8000"
    echo ""
    echo "💡 提示:"
    echo "   - 修改代码后，刷新浏览器即可看到效果"
    echo "   - 按 Ctrl+C 停止服务器"
    echo ""
    echo "🚀 正在启动..."
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python 2 启动服务器"
    echo ""
    echo "📡 本地访问地址:"
    echo "   http://localhost:8000"
    echo ""
    echo "💡 提示:"
    echo "   - 修改代码后，刷新浏览器即可看到效果"
    echo "   - 按 Ctrl+C 停止服务器"
    echo ""
    echo "🚀 正在启动..."
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ 未检测到 Python"
    echo ""
    echo "请选择以下方式之一："
    echo ""
    echo "1. 安装 Python:"
    echo "   macOS: 通常已预装，或访问 https://www.python.org/downloads/"
    echo ""
    echo "2. 使用 Node.js:"
    echo "   npx serve ."
    echo ""
    echo "3. 使用 VS Code:"
    echo "   安装 'Live Server' 扩展，右键 index.html → Open with Live Server"
    echo ""
    read -p "按回车键退出..."
fi


