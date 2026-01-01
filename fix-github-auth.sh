#!/bin/bash

# 🔧 修复 GitHub 认证问题
# 清除 Ben-One0708 的凭据，配置为 rennychou599-lgtm

echo "🔧 开始修复 GitHub 认证..."
echo ""

cd "$(dirname "$0")"

# 步骤 1: 清除旧的 remote（如果需要）
echo "📝 步骤 1: 检查 remote 配置..."
if git remote get-url origin &>/dev/null; then
    current_url=$(git remote get-url origin)
    echo "   当前 remote: $current_url"
    
    if [[ "$current_url" != *"rennychou599-lgtm"* ]]; then
        echo "   ⚠️  需要更新 remote URL"
        read -p "   是否移除旧的 remote？(y/n) " answer
        if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
            git remote remove origin
            git remote add origin https://github.com/rennychou599-lgtm/ellen-classroom.git
            echo "   ✅ Remote 已更新"
        fi
    else
        echo "   ✅ Remote URL 正确"
    fi
else
    echo "   ➕ 添加新的 remote..."
    git remote add origin https://github.com/rennychou599-lgtm/ellen-classroom.git
    echo "   ✅ Remote 已添加"
fi
echo ""

# 步骤 2: 清除 macOS Keychain 中的 GitHub 凭据
echo "🔑 步骤 2: 清除旧的 GitHub 凭据..."

# 方法 1: 使用 git credential helper
echo "   正在清除 git credential cache..."
printf "host=github.com\nprotocol=https\n\n" | git credential-osxkeychain erase 2>/dev/null || true

# 方法 2: 使用 security 命令清除所有 GitHub 相关凭据
echo "   正在清除 macOS Keychain 中的 GitHub 凭据..."
security delete-internet-password -s github.com 2>/dev/null && echo "   ✅ 已清除 GitHub 凭据" || echo "   ℹ️  未找到存储的凭据"

# 方法 3: 清除 git credential cache（如果使用 cache）
git credential-cache exit 2>/dev/null || true

echo "   ✅ 凭据清除完成"
echo ""

# 步骤 3: 显示当前配置
echo "📋 步骤 3: 当前配置"
echo "   Remote URL: $(git remote get-url origin 2>/dev/null || echo '未配置')"
echo "   Git 用户: $(git config user.name)"
echo "   Git 邮箱: $(git config user.email)"
echo ""

# 步骤 4: 测试连接
echo "🧪 步骤 4: 测试连接..."
echo "   现在可以尝试推送代码："
echo ""
echo "   git push -u origin main"
echo ""
echo "   💡 提示："
echo "   - 如果使用 HTTPS，会提示输入用户名和密码"
echo "   - 用户名：rennychou599-lgtm"
echo "   - 密码：使用 Personal Access Token（不是 GitHub 密码）"
echo "   - 创建 Token: https://github.com/settings/tokens/new"
echo ""

echo "✅ 修复完成！"
echo ""
echo "📝 下一步："
echo "   1. 创建 Personal Access Token（如果还没有）"
echo "   2. 执行: git push -u origin main"
echo "   3. 输入用户名: rennychou599-lgtm"
echo "   4. 输入密码: 粘贴您的 Personal Access Token"
echo ""
