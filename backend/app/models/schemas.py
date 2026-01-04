"""
Pydantic 数据模型
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class DivinationRequest(BaseModel):
    """占卜请求模型"""
    birth_date: str = Field(..., description="出生日期，格式：YYYY-MM-DD")
    question: str = Field(..., description="占卜问题")
    current_time: Optional[str] = Field(None, description="当前时间，格式：YYYY-MM-DD HH:MM:SS，如果不提供则使用服务器时间")


class DivinationResponse(BaseModel):
    """占卜响应模型"""
    success: bool = Field(..., description="是否成功")
    data: Optional[Dict[str, Any]] = Field(None, description="占卜结果数据")
    error: Optional[str] = Field(None, description="错误信息")
    message: Optional[str] = Field(None, description="提示信息")

