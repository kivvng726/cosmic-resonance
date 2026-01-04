"""
Agent 1: The Astronomer (天文学家)
负责提供客观的、基于时间的天文数据支撑
"""
from typing import Dict, Any
import json
from app.graph.state import GraphState
from app.utils.astronomy import (
    calculate_sun_sign,
    calculate_rising_sign,
    calculate_moon_phase,
    check_retrograde_planets,
    generate_visual_data,
    generate_astronomy_description
)


def astronomer_agent(state: GraphState) -> GraphState:
    """
    Astronomer Agent: 计算天文数据
    
    输入: state 包含 birth_date 和 current_time
    输出: 更新 state 的 astronomy_data 和 astronomy_description
    """
    try:
        birth_date = state.get("birth_date", "")
        current_time = state.get("current_time", "")
        
        # 计算太阳星座
        sun_sign = calculate_sun_sign(birth_date)
        
        # 计算上升星座（简化模拟）
        rising_sign = calculate_rising_sign(birth_date)
        
        # 计算月亮盈亏
        moon_phase = calculate_moon_phase(current_time)
        
        # 检测行星逆行
        retrograde = check_retrograde_planets(current_time)
        
        # 生成可视化数据
        visual_data = generate_visual_data(sun_sign, rising_sign, moon_phase, retrograde)
        
        # 构建天文数据 JSON
        astronomy_data = {
            "retrograde": retrograde,
            "moon_phase": moon_phase,
            "sun_sign": sun_sign,
            "rising_sign": rising_sign,
            "visual_data": visual_data
        }
        
        # 生成自然语言描述
        astronomy_description = generate_astronomy_description(
            sun_sign, rising_sign, moon_phase, retrograde
        )
        
        # 更新状态
        state["astronomy_data"] = astronomy_data
        state["astronomy_description"] = astronomy_description
        state["current_agent"] = "astronomer"
        state["messages"].append({
            "role": "astronomer",
            "content": f"已完成天文数据计算：{sun_sign}, {rising_sign}, {moon_phase}"
        })
        
        return state
        
    except Exception as e:
        state["error"] = f"Astronomer Agent 错误: {str(e)}"
        return state

