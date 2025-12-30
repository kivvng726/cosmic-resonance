#!/bin/bash

# 启用 GitHub Pages 的自动化脚本

echo "🌌 正在启用 GitHub Pages..."
echo ""

# GitHub 仓库信息
REPO_OWNER="jojodd77"
REPO_NAME="cosmic-resonance"
BRANCH="main"

echo "仓库: $REPO_OWNER/$REPO_NAME"
echo "分支: $BRANCH"
echo ""

# 检查是否已安装 curl
if ! command -v curl &> /dev/null; then
    echo "❌ 错误: 需要安装 curl"
    echo "请运行: brew install curl"
    exit 1
fi

# 提示用户输入 GitHub Token
echo "📝 需要 GitHub Personal Access Token 来启用 Pages"
echo ""
echo "如果没有 Token，请按以下步骤获取："
echo "1. 访问: https://github.com/settings/tokens"
echo "2. 点击 'Generate new token' → 'Generate new token (classic)'"
echo "3. 填写信息："
echo "   - Note: GitHub Pages Setup"
echo "   - Expiration: 根据需要选择"
echo "   - Scopes: 勾选 'repo' 权限"
echo "4. 点击 'Generate token'"
echo "5. 复制生成的 token（只显示一次！）"
echo ""
read -p "请输入你的 GitHub Personal Access Token: " GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 错误: Token 不能为空"
    exit 1
fi

echo ""
echo "⏳ 正在启用 GitHub Pages..."

# 使用 GitHub API 启用 Pages
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pages" \
  -d "{
    \"source\": {
      \"branch\": \"$BRANCH\",
      \"path\": \"/\"
    }
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ GitHub Pages 已成功启用！"
    echo ""
    echo "🌐 你的网站地址："
    echo "   https://$REPO_OWNER.github.io/$REPO_NAME/"
    echo ""
    echo "⏳ 请等待 1-2 分钟让 GitHub 完成部署..."
    echo "   然后访问上面的链接即可看到你的网站！"
elif [ "$HTTP_CODE" -eq 422 ]; then
    echo "ℹ️  Pages 可能已经启用，正在检查状态..."
    
    # 检查 Pages 状态
    STATUS_RESPONSE=$(curl -s -w "\n%{http_code}" \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pages")
    
    STATUS_CODE=$(echo "$STATUS_RESPONSE" | tail -n1)
    STATUS_BODY=$(echo "$STATUS_RESPONSE" | sed '$d')
    
    if [ "$STATUS_CODE" -eq 200 ]; then
        echo "✅ GitHub Pages 已经启用！"
        echo ""
        echo "🌐 你的网站地址："
        echo "   https://$REPO_OWNER.github.io/$REPO_NAME/"
    else
        echo "❌ 无法检查 Pages 状态"
        echo "响应: $STATUS_BODY"
    fi
elif [ "$HTTP_CODE" -eq 401 ]; then
    echo "❌ 认证失败：Token 无效或已过期"
    echo "请检查你的 Personal Access Token"
elif [ "$HTTP_CODE" -eq 403 ]; then
    echo "❌ 权限不足：Token 没有足够的权限"
    echo "请确保 Token 有 'repo' 权限"
else
    echo "❌ 启用失败"
    echo "HTTP 状态码: $HTTP_CODE"
    echo "响应: $BODY"
    echo ""
    echo "💡 提示：你也可以手动在 GitHub 网页上启用："
    echo "   1. 访问: https://github.com/$REPO_OWNER/$REPO_NAME/settings/pages"
    echo "   2. 选择分支: $BRANCH"
    echo "   3. 点击 Save"
fi

echo ""

