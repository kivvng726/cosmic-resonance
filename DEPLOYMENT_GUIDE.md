# 寰宇回响 - 完整部署指南

## 📋 部署架构

本项目采用前后端分离架构：
- **前端**: 静态文件（HTML/CSS/JS），可部署到 Vercel/Netlify/GitHub Pages
- **后端**: Python FastAPI 服务，需要部署到支持 Python 的平台

## 🚀 推荐部署方案

### 方案一：Vercel（前端）+ Railway（后端）⭐ 推荐

**优点**：
- 完全免费（有使用限制）
- 部署简单
- 自动 HTTPS
- 全球 CDN

### 方案二：Vercel（前端）+ Render（后端）

**优点**：
- 免费额度充足
- 支持自动部署
- 配置简单

### 方案三：全栈平台（Railway/Render）

**优点**：
- 前后端统一管理
- 配置更简单

---

## 📦 方案一：Vercel + Railway 部署（推荐）

### 第一部分：部署后端到 Railway

#### 步骤 1: 注册 Railway 账号

1. 访问 https://railway.app
2. 使用 GitHub 账号登录
3. 完成账号设置

#### 步骤 2: 创建新项目

1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 选择你的 `cosmic-resonance` 仓库
4. Railway 会自动检测到 `backend` 目录

#### 步骤 3: 配置项目

1. **设置根目录**：
   - 在项目设置中，找到 **"Root Directory"**
   - 设置为：`backend`

2. **配置环境变量**：
   - 进入项目设置 → **"Variables"**
   - 添加以下环境变量：
     ```
     OPENAI_API_KEY=sk-8o2rqoIlnYDrWd0amiXacpT4Vs0XGSzOIg4ZBMzJ2IxsDXSU
     OPENAI_BASE_URL=https://api.moonshot.cn/v1
     OPENAI_MODEL=moonshot-v1-8k
     API_HOST=0.0.0.0
     API_PORT=$PORT
     ```
   - Railway 会自动提供 `$PORT` 变量

3. **配置启动命令**：
   - 在项目设置 → **"Settings"** → **"Deploy"**
   - **Start Command** 设置为：
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

#### 步骤 4: 部署

1. Railway 会自动开始部署
2. 等待部署完成（通常 2-5 分钟）
3. 部署完成后，Railway 会提供一个公共 URL，例如：
   ```
   https://cosmic-resonance-production.up.railway.app
   ```
4. **重要**：复制这个 URL，稍后需要配置到前端

#### 步骤 5: 测试后端

访问：`https://你的railway域名/api/health`

应该返回：
```json
{"status":"healthy","timestamp":"..."}
```

---

### 第二部分：部署前端到 Vercel

#### 步骤 1: 更新前端 API 配置

在部署前，需要更新前端代码以使用生产环境的 API 地址。

**方法 1: 使用环境变量（推荐）**

修改 `index.html`，在 API 配置部分：

```html
<script>
    // 配置后端 API 地址
    // 生产环境使用环境变量，开发环境使用 localhost
    window.API_BASE_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : 'https://你的railway域名';
    console.log('后端 API 地址:', window.API_BASE_URL);
</script>
```

**方法 2: 在 Vercel 中配置环境变量**

1. 在 Vercel 项目设置中添加环境变量：
   - `VITE_API_BASE_URL` 或 `REACT_APP_API_BASE_URL`
2. 在代码中读取：
   ```javascript
   window.API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
   ```

#### 步骤 2: 部署到 Vercel

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 **"Add New..."** → **"Project"**
   - 选择你的 `cosmic-resonance` 仓库
   - 点击 **"Import"**

3. **配置项目**
   - **Framework Preset**: 选择 **"Other"**
   - **Root Directory**: `./`（默认）
   - **Build Command**: 留空（静态网站不需要构建）
   - **Output Directory**: 留空

4. **添加环境变量**（如果需要）
   - 在 **"Environment Variables"** 中添加：
     - `API_BASE_URL`: `https://你的railway域名`

5. **部署**
   - 点击 **"Deploy"**
   - 等待部署完成（通常 30-60 秒）

6. **获得前端地址**
   - 部署完成后，会得到一个域名，例如：
     ```
     https://cosmic-resonance.vercel.app
     ```

#### 步骤 3: 更新前端 API 地址

部署后，需要在前端代码中硬编码后端地址，或使用 Vercel 的环境变量。

**最简单的方法**：直接修改 `index.html`：

```html
<script>
    // 生产环境后端地址（替换为你的 Railway 域名）
    window.API_BASE_URL = 'https://你的railway域名';
    console.log('后端 API 地址:', window.API_BASE_URL);
</script>
```

然后重新推送到 GitHub，Vercel 会自动重新部署。

---

## 🔧 方案二：Vercel + Render 部署

### 部署后端到 Render

#### 步骤 1: 注册 Render 账号

1. 访问 https://render.com
2. 使用 GitHub 账号登录

#### 步骤 2: 创建 Web Service

1. 点击 **"New +"** → **"Web Service"**
2. 选择你的 GitHub 仓库
3. 配置：
   - **Name**: `cosmic-resonance-backend`
   - **Region**: 选择离你最近的区域
   - **Branch**: `main` 或 `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### 步骤 3: 配置环境变量

在 **"Environment"** 部分添加：
```
OPENAI_API_KEY=sk-8o2rqoIlnYDrWd0amiXacpT4Vs0XGSzOIg4ZBMzJ2IxsDXSU
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

#### 步骤 4: 部署

1. 点击 **"Create Web Service"**
2. 等待部署完成
3. 获得公共 URL，例如：
   ```
   https://cosmic-resonance-backend.onrender.com
   ```

---

## 🌐 方案三：全栈平台部署

### 使用 Railway 部署全栈应用

Railway 支持在一个项目中部署多个服务。

#### 步骤 1: 创建项目结构

在项目根目录创建 `railway.json`：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 步骤 2: 配置服务

1. 在 Railway 中创建新项目
2. 选择 GitHub 仓库
3. 设置根目录为 `backend`
4. 配置环境变量（同方案一）
5. 部署

---

## 📝 部署检查清单

### 后端部署检查

- [ ] Railway/Render 服务正常运行
- [ ] 健康检查端点返回正常：`/api/health`
- [ ] API 文档可访问：`/docs`
- [ ] 环境变量已正确配置
- [ ] CORS 配置允许前端域名访问

### 前端部署检查

- [ ] Vercel 部署成功
- [ ] 前端页面可以正常访问
- [ ] 3D 星空功能正常
- [ ] 占卜功能可以调用后端 API
- [ ] 浏览器控制台没有 CORS 错误

### 集成测试

- [ ] 前端可以成功调用后端 API
- [ ] 占卜流程完整执行
- [ ] AI 解读正常生成
- [ ] 所有数据正常显示

---

## 🔒 安全注意事项

### 1. API Key 安全

- ✅ **不要**将 API Key 提交到 GitHub
- ✅ 使用环境变量存储敏感信息
- ✅ 在 `.gitignore` 中添加 `.env` 文件

### 2. CORS 配置

确保后端 `main.py` 中的 CORS 配置正确：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://你的vercel域名.vercel.app",
        "http://localhost:8080",  # 开发环境
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. 生产环境配置

- 使用 HTTPS
- 配置适当的错误处理
- 添加日志记录
- 设置速率限制（如果需要）

---

## 🔄 更新部署

### 更新后端

1. 修改代码
2. 推送到 GitHub：
   ```bash
   git add .
   git commit -m "更新后端功能"
   git push origin main
   ```
3. Railway/Render 会自动检测并重新部署

### 更新前端

1. 修改代码
2. 推送到 GitHub
3. Vercel 会自动重新部署

---

## 🐛 故障排查

### 问题 1: 前端无法连接后端

**症状**: 浏览器控制台显示 CORS 错误或网络错误

**解决**:
1. 检查后端 URL 是否正确
2. 检查后端 CORS 配置
3. 检查后端服务是否正常运行

### 问题 2: API 调用返回 500 错误

**症状**: 占卜功能返回服务器错误

**解决**:
1. 查看后端日志
2. 检查环境变量是否正确配置
3. 检查 API Key 是否有效

### 问题 3: 部署失败

**症状**: Railway/Vercel 部署失败

**解决**:
1. 查看部署日志
2. 检查 `requirements.txt` 是否正确
3. 检查代码语法错误
4. 检查环境变量配置

---

## 📞 获取帮助

如果遇到问题：

1. 查看平台文档：
   - Railway: https://docs.railway.app
   - Render: https://render.com/docs
   - Vercel: https://vercel.com/docs

2. 检查部署日志

3. 查看浏览器控制台错误

---

## 🎉 完成！

部署完成后，你的应用就可以被任何人访问了！

**分享你的应用**：
- 前端地址：`https://你的vercel域名.vercel.app`
- 后端 API：`https://你的railway域名/api/docs`

享受你的部署成果！🚀

