# 🗄️ 数据库初始化步骤（最简单方法）

## ✅ 推荐方法：在 Railway 数据库管理界面执行 SQL

### 步骤：

1. **在 Railway 项目页面，点击 MySQL 服务**（绿色的 MySQL 图标）

2. **进入 "Data" 标签**或 **"Query" 标签**
   - 如果看到 "Data" 标签，点击它
   - 如果看到 "Query" 或 "SQL Editor"，点击它

3. **打开 SQL 编辑器**
   - 会看到一个文本输入框或编辑器
   - 可能有一个 "New Query" 或 "Execute SQL" 按钮

4. **复制 SQL 脚本**
   - 打开项目中的 `init-database.sql` 文件
   - 或者直接复制下面的 SQL 语句

5. **粘贴并执行**
   - 将 SQL 语句粘贴到编辑器中
   - 点击 "Run"、"Execute" 或 "▶️" 按钮执行

6. **检查结果**
   - 如果成功，会看到 "Success" 或类似提示
   - 如果失败，会显示错误信息

## 📋 完整的 SQL 脚本

SQL 脚本已保存在：`init-database.sql`

或者直接复制以下内容：

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

## ⚠️ 关于示例数据

示例学生和成绩数据可以在表创建后，通过网站 API 添加，或者稍后手动插入。

## ✅ 验证初始化成功

执行 SQL 后，检查：

1. **在 Railway 数据库界面**，查看表列表
   - 应该看到：`students`, `grades`, `reflections`, `progress`, `feedback` 这 5 个表

2. **或者执行查询**：
   ```sql
   SHOW TABLES;
   ```
   应该显示 5 个表

---

**完成数据库初始化后，您的网站就可以正常使用了！** 🎉
