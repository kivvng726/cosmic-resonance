# 在 GitHub 创建仓库步骤

## 🎯 目标
在 `jojodd77` 账户下创建名为 `cosmic-resonance` 的仓库

## 📝 详细步骤

### 方法一：通过网页创建（推荐）

1. **访问 GitHub**
   - 打开 https://github.com
   - 使用 `jojodd77` 账户登录

2. **创建新仓库**
   - 点击右上角的 **"+"** 图标
   - 选择 **"New repository"**

3. **填写仓库信息**
   ```
   Repository name: cosmic-resonance
   Description: 寰宇回响 - 沉浸式星象互动占卜装置
   Visibility: 
     ○ Public (公开，推荐)
     ○ Private (私有)
   
   ⚠️ 重要：不要勾选以下选项：
     ☐ Add a README file
     ☐ Add .gitignore
     ☐ Choose a license
   ```
   （因为本地仓库已经包含这些文件）

4. **创建仓库**
   - 点击绿色的 **"Create repository"** 按钮

5. **推送代码**
   创建完成后，在终端运行：
   ```bash
   cd "/Users/jojodd/Desktop/1.0算命前端"
   git push -u origin main
   ```

### 方法二：使用 GitHub CLI（如果已安装）

```bash
# 安装 GitHub CLI（如果还没安装）
# macOS: brew install gh

# 登录 GitHub
gh auth login

# 创建仓库并推送
cd "/Users/jojodd/Desktop/1.0算命前端"
gh repo create jojodd77/cosmic-resonance --public --source=. --remote=origin --push
```

## ✅ 创建完成后

仓库创建成功后，运行以下命令推送代码：

```bash
cd "/Users/jojodd/Desktop/1.0算命前端"
git push -u origin main
```

## 🔐 认证说明

推送时可能需要认证：

### 使用 Personal Access Token（推荐）

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写信息：
   - Note: `cosmic-resonance-push`
   - Expiration: 根据需要选择
   - Scopes: 勾选 `repo` 权限
4. 点击 "Generate token"
5. 复制生成的 token（只显示一次！）
6. 推送时使用 token 作为密码

### 使用 SSH（更安全，推荐长期使用）

1. 生成 SSH 密钥：
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. 添加 SSH 密钥到 GitHub：
   - 复制公钥：`cat ~/.ssh/id_ed25519.pub`
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

3. 修改远程地址为 SSH：
   ```bash
   git remote set-url origin git@github.com:jojodd77/cosmic-resonance.git
   ```

## 📍 当前配置

- **远程仓库地址**: `https://github.com/jojodd77/cosmic-resonance.git`
- **本地分支**: `main`
- **状态**: 等待在 GitHub 上创建仓库

## 🚀 快速命令

创建仓库后，直接运行：

```bash
cd "/Users/jojodd/Desktop/1.0算命前端" && git push -u origin main
```

---

**提示**：如果遇到认证问题，请参考上面的认证说明部分。


