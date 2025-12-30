# Vercel 部署指南 - 快速部署你的网站

## 🚀 Vercel 的优势

- ✅ **完全免费**
- ✅ **部署超快**（通常 30 秒内完成）
- ✅ **自动部署**（每次推送代码自动更新）
- ✅ **全球 CDN 加速**
- ✅ **支持私有仓库**
- ✅ **自动 HTTPS**
- ✅ **可以自定义域名**

---

## 📝 部署步骤

### 步骤 1：访问 Vercel 并登录

1. **打开 Vercel**
   - 访问：https://vercel.com
   - 点击右上角 **"Sign Up"** 或 **"Log In"**

2. **使用 GitHub 登录**（推荐）
   - 选择 **"Continue with GitHub"**
   - 授权 Vercel 访问你的 GitHub 账户
   - 这样可以直接导入仓库

### 步骤 2：导入项目

1. **添加新项目**
   - 登录后，点击 **"Add New..."** 按钮
   - 选择 **"Project"**

2. **选择仓库**
   - 在仓库列表中找到 `jojodd77/cosmic-resonance`
   - 点击 **"Import"**

3. **配置项目**（通常使用默认即可）
   - **Project Name**: `cosmic-resonance`（可以修改）
   - **Framework Preset**: 选择 **"Other"** 或 **"Vite"**（如果显示）
   - **Root Directory**: `./`（默认）
   - **Build Command**: 留空（静态网站不需要构建）
   - **Output Directory**: 留空或 `./`（默认）

4. **部署**
   - 点击 **"Deploy"** 按钮
   - 等待 30-60 秒

### 步骤 3：获得网站链接

部署完成后，你会看到：

- ✅ **部署成功提示**
- 🌐 **你的网站地址**，例如：
  ```
  https://cosmic-resonance.vercel.app
  ```
  或
  ```
  https://cosmic-resonance-jojodd77.vercel.app
  ```

### 步骤 4：访问网站

- 点击显示的链接
- 或直接访问 Vercel 给你的域名

---

## 🎯 配置说明

### 项目设置（通常不需要修改）

对于你的静态网站项目，Vercel 会自动检测并配置：

- **Framework**: 自动识别为静态网站
- **Build Command**: 不需要（静态文件直接部署）
- **Output Directory**: 根目录
- **Install Command**: 不需要（没有依赖）

### 如果需要自定义配置

可以创建 `vercel.json` 文件（可选）：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

但对于你的项目，**不需要**这个文件，Vercel 会自动处理。

---

## ✨ 自动部署

配置完成后，Vercel 会：

- ✅ **自动监听** GitHub 仓库的推送
- ✅ **自动部署** 每次代码更新
- ✅ **自动生成** 预览链接（用于 Pull Request）

---

## 🔗 自定义域名（可选）

### 添加自定义域名

1. 在 Vercel 项目页面，点击 **"Settings"**
2. 找到 **"Domains"** 选项
3. 输入你的域名（如 `cosmic-resonance.com`）
4. 按照提示配置 DNS 记录

### 使用免费子域名

Vercel 会自动提供：
- `cosmic-resonance.vercel.app`
- `cosmic-resonance-xxx.vercel.app`

这些域名可以直接使用，无需配置。

---

## 📊 部署状态

### 查看部署历史

1. 进入项目页面
2. 点击 **"Deployments"** 标签
3. 查看所有部署记录

### 部署状态说明

- 🟢 **Ready**: 部署成功，可以访问
- 🟡 **Building**: 正在部署
- 🔴 **Error**: 部署失败（查看日志）

---

## 🔄 更新网站

### 自动更新

每次你推送代码到 GitHub：

```bash
cd "/Users/jojodd/Desktop/1.0算命前端"
git add .
git commit -m "更新内容"
git push origin main
```

Vercel 会自动检测并重新部署（通常 30 秒内完成）。

### 手动重新部署

1. 进入 Vercel 项目页面
2. 点击 **"Deployments"**
3. 找到之前的部署
4. 点击 **"Redeploy"**

---

## 🆚 Vercel vs GitHub Pages

| 特性 | Vercel | GitHub Pages |
|------|--------|--------------|
| 部署速度 | ⚡ 很快（30秒） | 🐢 较慢（2-5分钟） |
| 私有仓库 | ✅ 支持 | ❌ 需要付费 |
| 自动部署 | ✅ 是 | ✅ 是 |
| 自定义域名 | ✅ 免费 | ✅ 免费 |
| 配置难度 | 🟢 简单 | 🟡 中等 |
| 预览部署 | ✅ 支持 | ❌ 不支持 |

---

## ⚠️ 常见问题

### Q: 部署后显示空白页面？

A: 
- 检查 `index.html` 是否在根目录
- 检查文件路径是否正确（区分大小写）
- 查看 Vercel 部署日志中的错误信息

### Q: 资源文件（CSS/JS）加载失败？

A:
- 检查文件路径（使用相对路径）
- 确保所有文件都已提交到 GitHub
- 清除浏览器缓存

### Q: 如何回退到之前的版本？

A:
1. 进入 "Deployments" 页面
2. 找到之前的部署
3. 点击 "..." → "Promote to Production"

---

## 🎉 完成！

部署完成后，你就可以：

1. ✅ **分享链接**给任何人
2. ✅ **自动更新**（每次推送代码）
3. ✅ **全球访问**（CDN 加速）
4. ✅ **完全免费**

---

**现在就开始部署吧！** 🚀

访问：https://vercel.com

