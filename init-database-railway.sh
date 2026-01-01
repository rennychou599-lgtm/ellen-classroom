#!/bin/bash

# 🗄️ Railway 数据库初始化脚本

echo "🚀 开始初始化 Railway 数据库..."
echo ""

cd "$(dirname "$0")"

# 检查 Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 正在安装 Railway CLI..."
    npm i -g @railway/cli
    echo ""
fi

# 检查是否已链接项目
if ! railway status &>/dev/null; then
    echo "🔗 需要链接到 Railway 项目..."
    echo "   请按照提示选择您的 ellen-classroom 项目"
    railway link
    echo ""
fi

echo "🗄️  正在初始化数据库..."
echo "   这可能需要几秒钟..."
echo ""

# 运行初始化脚本
railway run cd backend && npm run init-db

echo ""
echo "✅ 完成！"
echo ""
echo "📝 如果看到 '🎉 数据库初始化完成！' 说明初始化成功"
echo ""
