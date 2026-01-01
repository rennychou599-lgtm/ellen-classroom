# 📱 VS Code 移动端预览扩展推荐

## 🎯 最佳推荐

### 1. **Live Server**（最常用）
- **扩展 ID**: `ritwickdey.LiveServer`
- **功能**:
  - 启动本地服务器
  - 自动刷新
  - 可以在手机浏览器中访问（同一网络）
- **使用方法**:
  1. 安装扩展
  2. 右键 HTML 文件 → "Open with Live Server"
  3. 在手机浏览器输入电脑的 IP 地址访问

### 2. **Browser Preview**（推荐）
- **扩展 ID**: `auchenberg.vscode-browser-preview`
- **功能**:
  - 在 VS Code 内嵌浏览器预览
  - 支持 Chrome DevTools
  - 可以模拟移动设备
- **使用方法**:
  1. 安装扩展
  2. 按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows)
  3. 输入 "Browser Preview: Open Preview"
  4. 在浏览器中按 `F12` 打开开发者工具
  5. 点击设备模拟图标（手机/平板图标）

### 3. **Live Preview**（Microsoft 官方）
- **扩展 ID**: `ms-vscode.live-server`
- **功能**:
  - Microsoft 官方扩展
  - 内置浏览器预览
  - 支持响应式设计模式
- **使用方法**:
  1. 安装扩展
  2. 右键 HTML 文件 → "Show Preview"
  3. 在预览窗口可以调整设备尺寸

## 🔧 响应式设计工具

### 4. **Responsive Viewer**
- **扩展 ID**: `peterhdd.twresponsive`
- **功能**:
  - 同时预览多个设备尺寸
  - 支持自定义设备尺寸
  - 实时同步滚动
- **使用方法**:
  1. 安装扩展
  2. 打开 HTML 文件
  3. 按 `Cmd+Shift+P` → "Responsive Viewer: Open"

### 5. **Device Preview**
- **扩展 ID**: `kraigj.device-preview`
- **功能**:
  - 模拟各种设备尺寸
  - iPhone、iPad、Android 等预设
- **使用方法**:
  1. 安装扩展
  2. 在状态栏选择设备尺寸

## 🌐 浏览器集成

### 6. **Open in Browser**
- **扩展 ID**: `techer.open-in-browser`
- **功能**:
  - 快速在默认浏览器中打开
  - 支持右键菜单
- **使用方法**:
  1. 安装扩展
  2. 右键 HTML 文件 → "Open in Browser"
  3. 在浏览器中按 `F12` 打开开发者工具
  4. 使用设备模拟功能

## 💡 推荐组合使用

### 方案 1: Live Server + 手机浏览器（最实用）
1. 安装 **Live Server**
2. 启动本地服务器
3. 在手机浏览器访问（需要同一 WiFi）
4. 实时查看移动端效果

### 方案 2: Browser Preview + Chrome DevTools（最方便）
1. 安装 **Browser Preview**
2. 在 VS Code 内预览
3. 使用 Chrome DevTools 的设备模拟
4. 可以快速切换不同设备

### 方案 3: Responsive Viewer（多设备对比）
1. 安装 **Responsive Viewer**
2. 同时查看多个设备尺寸
3. 方便对比不同屏幕效果

## 📱 使用 Chrome DevTools 设备模拟

即使不使用扩展，也可以：

1. **在浏览器中打开网站**（使用 Live Server 或其他方式）
2. **按 `F12` 或 `Cmd+Option+I` (Mac) 打开开发者工具**
3. **点击设备模拟图标**（手机/平板图标，或按 `Cmd+Shift+M`）
4. **选择设备**：
   - iPhone 12/13/14
   - iPad
   - Samsung Galaxy
   - 或自定义尺寸

## 🚀 快速开始

### 推荐安装（最简单）：

```bash
# 在 VS Code 扩展市场搜索并安装：
1. Live Server (ritwickdey.LiveServer)
2. Browser Preview (auchenberg.vscode-browser-preview)
```

### 使用步骤：

1. **安装 Live Server**
2. **右键 `index.html` → "Open with Live Server"**
3. **在浏览器中按 `F12` 打开开发者工具**
4. **点击设备模拟图标**（或按 `Cmd+Shift+M`）
5. **选择设备尺寸测试**

---

**推荐使用 Live Server + Chrome DevTools，这是最常用且最有效的方法！** 🎯
