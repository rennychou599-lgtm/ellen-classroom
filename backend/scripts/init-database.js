const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  let connection;

  try {
    // 连接到 MySQL 服务器（不指定数据库）
    // 支持 Railway 的 MySQL 环境变量命名
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
      port: process.env.MYSQL_PORT || process.env.DB_PORT || 3306
    });

    console.log('📦 开始初始化数据库...');

    // 创建数据库（如果不存在）
    const dbName = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'ellen_classroom';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ 数据库 ${dbName} 已创建或已存在`);

    // 使用数据库
    await connection.query(`USE \`${dbName}\``);

    // 创建学生表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        student_name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ 学生表已创建');

    // 创建成绩表
    await connection.query(`
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
    `);
    console.log('✅ 成绩表已创建');

    // 创建学习心得表
    await connection.query(`
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
    `);
    console.log('✅ 学习心得表已创建');

    // 创建复习进度表
    await connection.query(`
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
    `);
    console.log('✅ 复习进度表已创建');

    // 创建老师反馈表
    await connection.query(`
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
    `);
    console.log('✅ 老师反馈表已创建');

    // 插入示例学生数据（如果不存在）
    const [existingStudents] = await connection.query('SELECT COUNT(*) as count FROM students');
    if (existingStudents[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('1000', 10);

      await connection.query(`
        INSERT INTO students (student_id, student_name, password) 
        VALUES ('1000', '示例学生', ?)
      `, [hashedPassword]);

      console.log('✅ 已插入示例学生数据 (学号: 1000, 密码: 1000)');

      // 插入示例成绩
      const sampleGrades = [
        ['1000', '國文', 85, '閱讀理解能力良好，建議多練習作文'],
        ['1000', '英文', 78, '單字量充足，文法需要加強'],
        ['1000', '數學', 92, '數學基礎扎實，繼續保持！'],
        ['1000', '自然', 90, '實驗操作熟練，概念理解深入'],
        ['1000', '社會', 88, '歷史事件掌握良好，建議加強地理']
      ];

      for (const [studentId, subject, score, comment] of sampleGrades) {
        await connection.query(`
          INSERT INTO grades (student_id, subject, score, comment) 
          VALUES (?, ?, ?, ?)
        `, [studentId, subject, score, comment]);
      }
      console.log('✅ 已插入示例成绩数据');
    }

    console.log('\n🎉 数据库初始化完成！');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行初始化
initDatabase();
