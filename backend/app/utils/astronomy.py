"""
天文计算工具函数
"""
from datetime import datetime
from typing import Dict, List, Any
import random


def calculate_sun_sign(birth_date: str) -> str:
    """根据出生日期计算太阳星座"""
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    month = date_obj.month
    day = date_obj.day
    
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "白羊座"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "金牛座"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "双子座"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "巨蟹座"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "狮子座"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "处女座"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "天秤座"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "天蝎座"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "射手座"
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "摩羯座"
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "水瓶座"
    else:
        return "双鱼座"


def calculate_rising_sign(birth_date: str, birth_time: str = "12:00") -> str:
    """计算上升星座（简化模拟）"""
    # 这是一个简化的模拟，实际计算需要精确的时间和地点
    rising_signs = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座",
                    "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"]
    # 基于出生日期的哈希值来模拟上升星座
    date_hash = hash(birth_date) % 12
    return rising_signs[abs(date_hash)]


def calculate_moon_phase(current_time: str) -> str:
    """计算月亮盈亏（简化模拟）"""
    moon_phases = [
        "新月 (New Moon)",
        "上弦月 (First Quarter)",
        "满月 (Full Moon)",
        "下弦月 (Last Quarter)",
        "盈凸月 (Waxing Gibbous)",
        "亏凸月 (Waning Gibbous)",
        "盈眉月 (Waxing Crescent)",
        "亏眉月 (Waning Crescent)"
    ]
    # 基于时间的哈希值来模拟月相
    time_hash = hash(current_time) % len(moon_phases)
    return moon_phases[abs(time_hash)]


def check_retrograde_planets(current_time: str) -> List[str]:
    """检测行星逆行状态（模拟）"""
    planets = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"]
    retrograde_planets = []
    
    # 模拟：基于时间哈希值决定哪些行星逆行
    time_hash = hash(current_time)
    for planet in planets:
        if (time_hash + hash(planet)) % 3 == 0:  # 约33%概率逆行
            retrograde_planets.append(planet)
    
    return retrograde_planets


def generate_visual_data(sun_sign: str, rising_sign: str, moon_phase: str, retrograde: List[str]) -> Dict[str, Any]:
    """生成供前端3D渲染的可视化数据"""
    planets_data = [
        {"name": "太阳", "symbol": "☉", "position": {"x": 0, "y": 0, "z": 0}, "sign": sun_sign},
        {"name": "月亮", "symbol": "☽", "position": {"x": 2, "y": 1, "z": 0}, "phase": moon_phase},
        {"name": "水星", "symbol": "☿", "position": {"x": -1, "y": 1, "z": 1}, "retrograde": "Mercury" in retrograde},
        {"name": "金星", "symbol": "♀", "position": {"x": 1, "y": -1, "z": 1}, "retrograde": "Venus" in retrograde},
        {"name": "火星", "symbol": "♂", "position": {"x": -2, "y": -1, "z": 0}, "retrograde": "Mars" in retrograde},
        {"name": "木星", "symbol": "♃", "position": {"x": 3, "y": 2, "z": -1}, "retrograde": "Jupiter" in retrograde},
        {"name": "土星", "symbol": "♄", "position": {"x": -3, "y": 2, "z": 1}, "retrograde": "Saturn" in retrograde},
    ]
    
    aspects = []
    if len(retrograde) > 0:
        aspects.append({
            "type": "逆行",
            "planets": retrograde,
            "influence": "可能带来反思和调整的机会"
        })
    
    return {
        "planets": planets_data,
        "aspects": aspects,
        "constellations": [sun_sign, rising_sign]
    }


def generate_astronomy_description(sun_sign: str, rising_sign: str, moon_phase: str, retrograde: List[str]) -> str:
    """生成自然语言的星象描述"""
    description_parts = []
    
    description_parts.append(f"您的太阳星座是{sun_sign}，上升星座是{rising_sign}。")
    description_parts.append(f"当前月亮处于{moon_phase}阶段。")
    
    if retrograde:
        planet_names = {
            "Mercury": "水星",
            "Venus": "金星",
            "Mars": "火星",
            "Jupiter": "木星",
            "Saturn": "土星"
        }
        retrograde_cn = [planet_names.get(p, p) for p in retrograde]
        description_parts.append(f"当前{'、'.join(retrograde_cn)}正在逆行，这可能带来一些反思和调整的机会。")
    else:
        description_parts.append("当前没有行星逆行，星象相对平稳。")
    
    return " ".join(description_parts)

