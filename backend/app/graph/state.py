"""
GraphState 定义 - LangGraph 工作流的共享状态
"""
from typing import TypedDict, List, Dict, Any, Optional


class GraphState(TypedDict):
    """LangGraph 工作流的共享状态"""
    
    # 用户输入
    user_input: Dict[str, Any]
    birth_date: str
    current_time: str
    question: str
    
    # Agent 1 (Astronomer) 输出
    astronomy_data: Optional[Dict[str, Any]]
    astronomy_description: Optional[str]
    
    # Agent 2 (Sage) 输出
    cultural_data: Optional[Dict[str, Any]]
    
    # Agent 3 (Oracle) 输出
    final_reading: Optional[str]
    
    # 工作流控制
    current_agent: Optional[str]
    messages: List[Dict[str, str]]
    error: Optional[str]

