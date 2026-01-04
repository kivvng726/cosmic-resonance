# 快速上传到 kivvng726 账号

## 📝 步骤概览

1. 在 GitHub 上创建新仓库
2. 更改本地仓库的远程地址
3. 推送代码

---

## 步骤 1: 在 GitHub 上创建新仓库

1. **访问 GitHub**：https://github.com
2. **登录**：使用 kivvng726 账号
3. **创建仓库**：
   - 点击右上角 "+" → "New repository"
   - **Repository name**: `cosmic-resonance`
   - **Description**: `寰宇回响 - 沉浸式星象互动占卜装置`
   - **Visibility**: 选择 Public 或 Private
   - **⚠️ 重要**：不要勾选任何初始化选项（不要添加 README、.gitignore 或 license）
   - 点击 "Create repository"

4. **复制仓库地址**：
   - 创建后会显示类似这样的地址：
     ```
     https://github.com/kivvng726/cosmic-resonance.git
     ```

---

## 步骤 2: 更改本地仓库地址并推送

创建完仓库后，告诉我，我会帮你执行以下命令：

```bash
# 更改远程仓库地址
git remote set-url origin https://github.com/kivvng726/cosmic-resonance.git

# 推送代码
git push -u origin main
```

---

## ⚠️ 如果遇到认证问题

如果推送时要求输入用户名和密码：
- **用户名**：输入 `kivvng726`
- **密码**：输入你的 **Personal Access Token**（不是 GitHub 密码）

### 如何生成 Token：

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 Token
5. 使用这个 Token 作为密码

---

## ✅ 完成检查

上传成功后，访问：
https://github.com/kivvng726/cosmic-resonance

确认所有文件都已上传！

