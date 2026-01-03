# 🚂 Railway 完整设置指南

## ⚠️ 如果遇到"伺服器錯誤"，请按以下步骤检查：

---

## 📋 步骤 1: 检查数据库环境变量（最重要！）

### 问题原因
后端服务需要访问 MySQL 数据库，但 Railway 的 MySQL 环境变量默认只在 MySQL 服务中，后端服务无法直接访问。

### 解决方法：添加变量引用

1. **在 Railway 项目页面，点击后端服务**（不是 MySQL 服务）
   - 服务名称可能是：`ellen-classroom` 或 `ellen-classroom-production`

2. **进入 "Variables" 标签**

3. **点击 "+ New Variable" 或 "Add Variable"**

4. **添加以下变量引用**（选择 "Reference" 而不是直接输入值）：

   | 变量名 | 引用来源 |
   |--------|---------|
   | `MYSQLHOST` | Reference to MySQL.MYSQLHOST |
   | `MYSQLUSER` | Reference to MySQL.MYSQLUSER |
   | `MYSQLPASSWORD` | Reference to MySQL.MYSQLPASSWORD |
   | `MYSQLDATABASE` | Reference to MySQL.MYSQLDATABASE |
   | `MYSQLPORT` | Reference to MySQL.MYSQLPORT |

   **如何添加引用：**
   - 点击 "Add Reference" 或选择 "Reference" 选项
   - 选择 MySQL 服务
   - 选择对应的变量名

5. **保存**（Railway 会自动重新部署）

### 验证
部署完成后，查看 "Logs" 标签，应该看到：
```
🔍 数据库连接配置:
  Host: [MySQL 主机地址]
  User: [MySQL 用户]
  Database: [数据库名]
  Port: [端口]
✅ 数据库连接成功
```

---

## 📋 步骤 2: 初始化数据库表

### 方法 A: 使用 API（推荐，最简单）

1. **等待部署完成**（确保步骤 1 已完成）

2. **访问初始化 API**：
   ```
   POST https://ellen-classroom-production.up.railway.app/api/admin/init-teacher
   ```

   可以使用以下方式：
   - **浏览器**：无法直接 POST，请使用方法 B 或 C
   - **curl 命令**：
     ```bash
     curl -X POST https://ellen-classroom-production.up.railway.app/api/admin/init-teacher
     ```
   - **Postman** 或类似工具

3. **这个 API 会自动**：
   - 创建 `teachers` 表（如果不存在）
   - 创建老师账号 `BMN-5680`，密码 `BMN-5680!@`（已加密）

### 方法 B: 在 Railway 数据库管理界面执行 SQL

1. **在 Railway 项目页面，点击 MySQL 服务**（绿色的 MySQL 图标）

2. **进入 "Data" 标签**或 **"Query" 标签**

3. **点击 "SQL Editor" 或 "Query" 按钮**

4. **复制并执行以下 SQL**：

```sql
-- 创建老师表
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id VARCHAR(50) UNIQUE NOT NULL,
  teacher_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

5. **然后执行以下 SQL 创建老师账号**（密码需要先加密，建议使用方法 A 的 API）

---

## 📋 步骤 3: 检查其他必需的环境变量

在后端服务的 "Variables" 标签中，确保有以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PORT` | `3000` 或 Railway 分配的端口 | 服务器端口 |
| `NODE_ENV` | `production` | 环境模式 |

**注意**：`PORT` 变量 Railway 可能会自动设置，如果没有，请手动添加。

---

## 📋 步骤 4: 检查部署日志

1. **在后端服务的 "Logs" 标签中查看**

2. **查找错误信息**：
   - 如果看到 `❌ 数据库连接失败`，说明步骤 1 未完成
   - 如果看到 `ER_NO_SUCH_TABLE`，说明步骤 2 未完成
   - 如果看到其他错误，请记录错误信息

3. **正常启动应该看到**：
   ```
   🚀 服务器运行在端口 3000
   📡 API 地址: http://localhost:3000/api
   🌍 环境: production
   🔍 数据库连接配置:
     Host: [地址]
     User: [用户]
     Database: [数据库名]
     Port: [端口]
   ✅ 数据库连接成功
   ```

---

## 📋 步骤 5: 测试管理后台

1. **访问管理后台**：
   ```
   https://ellen-classroom-production.up.railway.app/admin.html
   ```

2. **应该看到登录页面**

3. **如果显示"伺服器錯誤"**：
   - 检查步骤 1-4 是否都完成
   - 查看 Railway 日志中的具体错误信息

4. **登录测试**：
   - 账号：`BMN-5680`
   - 密码：`BMN-5680!@`

---

## 🔍 常见问题排查

### 问题 1: "数据库连接失败"
**原因**：环境变量未正确设置  
**解决**：完成步骤 1，添加数据库变量引用

### 问题 2: "ER_NO_SUCH_TABLE: Table 'teachers' doesn't exist"
**原因**：teachers 表未创建  
**解决**：完成步骤 2，初始化数据库表

### 问题 3: "路由不存在" 或 "404"
**原因**：静态文件路由问题  
**解决**：代码已修复，等待重新部署

### 问题 4: "伺服器錯誤"（500 错误）
**原因**：可能是数据库连接或表不存在  
**解决**：
1. 检查步骤 1（环境变量）
2. 检查步骤 2（数据库表）
3. 查看 Railway 日志获取具体错误信息

---

## ✅ 检查清单

在继续之前，请确认：

- [ ] 步骤 1：已添加数据库环境变量引用（MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT）
- [ ] 步骤 2：已初始化 teachers 表（使用 API 或 SQL）
- [ ] 步骤 3：已检查其他环境变量（PORT, NODE_ENV）
- [ ] 步骤 4：已查看部署日志，确认无错误
- [ ] 步骤 5：已测试访问 admin.html

---

## 📞 如果仍然有问题

请提供以下信息：
1. Railway 日志中的具体错误信息
2. 访问哪个 URL 时出错
3. 错误的具体表现（是 500 错误、404 错误，还是其他？）
