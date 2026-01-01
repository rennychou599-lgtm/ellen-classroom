# 🎓 鈺倫の教室 - 后端系统

## 📁 项目结构

```
IMJH/
├── backend/                 # 后端代码
│   ├── config/             # 配置文件
│   │   └── database.js     # 数据库连接配置
│   ├── routes/             # API 路由
│   │   ├── auth.js        # 认证路由（登录）
│   │   ├── grades.js      # 成绩路由
│   │   ├── reflections.js # 学习心得路由
│   │   ├── progress.js    # 复习进度路由
│   │   └── feedback.js    # 老师反馈路由
│   ├── scripts/           # 脚本文件
│   │   └── init-database.js # 数据库初始化脚本
│   ├── server.js          # Express 服务器入口
│   ├── package.json       # 项目依赖
│   ├── railway.toml       # Railway 部署配置
│   └── Procfile          # Railway 进程配置
├── api.js                 # 前端 API 服务（调用后端）
├── DEPLOYMENT.md          # 详细部署指南
├── QUICK_START.md         # 快速开始指南
└── INTEGRATION_EXAMPLE.md # 前端集成示例
```

## 🗄️ 数据库表结构

### 1. students（学生表）
- `id`: 主键
- `student_id`: 学号（唯一）
- `student_name`: 学生姓名
- `password`: 加密密码
- `created_at`, `updated_at`: 时间戳

### 2. grades（成绩表）
- `id`: 主键
- `student_id`: 学生ID（外键）
- `subject`: 科目
- `score`: 分数
- `comment`: 评语
- `exam_date`: 考试日期
- `created_at`, `updated_at`: 时间戳

### 3. reflections（学习心得表）
- `id`: 主键
- `student_id`: 学生ID（外键）
- `date`: 日期
- `subject`: 科目
- `content`: 心得内容
- `created_at`, `updated_at`: 时间戳

### 4. progress（复习进度表）
- `id`: 主键
- `student_id`: 学生ID（外键）
- `week`: 周次
- `subject`: 科目
- `status`: 状态（not-started, in-progress, completed, reviewed）
- `created_at`, `updated_at`: 时间戳
- 唯一约束：`(student_id, week, subject)`

### 5. feedback（老师反馈表）
- `id`: 主键
- `student_id`: 学生ID（外键）
- `title`: 标题
- `content`: 内容
- `is_read`: 是否已读
- `created_at`, `updated_at`: 时间戳

## 🔌 API 端点

### 认证
- `POST /api/auth/login` - 学生登录
- `GET /api/auth/me` - 获取当前学生信息

### 成绩
- `GET /api/grades?studentId=xxx` - 获取学生成绩
- `POST /api/grades` - 添加成绩（管理员）

### 学习心得
- `GET /api/reflections?studentId=xxx` - 获取学习心得
- `POST /api/reflections` - 添加学习心得
- `DELETE /api/reflections/:id?studentId=xxx` - 删除学习心得

### 复习进度
- `GET /api/progress?studentId=xxx` - 获取复习进度
- `PUT /api/progress` - 更新单个进度
- `PUT /api/progress/batch` - 批量更新进度

### 老师反馈
- `GET /api/feedback?studentId=xxx` - 获取反馈
- `PUT /api/feedback/:id/read` - 标记为已读
- `POST /api/feedback` - 添加反馈（管理员）

## 🚀 快速开始

### 本地开发

1. **安装依赖**
   ```bash
   cd backend
   npm install
   ```

2. **配置环境变量**
   创建 `backend/.env` 文件（参考 `.env.example`）

3. **初始化数据库**
   ```bash
   npm run init-db
   ```

4. **启动服务器**
   ```bash
   npm start
   # 或开发模式
   npm run dev
   ```

### Railway 部署

详细步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

**快速步骤：**
1. 推送代码到 GitHub
2. 在 Railway 创建项目并连接 GitHub
3. 添加 MySQL 数据库
4. 配置环境变量
5. 初始化数据库
6. 部署完成！

## 🔧 技术栈

- **后端框架**: Express.js
- **数据库**: MySQL
- **ORM**: mysql2 (原生 SQL)
- **认证**: bcryptjs (密码加密)
- **部署平台**: Railway

## 📝 环境变量

### 必需变量
- `DB_HOST` / `MYSQL_HOST` - 数据库主机
- `DB_USER` / `MYSQL_USER` - 数据库用户
- `DB_PASSWORD` / `MYSQLPASSWORD` - 数据库密码
- `DB_NAME` / `MYSQL_DATABASE` - 数据库名
- `DB_PORT` / `MYSQL_PORT` - 数据库端口

### 可选变量
- `PORT` - 服务器端口（默认: 3000）
- `NODE_ENV` - 环境（development/production）
- `JWT_SECRET` - JWT 密钥（未来使用）
- `FRONTEND_URL` - 前端域名（CORS 配置）

## 🎯 下一步

1. **前端集成**：参考 [INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md) 将前端代码改为使用 API
2. **测试**：确保所有功能正常工作
3. **部署**：按照 [DEPLOYMENT.md](./DEPLOYMENT.md) 部署到 Railway
4. **监控**：设置日志和监控

## 📚 相关文档

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 详细部署指南
- [QUICK_START.md](./QUICK_START.md) - 快速开始指南
- [INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md) - 前端集成示例

## 🆘 需要帮助？

查看文档中的"常见问题"部分，或检查 Railway 日志。

---

**祝开发顺利！🎉**
