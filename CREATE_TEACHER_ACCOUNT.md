# 创建老师账号说明

## 方法 1: 使用 API 初始化（最简单，推荐）

部署到 Railway 后，访问以下 API 端点来创建老师账号：

```
POST /api/admin/init-teacher
```

或者使用 curl 命令：

```bash
curl -X POST https://your-railway-url.railway.app/api/admin/init-teacher
```

这个 API 会自动：
1. 创建 teachers 表（如果不存在）
2. 创建老师账号 A100，密码为 999（已加密）

## 方法 2: 在 Railway 数据库管理界面执行 SQL

1. 在 Railway 项目页面，点击 **MySQL 服务**
2. 进入 **"Data"** 或 **"Query"** 标签
3. 点击 **"SQL Editor"** 或 **"Query"** 按钮
4. 复制并执行 `backend/scripts/create-teacher.sql` 文件中的 SQL

**注意**: SQL 文件中的密码 hash 是占位符，执行后需要通过 API 或脚本更新密码。

## 方法 3: 使用 Node.js 脚本（需要本地环境）

在项目根目录运行：

```bash
cd backend
npm install
node scripts/create-teacher.js
```

## 账号信息

- **账号**: A100
- **密码**: 999
- **姓名**: 鈺倫老師

## 验证

创建账号后，可以尝试登录管理后台：
1. 访问 `/admin.html`
2. 输入账号和密码
3. 如果登录成功，说明账号创建成功
