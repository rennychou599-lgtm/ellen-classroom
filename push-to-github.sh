#!/bin/bash

# GitHub 推送脚本
# 使用方法：bash push-to-github.sh

echo "🚀 准备推送到 GitHub..."
echo ""

# 检查当前分支
current_branch=$(git branch --show-current)
echo "当前分支: $current_branch"
echo ""

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  发现未提交的更改，是否要提交？(y/n)"
    read -r answer
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        echo "请输入提交信息："
        read -r commit_message
        if [ -z "$commit_message" ]; then
            commit_message="更新代码"
        fi
        git add -A
        git commit -m "$commit_message"
        echo "✅ 已提交更改"
    else
        echo "❌ 取消推送"
        exit 1
    fi
fi

# 检查 remote 配置
remote_url=$(git remote get-url origin 2>/dev/null)
echo "Remote URL: $remote_url"
echo ""

# 如果是 HTTPS，提示使用 SSH 或 Token
if [[ "$remote_url" == https://* ]]; then
    echo "⚠️  当前使用 HTTPS 方式，推送时需要认证"
    echo "选项："
    echo "1. 使用 Personal Access Token（当提示密码时，输入 token）"
    echo "2. 或先配置 SSH（参考 SETUP_SSH.md）"
    echo ""
fi

# 推送代码
echo "正在推送到 GitHub..."
if git push -u origin "$current_branch"; then
    echo ""
    echo "✅ 推送成功！"
    echo "📦 代码已推送到: https://github.com/rennychou599-lgtm/ellen-classroom"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的解决方案："
    echo "1. 如果使用 HTTPS：创建 Personal Access Token 并使用它作为密码"
    echo "2. 如果使用 SSH：确保 SSH key 已添加到 GitHub（参考 SETUP_SSH.md）"
    echo "3. 检查网络连接"
    exit 1
fi
