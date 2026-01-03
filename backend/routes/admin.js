const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const router = express.Router();

// 认证中间件
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
    // 简单的 token 验证（实际应该使用 JWT）
    // 这里使用 localStorage 存储的 token
    const teacherId = token;
    
    const [teachers] = await pool.query(
      'SELECT * FROM teachers WHERE teacher_id = ?',
      [teacherId]
    );

    if (teachers.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: '未授权' 
      });
    }

    req.teacher = teachers[0];
    next();
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
      return res.status(401).json({ 
        success: false,
        error: '帳號或密碼錯誤' 
      });
    }

    // 返回老师信息（不包含密码）
    res.json({
      success: true,
      teacher: {
        teacherId: teacher.teacher_id,
        teacherName: teacher.teacher_name
      },
      token: teacher.teacher_id // 简单的 token（实际应该使用 JWT）
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
