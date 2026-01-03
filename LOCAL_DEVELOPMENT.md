# 💻 本地开发环境设置指南

## 🎯 快速开始（最简单的方法）

### 方法 1: 使用后端服务器（推荐）

后端服务器会自动提供所有静态文件（包括 `admin.html`），所以只需要启动后端即可。

#### 步骤：

1. **安装依赖**
   ```bash
   cd backend
   npm install
   ```

2. **创建环境变量文件**（可选，如果没有本地数据库）
   
   创建 `backend/.env` 文件：
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=local-dev-secret-key-12345
   ```

   **注意**：如果没有本地 MySQL 数据库，服务器仍会启动，只是无法连接数据库。但您仍然可以：
   - 查看 `admin.html` 页面
   - 看到登录界面
   - 测试前端功能

3. **启动后端服务器**
   ```bash
   cd backend
   npm start
   # 或使用开发模式（自动重启）
   npm run dev
   ```

4. **访问管理后台**
   
   打开浏览器，访问：
   ```
   http://localhost:3000/admin.html
   ```

   ✅ 完成！您应该能看到登录页面了。

---

### 方法 2: 使用静态文件服务器（仅查看页面，无 API 功能）

如果您只是想查看页面样式，不需要 API 功能：

1. **使用 Python（如果已安装）**
   ```bash
   # 在项目根目录执行
   python3 -m http.server 8000
   ```
   
   然后访问：`http://localhost:8000/admin.html`

2. **使用 VS Code Live Server**
   - 安装 "Live Server" 扩展
   - 右键点击 `admin.html`
   - 选择 "Open with Live Server"

3. **使用 Node.js http-server**
   ```bash
   # 安装
   npm install -g http-server
   
   # 在项目根目录执行
   http-server -p 8000
   ```
   
   然后访问：`http://localhost:8000/admin.html`

---

## 🔧 完整本地开发环境（包含数据库）

如果您想完整测试所有功能（包括登录、查看学生列表等）：

### 1. 安装 MySQL（如果还没有）

- **macOS**: `brew install mysql` 或从官网下载
- **Windows**: 从 MySQL 官网下载安装
- **Linux**: `sudo apt-get install mysql-server`

### 2. 创建数据库

```sql
CREATE DATABASE ellen_classroom;
```

### 3. 配置环境变量

创建 `backend/.env` 文件：

```env
PORT=3000
NODE_ENV=development

# 本地 MySQL 配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=ellen_classroom
DB_PORT=3306

JWT_SECRET=local-dev-secret-key-12345
FRONTEND_URL=http://localhost:3000
```

### 4. 初始化数据库

```bash
cd backend
npm run init-db
```

### 5. 创建老师账号

有三种方法：

**方法 A: 使用本地脚本（最简单，推荐）**
```bash
cd backend
npm run create-teacher
```

**方法 B: 使用 API（需要先启动服务器）**
```bash
# 启动服务器后，在另一个终端执行
curl -X POST http://localhost:3000/api/admin/init-teacher
```

**方法 C: 手动执行 SQL**
在 MySQL 中执行 `backend/scripts/create-teacher.sql`

**账号信息**（创建后可使用）：
- 账号：`A100`
- 密码：`999`

### 6. 启动服务器

```bash
cd backend
npm start
```

### 7. 访问管理后台

打开浏览器访问：
```
http://localhost:3000/admin.html
```

**登录信息**：
- 账号和密码请参考 `CREATE_TEACHER_ACCOUNT.md` 文件
- 或使用 `curl -X POST http://localhost:3000/api/admin/init-teacher` 创建默认账号后，查看该 API 的说明

---

## 🐛 常见问题

### 问题 1: 端口已被占用

**错误信息**：`Error: listen EADDRINUSE: address already in use :::3000`

**解决方法**：
1. 更改端口：在 `backend/.env` 中设置 `PORT=3001`
2. 或关闭占用端口的程序

### 问题 2: 数据库连接失败

**错误信息**：`❌ 数据库连接失败`

**解决方法**：
1. 确认 MySQL 正在运行
2. 检查 `.env` 文件中的数据库配置
3. 确认数据库已创建
4. **如果只是想查看页面**，可以忽略这个错误，服务器仍会启动

### 问题 3: 无法登录

**可能原因**：
1. 数据库未初始化（没有 `teachers` 表）
2. 老师账号未创建

**解决方法**：
1. 运行 `npm run init-db` 初始化数据库
2. 运行 `curl -X POST http://localhost:3000/api/admin/init-teacher` 创建老师账号

### 问题 4: 页面显示但 API 请求失败

**可能原因**：
- 后端服务器未启动
- 端口不匹配

**解决方法**：
1. 确认后端服务器正在运行
2. 检查浏览器控制台的错误信息
3. 确认 API 请求的 URL 正确（应该是 `http://localhost:3000/api/...`）

---

## 📋 检查清单

在访问管理后台之前，确认：

- [ ] 已安装 Node.js（版本 >= 18）
- [ ] 已安装依赖（`cd backend && npm install`）
- [ ] 后端服务器正在运行（`npm start`）
- [ ] 浏览器访问 `http://localhost:3000/admin.html`
- [ ] （可选）MySQL 已安装并运行
- [ ] （可选）数据库已初始化
- [ ] （可选）老师账号已创建

---

## 🎉 完成！

现在您应该能在本地看到老师管理后台了！

如果遇到任何问题，请检查：
1. 后端服务器的日志输出
2. 浏览器的开发者工具（F12）中的错误信息
3. 网络请求是否成功
