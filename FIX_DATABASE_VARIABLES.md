# 🔧 修复数据库环境变量连接

## ⚠️ 问题说明

您看到的警告信息：
> "Trying to connect this database to a service? Add a Variable Reference"

这说明：**MySQL 的环境变量在 MySQL 服务中，但后端服务无法访问它们**。

后端服务需要这些变量来连接数据库：
- `MYSQL_HOST` 或 `MYSQLHOST`
- `MYSQL_USER` 或 `MYSQLUSER`
- `MYSQL_PASSWORD` 或 `MYSQLPASSWORD`
- `MYSQL_DATABASE` 或 `MYSQLDATABASE`
- `MYSQL_PORT` 或 `MYSQLPORT`
- `MYSQL_URL`

## ✅ 解决方案：添加 Variable Reference

### 步骤：

1. **在 Railway 项目页面，点击后端服务**（不是 MySQL 服务）
   - 应该是 `ellen-classroom` 或 `ellen-classroom-production`

2. **进入 "Variables" 标签**

3. **点击 "+ New Variable" 或 "Add Variable"**

4. **添加变量引用**（不是直接输入值，而是引用 MySQL 服务的变量）：

   对于每个需要的变量，点击 "Add Reference" 或选择 "Reference" 选项，然后：

   - **Variable Name**: `MYSQL_HOST`
   - **Value**: 选择 "Reference" → 选择 MySQL 服务 → 选择 `MYSQLHOST`
   
   或者直接添加以下变量引用：

   ```
   MYSQL_HOST → Reference to MySQL.MYSQLHOST
   MYSQL_USER → Reference to MySQL.MYSQLUSER
   MYSQL_PASSWORD → Reference to MySQL.MYSQLPASSWORD
   MYSQL_DATABASE → Reference to MySQL.MYSQLDATABASE
   MYSQL_PORT → Reference to MySQL.MYSQLPORT
   MYSQL_URL → Reference to MySQL.MYSQL_URL
   ```

5. **保存**

### 或者：使用 MYSQL_URL（更简单）

如果 MySQL 服务有 `MYSQL_URL` 变量：

1. **在后端服务的 Variables 中**
2. **添加变量引用**：
   - **Name**: `MYSQL_URL`
   - **Value**: 选择 "Reference" → MySQL 服务 → `MYSQL_URL`

然后修改 `backend/config/database.js` 来使用 `MYSQL_URL`。

## 🔍 检查步骤

### 1. 确认变量已添加

在后端服务的 "Variables" 标签中，应该看到：
- `MYSQL_HOST` 或 `MYSQLHOST`（显示为引用）
- `MYSQL_USER` 或 `MYSQLUSER`
- `MYSQL_PASSWORD` 或 `MYSQLPASSWORD`
- `MYSQL_DATABASE` 或 `MYSQLDATABASE`
- `MYSQL_PORT` 或 `MYSQLPORT`

### 2. 检查后端服务日志

添加变量后，Railway 会自动重新部署。查看日志应该看到：
```
✅ 数据库连接成功
```

如果仍然失败，检查错误信息。

## 📝 快速方法

### 方法 1: 在 MySQL 服务中添加 Variable Reference

1. **点击 MySQL 服务**
2. **进入 "Variables" 标签**
3. **点击警告信息中的 "Add a Variable Reference"**
4. **选择后端服务**
5. **选择要引用的变量**

### 方法 2: 在后端服务中手动添加

1. **点击后端服务**
2. **进入 "Variables" 标签**
3. **点击 "+ New Variable"**
4. **对于每个变量**：
   - 点击 "Reference" 选项
   - 选择 MySQL 服务
   - 选择对应的变量名

---

**添加变量引用后，后端服务就能连接到数据库了！** 🚀
