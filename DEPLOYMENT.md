# 🚀 部署指南 - Railway

本指南将帮助您将「鈺倫の教室」部署到 Railway 平台。

## 📋 前置要求

1. **GitHub 账号**（用于代码托管）
2. **Railway 账号**（免费注册：https://railway.app）
3. **Node.js 18+**（本地开发需要）

## 🛠️ 步骤 1: 准备代码

### 1.1 初始化 Git 仓库（如果还没有）

```bash
cd /Users/hsienjenchiu/Desktop/IMJH
git init
git add .
git commit -m "Initial commit: 鈺倫の教室项目"
```

### 1.2 推送到 GitHub

1. 在 GitHub 创建新仓库（例如：`ellen-classroom`）
2. 将代码推送到 GitHub：

```bash
git remote add origin https://github.com/rennychou599-lgtm/ellen-classroom.git
git branch -M main
git push -u origin main
```

## 🚂 步骤 2: 在 Railway 创建项目

### 2.1 登录 Railway

1. 访问 https://railway.app
2. 使用 GitHub 账号登录
3. 点击 "New Project"

### 2.2 从 GitHub 导入项目

1. 选择 "Deploy from GitHub repo"
2. 选择您的仓库（`ellen-classroom`）
3. Railway 会自动检测项目

### 2.3 添加 MySQL 数据库

1. 在项目页面，点击 "+ New"
2. 选择 "Database" → "Add MySQL"
3. Railway 会自动创建 MySQL 数据库并设置环境变量

## ⚙️ 步骤 3: 配置环境变量

在 Railway 项目页面，进入 "Variables" 标签，添加以下环境变量：

### 必需的环境变量（Railway 会自动提供 MySQL 相关变量）

Railway 会自动创建以下变量（无需手动添加）：
- `MYSQL_HOST` → 映射到 `DB_HOST`
- `MYSQL_USER` → 映射到 `DB_USER`
- `MYSQLPASSWORD` → 映射到 `DB_PASSWORD`
- `MYSQL_DATABASE` → 映射到 `DB_NAME`
- `MYSQL_PORT` → 映射到 `DB_PORT`

### 需要手动添加的环境变量

在 Railway 的 Variables 页面，添加：

```
PORT=3000
NODE_ENV=production
JWT_SECRET=你的随机密钥（可以生成一个长随机字符串）
FRONTEND_URL=https://你的域名.com
```

**生成 JWT_SECRET 的方法：**
```bash
# 在终端运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 修改 server.js 以适配 Railway 的 MySQL 变量

Railway 的 MySQL 插件使用的变量名不同，我们需要在 `backend/config/database.js` 中适配：

```javascript
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'ellen_classroom',
  port: process.env.MYSQL_PORT || process.env.DB_PORT || 3306,
  // ... 其他配置
});
```

## 🗄️ 步骤 4: 初始化数据库

### 4.1 在 Railway 中运行数据库初始化脚本

1. 在 Railway 项目页面，点击后端服务
2. 进入 "Settings" → "Deploy"
3. 在 "Build Command" 中添加：
   ```
   cd backend && npm install && npm run init-db
   ```
4. 或者在部署后，进入 "Deployments" → 点击最新部署 → "View Logs"
5. 在终端中运行（需要先连接到 Railway CLI）：

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 链接到项目
railway link

# 运行初始化脚本
railway run cd backend && npm run init-db
```

### 4.2 或者使用 Railway 的数据库管理界面

1. 点击 MySQL 服务
2. 进入 "Data" 标签
3. 使用 SQL 编辑器运行 `backend/scripts/init-database.js` 中的 SQL 语句

## 🌐 步骤 5: 配置前端 API 地址

### 5.1 修改 api.js

在 `api.js` 文件中，确保 API 地址配置正确：

```javascript
// 生产环境自动使用相对路径
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
```

### 5.2 配置反向代理（推荐）

由于前端和后端可能部署在不同的服务上，您需要：

**选项 A：使用 Railway 的静态文件服务**
1. 在 Railway 项目中添加 "Static Files" 服务
2. 将前端文件（HTML/CSS/JS）放在 `public` 文件夹
3. 配置 Express 提供静态文件服务

**选项 B：使用 Nginx 反向代理（如果使用自己的服务器）**

**选项 C：修改前端使用绝对 API 地址**

在 `api.js` 中：

```javascript
// 检测生产环境
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

const API_BASE_URL = isProduction 
  ? 'https://你的后端域名.railway.app/api'
  : 'http://localhost:3000/api';
```

## 📦 步骤 6: 部署前端静态文件

### 选项 A：使用 Railway 静态文件服务

1. 在 Railway 项目中添加新服务
2. 选择 "Static Files"
3. 设置根目录为项目根目录
4. 设置输出目录为 `/`（根目录）

### 选项 B：使用 Vercel/Netlify（推荐用于前端）

1. 将前端代码推送到 GitHub
2. 在 Vercel/Netlify 导入项目
3. 配置环境变量 `API_URL` 为您的 Railway 后端地址

## 🔧 步骤 7: 更新 Express 服务器以提供静态文件

修改 `backend/server.js`，添加静态文件服务：

```javascript
const path = require('path');

// 提供静态文件（前端）
app.use(express.static(path.join(__dirname, '../')));

// API 路由
app.use('/api/auth', authRoutes);
// ... 其他路由

// SPA 路由回退（所有非 API 路由返回 index.html）
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../index.html'));
  }
});
```

## ✅ 步骤 8: 验证部署

1. **检查后端健康状态**
   - 访问：`https://你的域名.railway.app/health`
   - 应该返回：`{"status":"ok","message":"服务器运行正常"}`

2. **测试 API**
   - 访问：`https://你的域名.railway.app/api/grades?studentId=1000`
   - 应该返回成绩数据或错误信息

3. **测试前端**
   - 访问您的前端域名
   - 尝试登录（账号：1000，密码：1000）

## 🐛 常见问题

### 问题 1: 数据库连接失败

**解决方案：**
- 检查环境变量是否正确设置
- 确保 MySQL 服务已启动
- 检查 `backend/config/database.js` 中的变量映射

### 问题 2: CORS 错误

**解决方案：**
- 在 `backend/server.js` 中更新 `FRONTEND_URL` 环境变量
- 确保前端域名已添加到 CORS 配置

### 问题 3: 前端无法连接到 API

**解决方案：**
- 检查 `api.js` 中的 API 地址配置
- 确保后端服务已成功部署
- 检查浏览器控制台的网络请求

### 问题 4: 数据库表不存在

**解决方案：**
- 运行数据库初始化脚本：`npm run init-db`
- 或手动执行 SQL 创建表

## 📚 后续步骤

1. **设置自定义域名**（可选）
   - 在 Railway 项目设置中添加自定义域名

2. **配置 HTTPS**
   - Railway 自动提供 HTTPS 证书

3. **监控和日志**
   - 在 Railway 项目页面查看日志和监控

4. **备份数据库**
   - Railway 提供数据库备份功能

## 🆘 需要帮助？

- Railway 文档：https://docs.railway.app
- Railway Discord：https://discord.gg/railway

---

**祝部署顺利！🎉**
