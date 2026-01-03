const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const router = express.Router();

// 登录尝试限制（内存存储，生产环境建议使用 Redis）
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 分钟

// 清理过期的登录尝试记录
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of loginAttempts.entries()) {
    if (now - value.lastAttempt > LOCKOUT_TIME) {
      loginAttempts.delete(key);
    }
  }
}, 60000); // 每分钟清理一次

// JWT 密钥（从环境变量获取，如果没有则使用默认值）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h'; // Token 24 小时后过期

// 认证中间件（使用 JWT）
const authenticateTeacher = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: '未授权，请先登录'
      });
    }

    const token = authHeader.substring(7);

    try {
      // 验证 JWT token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 检查 teachers 表是否存在
      try {
        const [teachers] = await pool.query(
          'SELECT * FROM teachers WHERE teacher_id = ?',
          [decoded.teacherId]
        );

        if (teachers.length === 0) {
          return res.status(401).json({
            success: false,
            error: '未授权'
          });
        }

        req.teacher = teachers[0];
        next();
      } catch (dbError) {
        // 如果表不存在，返回友好错误
        if (dbError.code === 'ER_NO_SUCH_TABLE') {
          console.error('teachers 表不存在，请先初始化数据库');
          return res.status(500).json({
            success: false,
            error: '数据库未初始化，请先创建老师账号'
          });
        }
        throw dbError;
      }
    } catch (jwtError) {
      // JWT 验证失败（过期、无效等）
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: '登录已过期，请重新登录'
        });
      }
      return res.status(401).json({
        success: false,
        error: '无效的登录凭证'
      });
    }
  } catch (error) {
    console.error('认证错误:', error);
    res.status(500).json({
      success: false,
      error: '认证失败'
    });
  }
};

// 老师登录
router.post('/login', async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
      return res.status(400).json({
        success: false,
        error: '請提供老師帳號和密碼'
      });
    }

    // 检查登录尝试次数限制
    const clientIp = req.ip || req.connection.remoteAddress;
    const attemptKey = `${clientIp}:${teacherId}`;
    const attempts = loginAttempts.get(attemptKey);

    if (attempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        if (timeSinceLastAttempt < LOCKOUT_TIME) {
          const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 1000 / 60);
          return res.status(429).json({
            success: false,
            error: `登录尝试次数过多，请 ${remainingTime} 分钟后再试`
          });
        } else {
          // 锁定时间已过，重置计数
          loginAttempts.delete(attemptKey);
        }
      }
    }

    // 查询老师
    const [teachers] = await pool.query(
      'SELECT * FROM teachers WHERE teacher_id = ?',
      [teacherId]
    );

    if (teachers.length === 0) {
      return res.status(401).json({
        success: false,
        error: '帳號或密碼錯誤'
      });
    }

    const teacher = teachers[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, teacher.password);
    if (!isValidPassword) {
      // 记录失败的登录尝试
      const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      currentAttempts.count += 1;
      currentAttempts.lastAttempt = Date.now();
      loginAttempts.set(attemptKey, currentAttempts);

      const remainingAttempts = MAX_LOGIN_ATTEMPTS - currentAttempts.count;
      return res.status(401).json({
        success: false,
        error: remainingAttempts > 0
          ? `帳號或密碼錯誤，還剩 ${remainingAttempts} 次嘗試機會`
          : '帳號或密碼錯誤，已達到最大嘗試次數'
      });
    }

    // 登录成功，清除登录尝试记录
    loginAttempts.delete(attemptKey);

    // 生成 JWT token
    const token = jwt.sign(
      {
        teacherId: teacher.teacher_id,
        teacherName: teacher.teacher_name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 返回老师信息（不包含密码）
    res.json({
      success: true,
      teacher: {
        teacherId: teacher.teacher_id,
        teacherName: teacher.teacher_name
      },
      token: token // 使用 JWT token
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
});

// 检查登录状态
router.get('/check-auth', authenticateTeacher, async (req, res) => {
  res.json({
    success: true,
    teacher: {
      teacherId: req.teacher.teacher_id,
      teacherName: req.teacher.teacher_name
    }
  });
});

// 初始化老师账号（仅创建表，不创建默认账号）
router.post('/init-teacher', async (req, res) => {
  try {
    // 只创建 teachers 表（如果不存在），不创建默认账号
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id VARCHAR(50) UNIQUE NOT NULL,
        teacher_name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    res.json({
      success: true,
      message: 'teachers 表已创建，请手动添加老师账号'
    });
  } catch (error) {
    console.error('初始化 teachers 表错误:', error);
    res.status(500).json({
      success: false,
      error: '初始化失败'
    });
  }
});

// 獲取所有學生資料（需要认证）
router.get('/students', authenticateTeacher, async (req, res) => {
  try {
    // 獲取所有學生基本資料
    const [students] = await pool.query(
      `SELECT 
        s.student_id,
        s.student_name,
        s.email,
        s.created_at,
        s.last_login,
        CASE 
          WHEN s.last_login IS NULL THEN 'inactive'
          WHEN s.last_login > DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 'active'
          ELSE 'inactive'
        END as status
      FROM students s
      ORDER BY s.student_name ASC`
    );

    // 為每個學生計算作業完成度和平均成績
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        // 計算作業完成度（假設有作業表，這裡使用示例邏輯）
        const [completionData] = await pool.query(
          `SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
          FROM assignments 
          WHERE student_id = ?`,
          [student.student_id]
        ).catch(() => [[{ total: 0, completed: 0 }]]);

        const total = completionData[0]?.total || 0;
        const completed = completionData[0]?.completed || 0;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // 計算平均成績
        const [gradeData] = await pool.query(
          `SELECT AVG(score) as avg_score
          FROM grades 
          WHERE student_id = ?`,
          [student.student_id]
        ).catch(() => [[{ avg_score: null }]]);

        const averageGrade = gradeData[0]?.avg_score
          ? parseFloat(gradeData[0].avg_score).toFixed(1)
          : null;

        return {
          ...student,
          completion_rate: completionRate,
          average_grade: averageGrade
        };
      })
    );

    res.json({
      success: true,
      students: studentsWithStats
    });

  } catch (error) {
    console.error('獲取學生資料錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
});

// 獲取單個學生詳情（需要认证）
router.get('/students/:studentId', authenticateTeacher, async (req, res) => {
  try {
    const { studentId } = req.params;

    const [students] = await pool.query(
      `SELECT * FROM students WHERE student_id = ?`,
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        error: '學生不存在'
      });
    }

    const student = students[0];

    // 獲取學生成績
    const [grades] = await pool.query(
      `SELECT * FROM grades WHERE student_id = ? ORDER BY exam_date DESC`,
      [studentId]
    );

    // 獲取學習心得
    const [reflections] = await pool.query(
      `SELECT * FROM reflections WHERE student_id = ? ORDER BY created_at DESC LIMIT 5`,
      [studentId]
    );

    res.json({
      success: true,
      student: {
        ...student,
        grades: grades,
        reflections: reflections
      }
    });

  } catch (error) {
    console.error('獲取學生詳情錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
});

module.exports = router;
