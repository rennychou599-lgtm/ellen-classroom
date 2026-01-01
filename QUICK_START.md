# 🚀 快速开始指南

## 📦 本地开发

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

创建 `backend/.env` 文件：

```env
PORT=3000
NODE_ENV=development

# 本地 MySQL 配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=ellen_classroom
DB_PORT=3306

JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5500
```

### 3. 初始化数据库

确保 MySQL 已安装并运行，然后：

```bash
cd backend
npm run init-db
```

这会创建所有必要的表和示例数据。

### 4. 启动后端服务器

```bash
cd backend
npm start
# 或使用开发模式（自动重启）
npm run dev
```

后端将在 http://localhost:3000 运行

### 5. 启动前端

使用任何静态文件服务器，例如：

```bash
# 使用 Python
python3 -m http.server 5500

# 或使用 VS Code Live Server
# 或使用其他静态文件服务器
```

前端将在 http://localhost:5500 运行

### 6. 测试登录

- 访问 http://localhost:5500
- 使用测试账号登录：
  - 账号：`1000`
  - 密码：`1000`

## 🌐 Railway 部署

详细部署步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署步骤：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署"
   git push
   ```

2. **在 Railway 创建项目**
   - 访问 https://railway.app
   - 使用 GitHub 登录
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 选择您的仓库

3. **添加 MySQL 数据库**
   - 在项目页面点击 "+ New"
   - 选择 "Database" → "Add MySQL"

4. **配置环境变量**
   - 进入 "Variables" 标签
   - 添加：
     ```
     PORT=3000
     NODE_ENV=production
     JWT_SECRET=你的随机密钥
     FRONTEND_URL=https://你的域名.railway.app
     ```

5. **初始化数据库**
   - 使用 Railway CLI 或数据库管理界面运行初始化脚本

6. **部署完成！**
   - Railway 会自动部署
   - 访问您的 Railway 域名即可使用

## 📝 注意事项

- **数据库连接**：Railway 会自动提供 MySQL 环境变量，代码已自动适配
- **API 地址**：前端会自动检测环境并使用正确的 API 地址
- **CORS**：确保 `FRONTEND_URL` 环境变量设置正确

## 🆘 遇到问题？

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的"常见问题"部分。
