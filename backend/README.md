# 寰宇回响 - AI 占卜引擎后端

基于 LangGraph 的多 Agent 占卜系统后端服务。

## 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 主应用
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── astronomer.py       # Agent 1: 天文学家
│   │   ├── sage.py             # Agent 2: 国学大师
│   │   └── oracle.py           # Agent 3: 寰宇占卜师
│   ├── graph/
│   │   ├── __init__.py
│   │   ├── state.py            # GraphState 定义
│   │   └── workflow.py         # LangGraph 工作流
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── astronomy.py        # 天文计算工具
│   │   ├── chinese_calendar.py # 中国传统历法工具
│   │   └── prompts.py          # Prompt 模板
│   └── models/
│       ├── __init__.py
│       └── schemas.py          # Pydantic 数据模型
├── requirements.txt
├── .env.example
└── README.md
```

## 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

## 配置环境变量

1. 复制 `.env.example` 为 `.env`（如果还没有创建）：
```bash
cp env.example .env
```

2. `.env` 文件已预配置月之暗面 (Moonshot AI) API：
```
OPENAI_API_KEY=sk-8o2rqoIlnYDrWd0amiXacpT4Vs0XGSzOIg4ZBMzJ2IxsDXSU
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

**注意**：
- 月之暗面 API 已配置完成，可以直接使用
- 如果需要使用其他 LLM（如 OpenAI），请修改 `.env` 文件中的配置
- 如果没有配置 API Key，系统会使用模拟输出，仍然可以运行，但解读质量会降低

## 启动服务

```bash
# 方式 1: 使用 uvicorn 直接启动
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 方式 2: 使用 Python 运行
python -m app.main
```

服务启动后，访问：
- API 文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/api/health

## API 端点

### POST /api/divination/start

启动占卜流程。

**请求体**:
```json
{
  "birth_date": "1990-01-01",
  "question": "我的事业发展如何？",
  "current_time": "2024-01-01 12:00:00"  // 可选
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "astronomy_data": {...},
    "cultural_data": {...},
    "final_reading": "..."
  },
  "message": "占卜完成"
}
```

## 工作流说明

1. **Astronomer Agent**: 计算天文数据（太阳星座、上升星座、月亮盈亏、行星逆行等）
2. **Sage Agent**: 计算传统文化数据（八字、紫微主星、签文、五行等）
3. **Oracle Agent**: 综合前两个 Agent 的输出，生成个性化的 Markdown 格式解读

## 开发说明

- 所有 Agent 都支持异步执行
- 如果 LLM 不可用，Oracle Agent 会使用模拟输出
- 错误处理机制确保单个 Agent 失败不会导致整个流程崩溃

