"""
FastAPI 主应用
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, Any
import os
from dotenv import load_dotenv

from app.models.schemas import DivinationRequest, DivinationResponse
from app.graph.workflow import get_divination_graph
from app.graph.state import GraphState

# 加载环境变量
load_dotenv()

# 创建 FastAPI 应用
app = FastAPI(
    title="寰宇回响 - AI 占卜引擎 API",
    description="基于 LangGraph 的多 Agent 占卜系统",
    version="1.0.0"
)

# 配置 CORS
# 从环境变量读取允许的源，如果没有设置则允许所有（开发环境）
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins == "*":
    origins = ["*"]
else:
    origins = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "寰宇回响 - AI 占卜引擎 API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/divination/start", response_model=DivinationResponse)
async def start_divination(request: DivinationRequest):
    """
    启动占卜流程
    
    接收用户的出生日期和占卜问题，通过多 Agent 系统生成综合解读
    """
    try:
        # 获取当前时间（如果未提供）
        current_time = request.current_time
        if not current_time:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 初始化 GraphState
        initial_state: GraphState = {
            "user_input": {
                "birth_date": request.birth_date,
                "question": request.question,
                "current_time": current_time
            },
            "birth_date": request.birth_date,
            "current_time": current_time,
            "question": request.question,
            "astronomy_data": None,
            "astronomy_description": None,
            "cultural_data": None,
            "final_reading": None,
            "current_agent": None,
            "messages": [],
            "error": None
        }
        
        # 获取工作流并执行
        graph = get_divination_graph()
        final_state = await graph.ainvoke(initial_state)
        
        # 检查是否有错误
        if final_state.get("error"):
            return DivinationResponse(
                success=False,
                error=final_state["error"],
                message="占卜过程中出现错误"
            )
        
        # 构建响应数据
        response_data = {
            "astronomy_data": final_state.get("astronomy_data"),
            "astronomy_description": final_state.get("astronomy_description"),
            "cultural_data": final_state.get("cultural_data"),
            "final_reading": final_state.get("final_reading"),
            "messages": final_state.get("messages", [])
        }
        
        return DivinationResponse(
            success=True,
            data=response_data,
            message="占卜完成"
        )
        
    except Exception as e:
        return DivinationResponse(
            success=False,
            error=str(e),
            message="服务器内部错误"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    host = os.getenv("API_HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)

