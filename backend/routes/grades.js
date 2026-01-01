const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// 获取学生成绩
router.get('/', async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: '请提供学生ID' });
    }

    const [grades] = await pool.query(
      `SELECT subject, score, comment, exam_date 
       FROM grades 
       WHERE student_id = ? 
       ORDER BY exam_date DESC, subject ASC`,
      [studentId]
    );

    res.json({ grades });

  } catch (error) {
    console.error('获取成绩错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加成绩（管理员功能，可选）
router.post('/', async (req, res) => {
  try {
    const { studentId, subject, score, comment, examDate } = req.body;

    if (!studentId || !subject || score === undefined) {
      return res.status(400).json({ error: '请提供完整信息' });
    }

    await pool.query(
      `INSERT INTO grades (student_id, subject, score, comment, exam_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, subject, score, comment || null, examDate || null]
    );

    res.json({ success: true, message: '成绩已添加' });

  } catch (error) {
    console.error('添加成绩错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
