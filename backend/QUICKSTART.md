# 快速启动指南

## 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

## 2. 配置环境变量（可选）

如果没有 OpenAI API Key，系统会使用模拟输出，仍然可以运行。

```bash
# 复制环境变量示例文件
cp env.example .env

# 编辑 .env 文件，设置你的 API Key
# OPENAI_API_KEY=your_api_key_here
```

## 3. 启动服务

### 方式 1: 使用启动脚本（推荐）

```bash
python start_server.py
```

### 方式 2: 使用 uvicorn

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 方式 3: 使用 Python 模块

```bash
python -m app.main
```

## 4. 测试 API

服务启动后，访问：

- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/api/health

## 5. 前端集成

在前端 `index.html` 中添加 API 配置（可选）：

```html
<script>
    // 配置后端 API 地址
    window.API_BASE_URL = 'http://localhost:8000';
</script>
```

如果不配置，前端会默认使用 `http://localhost:8000`。

## 故障排查

1. **端口被占用**: 修改 `.env` 文件中的 `API_PORT`
2. **导入错误**: 确保在 `backend` 目录下运行，或使用 `python -m app.main`
3. **LLM 错误**: 如果没有配置 API Key，系统会自动使用模拟输出

