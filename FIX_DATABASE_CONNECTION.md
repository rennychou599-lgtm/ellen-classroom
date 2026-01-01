# 🔧 修复数据库连接失败

## ⚠️ 问题分析

从日志看到：
```
❌ 数据库连接失败: connect ECONNREFUSED ::1:3306
```

这说明：
1. **服务器已启动**（✅ 运行在端口 8080）
2. **数据库连接失败**（❌ 尝试连接本地 `::1:3306`）

问题原因：**后端服务无法访问 MySQL 的环境变量**，所以使用了默认值（localhost）。

## ✅ 解决方案

### 1. 添加 MySQL 变量引用到后端服务（最重要）

1. **在 Railway 项目页面，点击后端服务**（不是 MySQL 服务）
2. **进入 "Variables" 标签**
3. **点击 "+ New Variable"**
4. **添加以下变量引用**（选择 "Reference" 而不是直接输入值）：

   需要添加的变量：
   - **Name**: `MYSQLHOST` → **Value**: Reference to MySQL.MYSQLHOST
   - **Name**: `MYSQLUSER` → **Value**: Reference to MySQL.MYSQLUSER
   - **Name**: `MYSQLPASSWORD` → **Value**: Reference to MySQL.MYSQLPASSWORD
   - **Name**: `MYSQLDATABASE` → **Value**: Reference to MySQL.MYSQLDATABASE
   - **Name**: `MYSQLPORT` → **Value**: Reference to MySQL.MYSQLPORT

   或者使用 `MYSQL_URL`：
   - **Name**: `MYSQL_URL` → **Value**: Reference to MySQL.MYSQL_URL

5. **保存**（Railway 会自动重新部署）

### 2. 更新 Target Port

服务器运行在端口 **8080**（不是 3000），需要更新：

1. **进入后端服务的 "Networking" 标签**
2. **找到 "Target port"**
3. **更新为 `8080`**
4. **保存**

### 3. 代码已更新

我已经更新了代码：
- 支持 Railway 的 MySQL 变量名（`MYSQLHOST`, `MYSQLUSER` 等）
- 添加了调试日志，显示数据库连接配置

## 🔍 验证步骤

添加变量引用后：

1. **Railway 会自动重新部署**
2. **查看 "Logs" 标签**
3. **应该看到**：
   ```
   🔍 数据库连接配置:
     Host: [MySQL 主机地址]
     User: [MySQL 用户]
     Database: [数据库名]
     Port: [端口]
   ✅ 数据库连接成功
   ```

## 📋 检查清单

- [ ] 后端服务已添加 MySQL 变量引用
- [ ] Target port 更新为 `8080`
- [ ] Logs 显示数据库连接成功
- [ ] 网站可以正常访问

## 🚀 快速方法

### 在 MySQL 服务中添加引用（最简单）

1. **点击 MySQL 服务**
2. **进入 "Variables" 标签**
3. **点击警告信息中的 "Add a Variable Reference"**
4. **选择后端服务**
5. **Railway 会自动添加所有必要的变量引用**

---

**添加变量引用后，数据库连接应该就成功了！** ✅
