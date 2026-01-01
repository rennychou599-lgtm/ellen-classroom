# 🗄️ Railway 数据库初始化 - 替代方法

## 方法 1: 使用 Railway 数据库管理界面（最简单）

### 步骤：

1. **在 Railway 项目页面，点击 MySQL 服务**（不是后端服务）
2. **进入 "Data" 标签**或 **"Query" 标签**
3. **点击 "SQL Editor"** 或 **"Query"** 按钮
4. **复制以下 SQL 语句并执行**：

```sql
-- 创建学生表
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建成绩表
CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  comment TEXT,
  exam_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建学习心得表
CREATE TABLE IF NOT EXISTS reflections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  subject VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建复习进度表
CREATE TABLE IF NOT EXISTS progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  week INT NOT NULL,
  subject VARCHAR(50) NOT NULL,
  status ENUM('not-started', 'in-progress', 'completed', 'reviewed') DEFAULT 'not-started',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (student_id, week, subject),
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建老师反馈表
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

5. **点击 "Run" 或 "Execute"** 执行 SQL

6. **插入示例数据**（可选，用于测试）：

```sql
-- 插入示例学生（密码是 1000 的加密版本）
INSERT INTO students (student_id, student_name, password) 
VALUES ('1000', '示例学生', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q') 
ON DUPLICATE KEY UPDATE student_name=student_name;

-- 插入示例成绩
INSERT INTO grades (student_id, subject, score, comment) VALUES
('1000', '國文', 85, '閱讀理解能力良好，建議多練習作文'),
('1000', '英文', 78, '單字量充足，文法需要加強'),
('1000', '數學', 92, '數學基礎扎實，繼續保持！'),
('1000', '自然', 90, '實驗操作熟練，概念理解深入'),
('1000', '社會', 88, '歷史事件掌握良好，建議加強地理')
ON DUPLICATE KEY UPDATE score=VALUES(score);
```

**注意**：示例学生的密码需要先加密。如果上面的密码不工作，可以暂时跳过，稍后通过 API 创建。

## 方法 2: 查找 Build Command 的正确位置

Railway 界面可能在不同位置，尝试：

1. **后端服务** → **"Settings"** → 查找：
   - "Build"
   - "Build Settings"
   - "Deploy Settings"
   - "Configuration"
   - "General"

2. **后端服务** → **"Variables"** 标签旁边可能有其他设置

3. **后端服务** → 点击服务名称旁边的 **⚙️ 设置图标**

4. 查看是否有 **"Source"** 或 **"Deploy"** 标签

## 方法 3: 使用 Railway CLI（如果已安装）

```bash
cd /Users/hsienjenchiu/Desktop/IMJH
railway run cd backend && npm run init-db
```

## 方法 4: 等待部署后自动初始化

如果您的 `backend/server.js` 在启动时检查数据库连接，可以修改代码在首次启动时自动初始化（需要修改代码）。

---

**推荐使用方法 1**（直接在数据库管理界面执行 SQL），这是最直接的方法！
