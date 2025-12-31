#!/bin/bash

# 寰宇回响 - 本地服务器启动脚本

echo "🌌 正在启动寰宇回响本地服务器..."
echo ""

# 获取当前脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查 Python 是否安装
if command -v python3 &> /dev/null; then
    echo "✅ 检测到 Python 3"
    echo "📡 服务器地址: http://localhost:8000"
    echo "⏹️  按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 检测到 Python 2"
    echo "📡 服务器地址: http://localhost:8000"
    echo "⏹️  按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ 未检测到 Python"
    echo ""
    echo "请选择以下方式之一："
    echo "1. 安装 Python: https://www.python.org/downloads/"
    echo "2. 使用 Node.js: npx serve ."
    echo "3. 直接双击打开 index.html 文件"
    echo ""
    read -p "按回车键退出..."
fi


