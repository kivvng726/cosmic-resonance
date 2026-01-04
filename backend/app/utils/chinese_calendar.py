"""
中国传统历法工具函数
"""
from datetime import datetime
from typing import Dict, Any
import random


# 天干
TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

# 地支
DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# 紫微主星
ZIWEI_STARS = [
    "紫微星", "天机星", "太阳星", "武曲星", "天同星", "廉贞星",
    "天府星", "太阴星", "贪狼星", "巨门星", "天相星", "天梁星",
    "七杀星", "破军星"
]

# 五行
WU_XING = ["金", "木", "水", "火", "土"]

# 签文库（示例）
FORTUNE_STICKS = [
    {
        "number": 1,
        "poem": "星河璀璨照前程，智慧如光破迷津",
        "interpretation": "此签主吉，预示前程光明，智慧将指引方向",
        "fortune_level": "上上签"
    },
    {
        "number": 2,
        "poem": "月明星稀好时光，贵人相助事业昌",
        "interpretation": "此签主吉，预示将有贵人相助，事业顺利",
        "fortune_level": "上签"
    },
    {
        "number": 3,
        "poem": "紫微高照福满堂，天机妙算显智光",
        "interpretation": "此签主吉，紫微星高照，智慧将得到发挥",
        "fortune_level": "上上签"
    },
    {
        "number": 4,
        "poem": "风起云涌变化多，稳中求进莫急躁",
        "interpretation": "此签主平，提醒在变化中保持稳定",
        "fortune_level": "中签"
    },
    {
        "number": 5,
        "poem": "乌云遮月需等待，耐心守候见光明",
        "interpretation": "此签主平，需要耐心等待时机",
        "fortune_level": "中签"
    },
    {
        "number": 6,
        "poem": "红鸾星动喜事来，良缘佳偶自天成",
        "interpretation": "此签主吉，预示感情方面将有喜事",
        "fortune_level": "上签"
    },
    {
        "number": 7,
        "poem": "财星高照财运旺，投资理财需谨慎",
        "interpretation": "此签主吉，财运不错但需谨慎投资",
        "fortune_level": "上签"
    },
    {
        "number": 8,
        "poem": "健康星明身体健，养生之道不可忘",
        "interpretation": "此签主吉，健康运势良好，需注意保养",
        "fortune_level": "上签"
    },
    {
        "number": 9,
        "poem": "学业有成智慧开，勤学苦练必成才",
        "interpretation": "此签主吉，学业运势良好，努力必有回报",
        "fortune_level": "上签"
    },
    {
        "number": 10,
        "poem": "事业星明前程广，把握机遇展宏图",
        "interpretation": "此签主吉，事业运势良好，需把握机遇",
        "fortune_level": "上签"
    }
]


def calculate_bazi(birth_date: str, birth_time: str = "12:00") -> Dict[str, str]:
    """计算八字（年柱、月柱、日柱、时柱）"""
    date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
    year = date_obj.year
    month = date_obj.month
    day = date_obj.day
    
    # 简化的八字计算（实际需要复杂的历法转换）
    # 这里使用基于日期的哈希值来模拟
    year_hash = hash(str(year)) % 10
    month_hash = hash(str(month)) % 10
    day_hash = hash(str(day)) % 10
    hour_hash = hash(birth_time) % 10
    
    year_gan = TIAN_GAN[abs(year_hash)]
    year_zhi = DI_ZHI[abs(year_hash) % 12]
    
    month_gan = TIAN_GAN[abs(month_hash)]
    month_zhi = DI_ZHI[abs(month_hash) % 12]
    
    day_gan = TIAN_GAN[abs(day_hash)]
    day_zhi = DI_ZHI[abs(day_hash) % 12]
    
    hour_gan = TIAN_GAN[abs(hour_hash)]
    hour_zhi = DI_ZHI[abs(hour_hash) % 12]
    
    return {
        "year": f"{year_gan}{year_zhi}",
        "month": f"{month_gan}{month_zhi}",
        "day": f"{day_gan}{day_zhi}",
        "hour": f"{hour_gan}{hour_zhi}"
    }


def calculate_ziwei_star(birth_date: str) -> str:
    """计算紫微主星（模拟）"""
    date_hash = hash(birth_date) % len(ZIWEI_STARS)
    return ZIWEI_STARS[abs(date_hash)]


def draw_fortune_stick(birth_date: str, question: str) -> Dict[str, Any]:
    """抽取灵签"""
    # 基于出生日期和问题的哈希值来选择签文
    combined_hash = hash(birth_date + question)
    stick_index = abs(combined_hash) % len(FORTUNE_STICKS)
    return FORTUNE_STICKS[stick_index].copy()


def analyze_five_elements(bazi: Dict[str, str]) -> Dict[str, Any]:
    """分析五行属性"""
    # 简化的五行分析
    # 天干对应的五行
    gan_wuxing = {
        "甲": "木", "乙": "木",
        "丙": "火", "丁": "火",
        "戊": "土", "己": "土",
        "庚": "金", "辛": "金",
        "壬": "水", "癸": "水"
    }
    
    # 统计各五行出现次数
    wuxing_count = {"金": 0, "木": 0, "水": 0, "火": 0, "土": 0}
    
    for pillar in bazi.values():
        gan = pillar[0]
        if gan in gan_wuxing:
            wuxing_count[gan_wuxing[gan]] += 1
    
    # 找出最多的五行
    dominant_element = max(wuxing_count, key=wuxing_count.get)
    
    # 生成建议
    advice_map = {
        "金": "当前五行偏金，宜注重沟通和表达，适合学习新技能",
        "木": "当前五行偏木，宜积极行动，适合开展新项目",
        "水": "当前五行偏水，宜保持灵活，适合调整策略",
        "火": "当前五行偏火，宜保持热情，适合社交和合作",
        "土": "当前五行偏土，宜保持稳定，适合巩固基础"
    }
    
    return {
        "dominant": dominant_element,
        "distribution": wuxing_count,
        "advice": advice_map.get(dominant_element, "保持平衡，顺势而为")
    }

