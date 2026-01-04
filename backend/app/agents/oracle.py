"""
Agent 3: The Oracle (寰宇占卜师)
负责将 Astronomer 的冷数据和 Sage 的古文，转化为用户听得懂的、针对其问题的温暖建议
"""
import json
from typing import Dict, Any
from app.graph.state import GraphState
from app.utils.prompts import ORACLE_SYSTEM_PROMPT, COT_TEMPLATE
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import os


def get_llm():
    """获取 LLM 实例"""
    # 优先使用环境变量中的 API Key
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", None)
    model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    if api_key:
        # 如果 base_url 为空，根据模型名称推断（月之暗面）
        if not base_url and "moonshot" in model.lower():
            base_url = "https://api.moonshot.cn/v1"
        
        return ChatOpenAI(
            model=model,
            temperature=0.7,
            api_key=api_key,
            base_url=base_url
        )
    else:
        # 如果没有配置 API Key，返回 None，使用模拟输出
        return None


def format_astronomy_data_for_prompt(astronomy_data: Dict[str, Any], astronomy_description: str) -> str:
    """格式化天文数据用于 Prompt"""
    if not astronomy_data:
        return "暂无天文数据"
    
    retrograde = astronomy_data.get("retrograde", [])
    moon_phase = astronomy_data.get("moon_phase", "")
    sun_sign = astronomy_data.get("sun_sign", "")
    rising_sign = astronomy_data.get("rising_sign", "")
    
    formatted = f"""
太阳星座: {sun_sign}
上升星座: {rising_sign}
月亮盈亏: {moon_phase}
逆行行星: {', '.join(retrograde) if retrograde else '无'}
描述: {astronomy_description}
"""
    return formatted.strip()


def format_cultural_data_for_prompt(cultural_data: Dict[str, Any]) -> str:
    """格式化文化数据用于 Prompt"""
    if not cultural_data:
        return "暂无文化数据"
    
    bazi = cultural_data.get("bazi", {})
    ziwei_star = cultural_data.get("ziwei_star", "")
    fortune_stick = cultural_data.get("fortune_stick", {})
    five_elements_advice = cultural_data.get("five_elements_advice", "")
    
    formatted = f"""
八字: {bazi.get('year', '')}年 {bazi.get('month', '')}月 {bazi.get('day', '')}日 {bazi.get('hour', '')}时
紫微主星: {ziwei_star}
签文: {fortune_stick.get('poem', '')} (第{fortune_stick.get('number', '')}签, {fortune_stick.get('fortune_level', '')})
解签: {fortune_stick.get('interpretation', '')}
五行建议: {five_elements_advice}
"""
    return formatted.strip()


def generate_mock_reading(question: str, astronomy_data: Dict[str, Any], 
                          cultural_data: Dict[str, Any]) -> str:
    """生成模拟解读（当没有 LLM 时使用）"""
    sun_sign = astronomy_data.get("sun_sign", "未知") if astronomy_data else "未知"
    retrograde = astronomy_data.get("retrograde", []) if astronomy_data else []
    ziwei_star = cultural_data.get("ziwei_star", "未知") if cultural_data else "未知"
    fortune_stick = cultural_data.get("fortune_stick", {}) if cultural_data else {}
    poem = fortune_stick.get("poem", "") if fortune_stick else ""
    
    reading = f"""# 您的专属占卜解读

## 星象分析

根据您的出生信息，您的太阳星座是**{sun_sign}**。"""
    
    if retrograde:
        planet_names = {
            "Mercury": "水星",
            "Venus": "金星",
            "Mars": "火星",
            "Jupiter": "木星",
            "Saturn": "土星"
        }
        retrograde_cn = [planet_names.get(p, p) for p in retrograde]
        reading += f"\n\n当前{'、'.join(retrograde_cn)}正在逆行，这可能带来一些反思和调整的机会。"
    
    reading += f"""

## 传统文化解读

您的紫微主星是**{ziwei_star}**，这体现了您的性格特质和人生轨迹。

**签文启示**：
> {poem}

## 针对您的问题：{question}

结合当前的星象和传统文化分析，建议您：

1. **保持开放心态**：无论是西方占星还是东方传统，都提醒我们要顺应自然规律
2. **把握时机**：当前星象显示，适合进行深度思考和规划
3. **融合智慧**：将东西方的智慧结合起来，找到最适合自己的道路

## 温馨提醒

占卜只是参考，真正的力量在于您自己的选择和行动。愿您在前行的路上，既有星空的指引，也有传统文化的智慧相伴。

---

*此解读由寰宇回响 AI 占卜系统生成，融合了东西方占卜智慧*"""
    
    return reading


def oracle_agent(state: GraphState) -> GraphState:
    """
    Oracle Agent: 综合解读生成
    
    输入: state 包含 astronomy_data, cultural_data, question
    输出: 更新 state 的 final_reading
    """
    try:
        question = state.get("question", "")
        astronomy_data = state.get("astronomy_data")
        astronomy_description = state.get("astronomy_description", "")
        cultural_data = state.get("cultural_data")
        
        # 获取 LLM
        llm = get_llm()
        
        if llm:
            # 使用 LLM 生成解读
            astronomy_text = format_astronomy_data_for_prompt(astronomy_data, astronomy_description)
            cultural_text = format_cultural_data_for_prompt(cultural_data)
            
            # 构建 Prompt
            prompt = COT_TEMPLATE.format(
                question=question,
                astronomy_data=astronomy_text,
                cultural_data=cultural_text
            )
            
            # 调用 LLM
            messages = [
                SystemMessage(content=ORACLE_SYSTEM_PROMPT),
                HumanMessage(content=prompt)
            ]
            
            response = llm.invoke(messages)
            final_reading = response.content
        else:
            # 如果没有 LLM，使用模拟输出
            final_reading = generate_mock_reading(question, astronomy_data, cultural_data)
        
        # 更新状态
        state["final_reading"] = final_reading
        state["current_agent"] = "oracle"
        state["messages"].append({
            "role": "oracle",
            "content": "已完成综合解读生成"
        })
        
        return state
        
    except Exception as e:
        # 如果出错，使用模拟输出
        try:
            final_reading = generate_mock_reading(
                state.get("question", ""),
                state.get("astronomy_data"),
                state.get("cultural_data")
            )
            state["final_reading"] = final_reading
            state["current_agent"] = "oracle"
            state["messages"].append({
                "role": "oracle",
                "content": f"使用模拟输出（LLM 错误: {str(e)}）"
            })
        except:
            state["error"] = f"Oracle Agent 错误: {str(e)}"
        
        return state

