-- 创建老师表
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id VARCHAR(50) UNIQUE NOT NULL,
  teacher_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入老师账号（密码需要先加密，这里提供一个临时方案）
-- 注意：实际使用时，密码应该通过 bcrypt 加密
-- 密码: BMN-5680!@ 的 bcrypt hash (rounds=10)
-- 您可以在 Railway 数据库管理界面执行此 SQL，然后运行 create-teacher.js 来加密密码
-- 或者使用以下方式：在 Node.js 环境中运行 create-teacher.js

-- 临时插入（密码未加密，需要后续更新）
INSERT INTO teachers (teacher_id, teacher_name, password) 
VALUES ('BMN-5680', '鈺倫老師', '$2a$10$placeholder') 
ON DUPLICATE KEY UPDATE teacher_name = '鈺倫老師';

-- 注意：实际密码需要通过 bcrypt 加密
-- 请在 Railway 部署后，通过 API 或脚本更新密码
