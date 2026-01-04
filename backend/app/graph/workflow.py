"""
LangGraph 工作流定义
"""
from langgraph.graph import StateGraph, END
from app.graph.state import GraphState
from app.agents.astronomer import astronomer_agent
from app.agents.sage import sage_agent
from app.agents.oracle import oracle_agent


def create_divination_graph() -> StateGraph:
    """创建占卜工作流图"""
    
    # 创建状态图
    workflow = StateGraph(GraphState)
    
    # 添加节点
    workflow.add_node("astronomer", astronomer_agent)
    workflow.add_node("sage", sage_agent)
    workflow.add_node("oracle", oracle_agent)
    
    # 设置入口点
    workflow.set_entry_point("astronomer")
    
    # 添加边：astronomer -> sage -> oracle -> end
    workflow.add_edge("astronomer", "sage")
    workflow.add_edge("sage", "oracle")
    workflow.add_edge("oracle", END)
    
    # 编译图
    app = workflow.compile()
    
    return app


# 全局工作流实例
divination_graph = None


def get_divination_graph():
    """获取工作流实例（单例模式）"""
    global divination_graph
    if divination_graph is None:
        divination_graph = create_divination_graph()
    return divination_graph

