-- 创建老师表
-- 在 Railway 数据库管理界面执行此 SQL

CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id VARCHAR(50) UNIQUE NOT NULL,
  teacher_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 注意：密码需要使用 bcrypt 加密
-- 建议使用 API 端点自动创建：POST /api/admin/init-teacher
-- 或者先创建表，然后通过登录功能自动创建默认账号
-- 默认账号：A100，密码：999
