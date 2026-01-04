#!/usr/bin/env python3
"""
启动后端服务器的便捷脚本
"""
import os
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# 加载环境变量
from dotenv import load_dotenv
load_dotenv()

import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("API_PORT", 8000))
    host = os.getenv("API_HOST", "0.0.0.0")
    
    print("启动寰宇回响 AI 占卜引擎后端服务...")
    print(f"服务地址: http://{host}:{port}")
    print(f"API 文档: http://{host}:{port}/docs")
    print(f"健康检查: http://{host}:{port}/api/health")
    print(f"\n按 Ctrl+C 停止服务\n")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True  # 开发模式：代码变更自动重载
    )

