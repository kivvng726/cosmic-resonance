# 部署说明

## 📦 项目结构

```
cosmic-resonance/
├── backend/          # Python 后端（FastAPI + LangGraph）
│   ├── app/          # 应用代码
│   ├── requirements.txt
│   └── ...
├── index.html        # 前端主页面
├── js/              # 前端 JavaScript
├── css/             # 前端样式
└── ...
```

## 🚀 快速部署

### 1. 部署后端（Railway）

1. 访问 https://railway.app
2. 使用 GitHub 登录
3. 创建新项目，选择你的仓库
4. 设置 Root Directory: `backend`
5. 配置环境变量（见下方）
6. 设置 Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. 等待部署完成，复制后端 URL

### 2. 更新前端配置

编辑 `index.html`，将 `YOUR_BACKEND_URL_HERE` 替换为你的 Railway 后端 URL。

### 3. 部署前端（Vercel）

1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 导入项目
4. 点击 Deploy
5. 等待部署完成

详细步骤请查看：[DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)

## 🔧 环境变量配置

### Railway 后端环境变量

```
OPENAI_API_KEY=sk-8o2rqoIlnYDrWd0amiXacpT4Vs0XGSzOIg4ZBMzJ2IxsDXSU
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
API_HOST=0.0.0.0
```

## 📚 详细文档

- **完整部署指南**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **快速开始**: [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)
- **检查清单**: [部署检查清单.md](部署检查清单.md)

## 🆘 需要帮助？

查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) 中的故障排查部分。

