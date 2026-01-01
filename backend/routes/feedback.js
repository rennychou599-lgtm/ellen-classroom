const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// 获取老师反馈
router.get('/', async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: '请提供学生ID' });
    }

    const [feedback] = await pool.query(
      `SELECT id, title, content, is_read, created_at 
       FROM feedback 
       WHERE student_id = ? 
       ORDER BY created_at DESC`,
      [studentId]
    );

    res.json({ feedback });

  } catch (error) {
    console.error('获取老师反馈错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 标记反馈为已读
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: '请提供学生ID' });
    }

    const [result] = await pool.query(
      'UPDATE feedback SET is_read = TRUE WHERE id = ? AND student_id = ?',
      [id, studentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '反馈不存在或无权操作' });
    }

    res.json({ success: true, message: '已标记为已读' });

  } catch (error) {
    console.error('标记反馈已读错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加反馈（管理员功能，可选）
router.post('/', async (req, res) => {
  try {
    const { studentId, title, content } = req.body;

    if (!studentId || !title || !content) {
      return res.status(400).json({ error: '请提供完整信息' });
    }

    const [result] = await pool.query(
      `INSERT INTO feedback (student_id, title, content) 
       VALUES (?, ?, ?)`,
      [studentId, title, content]
    );

    res.json({
      success: true,
      message: '反馈已添加',
      id: result.insertId
    });

  } catch (error) {
    console.error('添加反馈错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
