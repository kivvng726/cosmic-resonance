# 快速启用 GitHub Pages - 两种方法

## 🚀 方法一：使用自动化脚本（推荐）

### 步骤：

1. **获取 GitHub Personal Access Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写信息：
     - **Note**: `GitHub Pages Setup`
     - **Expiration**: 根据需要选择（建议 90 天）
     - **Scopes**: 勾选 ✅ **`repo`** 权限
   - 点击 "Generate token"
   - **重要**：复制生成的 token（只显示一次！）

2. **运行脚本**
   ```bash
   cd "/Users/jojodd/Desktop/1.0算命前端"
   ./启用GitHubPages.sh
   ```
   
3. **输入 Token**
   - 粘贴刚才复制的 token
   - 按回车

4. **完成！**
   - 脚本会自动启用 GitHub Pages
   - 等待 1-2 分钟后访问：`https://jojodd77.github.io/cosmic-resonance/`

---

## 🌐 方法二：手动在网页上启用（更简单）

### 步骤：

1. **打开仓库设置**
   - 访问：https://github.com/jojodd77/cosmic-resonance/settings/pages
   - 或：进入仓库 → 点击 "Settings" → 左侧找到 "Pages"

2. **配置 Pages**
   - 在 **"Source"** 下拉菜单中选择 **"Deploy from a branch"**
   - 在 **"Branch"** 中选择 **"main"**
   - 在 **"Folder"** 中选择 **"/ (root)"**
   - 点击 **"Save"** 按钮

3. **等待部署**
   - 等待 1-2 分钟
   - 页面会显示你的网站地址：
     ```
     https://jojodd77.github.io/cosmic-resonance/
     ```

4. **访问网站**
   - 点击显示的链接
   - 或直接访问：`https://jojodd77.github.io/cosmic-resonance/`

---

## ✅ 验证部署

部署完成后，你应该能看到：

- ✅ 网站可以正常访问
- ✅ 所有页面正常显示
- ✅ 3D 星空功能正常
- ✅ 占卜功能正常

---

## 🔗 分享你的网站

部署完成后，你可以：

1. **直接分享链接**
   ```
   https://jojodd77.github.io/cosmic-resonance/
   ```

2. **生成二维码**
   - 使用在线工具：https://www.qrcode-monkey.com/
   - 输入你的网站链接
   - 生成二维码供手机扫描

3. **嵌入到其他网站**
   ```html
   <iframe src="https://jojodd77.github.io/cosmic-resonance/" 
           width="100%" 
           height="600px"
           frameborder="0">
   </iframe>
   ```

---

## ⚠️ 常见问题

### Q: 网站显示 404？
A: 
- 等待几分钟（首次部署需要时间）
- 检查分支是否正确（应该是 main）
- 清除浏览器缓存后重试

### Q: 更新代码后网站没变化？
A:
- 等待几分钟（CDN 缓存更新需要时间）
- 清除浏览器缓存（Ctrl+F5 或 Cmd+Shift+R）
- 检查代码是否已推送到 GitHub

### Q: 可以自定义域名吗？
A:
- 可以！在 Pages 设置中可以添加自定义域名
- 需要在域名 DNS 中添加 CNAME 记录指向 `jojodd77.github.io`

---

## 🎯 推荐

**推荐使用方法二（手动启用）**，因为：
- ✅ 不需要 Token
- ✅ 操作简单
- ✅ 可以立即看到结果
- ✅ 更安全

---

**现在就开始部署吧！** 🚀

