# 🚀 下一步操作指南

## ✅ 已完成
- [x] 代码已推送到 GitHub
- [x] Railway 项目已创建
- [x] MySQL 数据库已添加
- [x] 环境变量已配置

## 📋 接下来需要做的

### 步骤 1: 初始化数据库（创建表结构）

您需要运行数据库初始化脚本来创建所有必要的表。

#### 方法 A: 使用 Railway CLI（推荐）

在终端执行：

```bash
# 1. 安装 Railway CLI（如果还没有）
npm i -g @railway/cli

# 2. 登录 Railway
railway login

# 3. 进入项目目录
cd /Users/hsienjenchiu/Desktop/IMJH

# 4. 链接到项目（选择您的 ellen-classroom 项目）
railway link

# 5. 运行数据库初始化脚本
railway run --service 你的后端服务名 cd backend && npm run init-db
```

或者更简单的方式：

```bash
railway run cd backend && npm run init-db
```

#### 方法 B: 使用 Railway 数据库管理界面

1. 在 Railway 项目页面，点击 **MySQL 服务**
2. 进入 **"Data"** 标签
3. 点击 **"Query"** 或 **"SQL Editor"**
4. 复制 `backend/scripts/init-database.js` 中的 SQL 语句并执行

#### 方法 C: 在 Build Command 中自动初始化

1. 在 Railway 项目页面，点击您的**后端服务**
2. 进入 **"Settings"** → **"Deploy"**
3. 找到 **"Build Command"**
4. 设置为：
   ```
   cd backend && npm install && npm run init-db
   ```
5. 保存后 Railway 会自动重新部署并初始化数据库

### 步骤 2: 检查部署状态

1. 在 Railway 项目页面，查看 **"Deployments"** 标签
2. 确认部署状态为 **"Active"**（绿色）
3. 如果有错误，点击部署查看 **"Logs"**

### 步骤 3: 获取您的网站网址

1. 在 Railway 项目页面，点击您的**后端服务**
2. 进入 **"Settings"** → **"Networking"** 或 **"Domains"**
3. 找到 **"Public Domain"** 或 **"Generated Domain"**
4. 会显示类似：
   ```
   https://ellen-classroom-production.up.railway.app
   ```
5. **复制这个网址**，这就是您的网站地址！

### 步骤 4: 更新 FRONTEND_URL 环境变量

1. 在 Railway 项目页面，进入 **"Variables"** 标签
2. 找到 `FRONTEND_URL`
3. 更新为步骤 3 中获取的实际网址
4. Railway 会自动重新部署

### 步骤 5: 测试网站

1. 访问您的网站网址（步骤 3 获取的）
2. 测试登录功能：
   - 账号：`1000`
   - 密码：`1000`
3. 检查各项功能是否正常

## 🔍 验证数据库是否初始化成功

### 方法 1: 查看 Railway 日志

1. 在 Railway 项目页面，点击后端服务
2. 进入 **"Logs"** 标签
3. 查找类似信息：
   ```
   ✅ 数据库连接成功
   ✅ 学生表已创建
   ✅ 成绩表已创建
   ...
   🎉 数据库初始化完成！
   ```

### 方法 2: 使用 Railway CLI

```bash
railway run cd backend && npm run init-db
```

如果成功，会看到：
```
✅ 数据库连接成功
✅ 学生表已创建
✅ 成绩表已创建
✅ 学习心得表已创建
✅ 复习进度表已创建
✅ 老师反馈表已创建
✅ 已插入示例学生数据
🎉 数据库初始化完成！
```

### 方法 3: 测试 API

访问：
```
https://你的域名.railway.app/health
```

应该返回：
```json
{"status":"ok","message":"服务器运行正常"}
```

## 🐛 如果遇到问题

### 问题 1: 数据库连接失败

**检查：**
- 环境变量是否正确配置
- MySQL 服务是否运行中（绿色状态）

**解决：**
- 确认 MySQL 相关的环境变量已自动生成
- 检查 `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD` 等变量

### 问题 2: 初始化脚本失败

**检查：**
- 查看 Railway 日志中的错误信息
- 确认数据库服务已启动

**解决：**
- 使用 Railway CLI 手动运行初始化脚本
- 或使用数据库管理界面手动执行 SQL

### 问题 3: 网站无法访问

**检查：**
- 部署状态是否为 "Active"
- 是否有错误日志

**解决：**
- 查看 "Logs" 标签中的错误信息
- 确认环境变量配置正确

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 Railway 的 "Logs" 标签获取错误信息
2. 检查环境变量配置
3. 确认所有服务都在运行

---

**完成以上步骤后，您的网站就可以正常访问了！** 🎉
