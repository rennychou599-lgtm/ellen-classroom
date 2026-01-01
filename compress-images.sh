#!/bin/bash

# 🖼️ 图片压缩脚本
# 使用 macOS 内置的 sips 工具压缩图片

echo "🖼️  开始压缩图片..."
echo ""

cd "$(dirname "$0")"

# 检查 sips 是否可用
if ! command -v sips &> /dev/null; then
    echo "❌ sips 工具不可用"
    echo "💡 建议使用在线工具："
    echo "   1. TinyPNG: https://tinypng.com"
    echo "   2. Squoosh: https://squoosh.app"
    exit 1
fi

# 创建备份目录
backup_dir="images_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"

echo "📦 创建备份到: $backup_dir"
echo ""

# 需要压缩的文件列表
files=(
    "ellenlife.png"
    "ellenbook.png"
    "images/bull1.png"
    "images/web.png"
    "ellenlogo.png"
    "Ellennoback.png"
    "images/goal-settings.png"
    "ellenbull.png"
    "EllenANN.png"
    "images/post.png"
    "images/writing.png"
    "images/reading.png"
    "images/report.png"
)

compressed_count=0
skipped_count=0

for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "⚠️  文件不存在: $file"
        skipped_count=$((skipped_count + 1))
        continue
    fi

    # 获取原始大小
    original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    original_size_mb=$(echo "scale=2; $original_size / 1024 / 1024" | bc 2>/dev/null || echo "0")
    
    echo "📸 压缩: $file (原始: ${original_size_mb}MB)"

    # 备份原文件
    cp "$file" "$backup_dir/" 2>/dev/null

    # 使用 sips 压缩（质量 80%）
    # sips 会直接修改原文件
    sips -s format png -s formatOptions 80 "$file" --out "$file.tmp" > /dev/null 2>&1
    
    if [ $? -eq 0 ] && [ -f "$file.tmp" ]; then
        mv "$file.tmp" "$file"
        
        # 获取压缩后大小
        new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        new_size_mb=$(echo "scale=2; $new_size / 1024 / 1024" | bc 2>/dev/null || echo "0")
        
        reduction=$(echo "scale=1; (1 - $new_size / $original_size) * 100" | bc 2>/dev/null || echo "0")
        
        echo "   ✅ 完成: ${new_size_mb}MB (减少 ${reduction}%)"
        compressed_count=$((compressed_count + 1))
    else
        echo "   ⚠️  压缩失败，保留原文件"
        rm -f "$file.tmp"
    fi
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 压缩完成！"
echo "   成功: $compressed_count 个文件"
echo "   跳过: $skipped_count 个文件"
echo "   备份: $backup_dir/"
echo ""
echo "💡 提示："
echo "   1. 如果压缩效果不理想，可以使用在线工具进一步压缩"
echo "   2. 备份文件在: $backup_dir/"
echo "   3. 如果满意，可以删除备份目录"
echo ""
