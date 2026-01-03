-- 创建老师表
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id VARCHAR(50) UNIQUE NOT NULL,
  teacher_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入老师账号
-- 账号: BMN-5680
-- 密码: BMN-5680!@ (已使用 bcrypt 加密，rounds=10)
-- 注意：此 hash 是通过 bcrypt.hash('BMN-5680!@', 10) 生成的
INSERT INTO teachers (teacher_id, teacher_name, password) 
VALUES (
  'BMN-5680', 
  '鈺倫老師', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
) 
ON DUPLICATE KEY UPDATE 
  teacher_name = '鈺倫老師',
  password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
