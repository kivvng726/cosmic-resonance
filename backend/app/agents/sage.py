"""
Agent 2: The Sage (国学大师)
负责注入中国传统智慧，确保"紫微斗数"和"签文"的文化真实性
"""
from typing import Dict, Any
from app.graph.state import GraphState
from app.utils.chinese_calendar import (
    calculate_bazi,
    calculate_ziwei_star,
    draw_fortune_stick,
    analyze_five_elements
)


def sage_agent(state: GraphState) -> GraphState:
    """
    Sage Agent: 计算传统文化数据
    
    输入: state 包含 birth_date 和 question
    输出: 更新 state 的 cultural_data
    """
    try:
        birth_date = state.get("birth_date", "")
        question = state.get("question", "")
        
        # 计算八字
        bazi = calculate_bazi(birth_date)
        
        # 计算紫微主星
        ziwei_star = calculate_ziwei_star(birth_date)
        
        # 抽取灵签
        fortune_stick = draw_fortune_stick(birth_date, question)
        
        # 分析五行
        five_elements = analyze_five_elements(bazi)
        
        # 构建文化数据
        cultural_data = {
            "bazi": bazi,
            "ziwei_star": ziwei_star,
            "fortune_stick": fortune_stick,
            "five_elements_advice": five_elements["advice"],
            "five_elements_distribution": five_elements["distribution"],
            "dominant_element": five_elements["dominant"]
        }
        
        # 更新状态
        state["cultural_data"] = cultural_data
        state["current_agent"] = "sage"
        state["messages"].append({
            "role": "sage",
            "content": f"已完成传统文化计算：{ziwei_star}, 签文{fortune_stick['number']}号"
        })
        
        return state
        
    except Exception as e:
        state["error"] = f"Sage Agent 错误: {str(e)}"
        return state

