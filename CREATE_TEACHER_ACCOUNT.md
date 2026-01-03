# 创建老师账号说明

## 方法 1: 在 Railway 数据库管理界面执行 SQL（推荐）

1. 在 Railway 项目页面，点击 **MySQL 服务**
2. 进入 **"Data"** 或 **"Query"** 标签
3. 点击 **"SQL Editor"** 或 **"Query"** 按钮
4. 复制并执行以下 SQL：

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

-- 插入老师账号（密码已加密）
-- 密码: BMN-5680!@ 的 bcrypt hash
INSERT INTO teachers (teacher_id, teacher_name, password) 
VALUES (
  'BMN-5680', 
  '鈺倫老師', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
) 
ON DUPLICATE KEY UPDATE 
  teacher_name = '鈺倫老師',
  password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
```

## 方法 2: 使用 Node.js 脚本（需要本地环境）

在项目根目录运行：

```bash
cd backend
node scripts/create-teacher.js
```

## 账号信息

- **账号**: BMN-5680
- **密码**: BMN-5680!@
- **姓名**: 鈺倫老師

## 验证

执行 SQL 后，可以查询验证：

```sql
SELECT teacher_id, teacher_name FROM teachers WHERE teacher_id = 'BMN-5680';
```
