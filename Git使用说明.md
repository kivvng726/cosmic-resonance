# Git 仓库使用说明

## ✅ 本地仓库已创建

你的项目已经成功初始化为 Git 仓库，并完成了初始提交！

**提交信息：**
- 提交 ID: `a67bc22`
- 提交信息: "初始提交：寰宇回响 - 沉浸式星象互动占卜装置"
- 包含文件: 11 个文件，3573 行代码

## 📤 连接到远程仓库（GitHub）

### 步骤 1：在 GitHub 创建新仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `cosmic-resonance` 或 `寰宇回响`（建议用英文）
   - **Description**: 沉浸式星象互动占卜装置
   - **Visibility**: Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有）
4. 点击 "Create repository"

### 步骤 2：连接本地仓库到 GitHub

在终端中运行以下命令（替换 `你的用户名` 和 `仓库名`）：

```bash
cd "/Users/jojodd/Desktop/1.0算命前端"

# 添加远程仓库地址
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**示例：**
```bash
git remote add origin https://github.com/jojodd/cosmic-resonance.git
git branch -M main
git push -u origin main
```

### 步骤 3：启用 GitHub Pages（可选）

如果你想通过 GitHub Pages 免费托管网站：

1. 进入仓库的 **Settings**（设置）
2. 找到左侧的 **Pages** 选项
3. 在 **Source** 下拉菜单中选择 **main** 分支
4. 点击 **Save**
5. 等待几分钟后，访问：`https://你的用户名.github.io/仓库名/`

## 🔄 日常使用 Git

### 查看状态
```bash
git status
```

### 添加文件到暂存区
```bash
git add .                    # 添加所有更改
git add 文件名               # 添加特定文件
```

### 提交更改
```bash
git commit -m "描述你的更改"
```

### 推送到远程仓库
```bash
git push
```

### 拉取远程更新
```bash
git pull
```

### 查看提交历史
```bash
git log
```

## 📝 常用 Git 命令速查

```bash
# 初始化仓库（已完成）
git init

# 查看状态
git status

# 添加文件
git add .

# 提交更改
git commit -m "提交信息"

# 连接远程仓库
git remote add origin <仓库地址>

# 推送代码
git push -u origin main

# 拉取代码
git pull

# 查看分支
git branch

# 创建新分支
git branch 分支名

# 切换分支
git checkout 分支名
```

## ⚠️ 注意事项

1. **首次推送需要登录 GitHub**
   - 如果使用 HTTPS，需要输入用户名和密码（或 Personal Access Token）
   - 如果使用 SSH，需要配置 SSH 密钥

2. **Git 配置用户信息**（如果还没配置）
   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱"
   ```

3. **.gitignore 文件**
   - 已创建 `.gitignore` 文件
   - 会自动忽略系统文件、编辑器文件等

## 🎯 下一步

1. ✅ 本地仓库已创建
2. 📤 在 GitHub 创建远程仓库
3. 🔗 连接本地和远程仓库
4. 🚀 推送代码到 GitHub
5. 🌐 启用 GitHub Pages（可选）

---

**提示**：如果遇到问题，可以查看 Git 错误信息，或参考 GitHub 官方文档。


