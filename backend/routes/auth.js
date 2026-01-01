const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const router = express.Router();

// 学生登录
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({ error: '请提供账号和密码' });
    }

    // 查询学生
    const [students] = await pool.query(
      'SELECT * FROM students WHERE student_id = ?',
      [account]
    );

    if (students.length === 0) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const student = students[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    // 返回学生信息（不包含密码）
    res.json({
      success: true,
      student: {
        studentId: student.student_id,
        studentName: student.student_name
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取当前登录学生信息
router.get('/me', async (req, res) => {
  try {
    const studentId = req.query.studentId;

    if (!studentId) {
      return res.status(400).json({ error: '请提供学生ID' });
    }

    const [students] = await pool.query(
      'SELECT student_id, student_name FROM students WHERE student_id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: '学生不存在' });
    }

    res.json({
      student: {
        studentId: students[0].student_id,
        studentName: students[0].student_name
      }
    });

  } catch (error) {
    console.error('获取学生信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
