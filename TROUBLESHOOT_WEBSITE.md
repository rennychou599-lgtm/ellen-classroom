# 🔧 网站无法访问 - 故障排除指南

## 🔍 检查步骤

### 步骤 1: 查看服务日志

1. **在 Railway 项目页面，点击后端服务**
2. **进入 "Logs" 标签**
3. **查看最后几行日志**

**应该看到**：
```
🚀 服务器运行在端口 3000
✅ 数据库连接成功
```

**如果有错误**，请告诉我具体的错误信息。

### 步骤 2: 检查端口配置

1. **进入 "Networking" 标签**
2. **确认 "Target port" 设置为 `3000`**
3. **如果不对，更新为 `3000`**

### 步骤 3: 测试健康检查端点

访问：
```
https://ellen-classroom-production.up.railway.app/health
```

**如果返回**：
```json
{"status":"ok","message":"服务器运行正常"}
```
说明服务器正在运行，问题可能在路由配置。

**如果无法访问**，说明服务器没有正常启动。

### 步骤 4: 检查服务启动命令

1. **进入后端服务的 "Settings" → "Deploy"**
2. **检查 "Start Command"**：
   - 应该是：`node server.js`
   - 或者：`cd backend && node server.js`（如果 Root Directory 不是 backend）

### 步骤 5: 检查 Root Directory

1. **进入 "Settings" 标签**
2. **查找 "Root Directory" 或 "Working Directory"**
3. **应该设置为**：`backend`
4. **如果不对，更新为 `backend`**

## 🐛 常见问题

### 问题 1: 服务器没有启动

**症状**：访问任何 URL 都无响应

**解决**：
- 查看 Logs 确认是否有启动错误
- 检查 Start Command 是否正确
- 确认 Root Directory 设置为 `backend`

### 问题 2: 端口不匹配

**症状**：服务运行但无法访问

**解决**：
- 在 Networking 标签确认 Target port 是 `3000`
- 检查服务器是否监听正确的端口

### 问题 3: 路由问题

**症状**：可以访问 `/health` 但无法访问首页

**解决**：
- 检查 `server.js` 中的静态文件配置
- 确认路由配置正确

### 问题 4: 数据库连接失败

**症状**：服务器启动但功能不正常

**解决**：
- 检查环境变量配置
- 确认 MySQL 服务正在运行
- 查看数据库连接日志

## 📋 请提供以下信息

1. **Logs 中最后几行显示什么？**
2. **访问 `/health` 端点有响应吗？**
3. **Root Directory 设置为什么？**
4. **Start Command 是什么？**
5. **Target port 是多少？**

---

**根据这些信息，我可以帮您进一步诊断问题！** 🔍
