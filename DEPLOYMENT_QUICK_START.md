# 快速部署指南 - 5 分钟上手

## 🚀 最简单部署方案：Vercel（前端）+ Railway（后端）

### 第一步：部署后端（Railway）

1. **访问 Railway**: https://railway.app
2. **登录**: 使用 GitHub 账号
3. **创建项目**: 
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库
4. **配置**:
   - Root Directory: `backend`
   - 在 Variables 中添加：
     ```
     OPENAI_API_KEY=sk-8o2rqoIlnYDrWd0amiXacpT4Vs0XGSzOIg4ZBMzJ2IxsDXSU
     OPENAI_BASE_URL=https://api.moonshot.cn/v1
     OPENAI_MODEL=moonshot-v1-8k
     ```
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **等待部署完成**，复制生成的 URL（例如：`https://xxx.up.railway.app`）

### 第二步：更新前端配置

1. **编辑 `index.html`**，找到这一行：
   ```javascript
   : 'https://YOUR_BACKEND_URL_HERE';
   ```
2. **替换为你的 Railway URL**：
   ```javascript
   : 'https://xxx.up.railway.app';
   ```
3. **提交代码**：
   ```bash
   git add index.html
   git commit -m "更新后端 API 地址"
   git push origin main
   ```

### 第三步：部署前端（Vercel）

1. **访问 Vercel**: https://vercel.com
2. **登录**: 使用 GitHub 账号
3. **导入项目**:
   - 点击 "Add New..." → "Project"
   - 选择你的仓库
   - 点击 "Deploy"
4. **等待部署完成**，获得前端 URL（例如：`https://xxx.vercel.app`）

### 完成！

现在你的应用已经部署完成：
- 前端：`https://xxx.vercel.app`
- 后端：`https://xxx.up.railway.app`

分享前端链接给任何人即可使用！

---

## 📝 注意事项

1. **首次部署后端可能需要 2-5 分钟**
2. **确保环境变量正确配置**
3. **部署后测试 API 是否正常**：访问 `https://你的后端地址/api/health`

## 🔄 更新应用

以后只需要：
1. 修改代码
2. `git push origin main`
3. Railway 和 Vercel 会自动重新部署

就是这么简单！🎉

