const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// 获取学生学习心得
router.get('/', async (req, res) => {
  try {
    const { studentId, all } = req.query;

    // 如果 all=true，返回所有學生的心得（管理員功能）
    if (all === 'true') {
      const [reflections] = await pool.query(
        `SELECT r.id, r.student_id, r.date, r.subject, r.content, r.created_at,
                s.student_name
         FROM reflections r
         LEFT JOIN students s ON r.student_id = s.student_id
         ORDER BY r.date DESC, r.created_at DESC
         LIMIT 50`
      );
      return res.json({ reflections });
    }

    if (!studentId) {
      return res.status(400).json({ error: '请提供学生ID' });
    }

    const [reflections] = await pool.query(
      `SELECT id, student_id, date, subject, content, created_at 
       FROM reflections 
       WHERE student_id = ? 
       ORDER BY date DESC, created_at DESC`,
      [studentId]
    );

    res.json({ reflections });

  } catch (error) {
    console.error('获取学习心得错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加学习心得
router.post('/', async (req, res) => {
  try {
    const { studentId, date, subject, content } = req.body;

    if (!studentId || !date || !subject || !content) {
      return res.status(400).json({ error: '请填写所有字段' });
    }

    // 检查不雅文字（简单检查，前端已有详细检查）
    if (!content.trim()) {
      return res.status(400).json({ error: '心得内容不能为空' });
    }

    const [result] = await pool.query(
      `INSERT INTO reflections (student_id, date, subject, content) 
       VALUES (?, ?, ?, ?)`,
      [studentId, date, subject, content]
    );

    res.json({
      success: true,
      message: '心得已保存',
      id: result.insertId
    });

  } catch (error) {
    console.error('保存学习心得错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除学习心得
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: '请提供学生ID' });
    }

    const [result] = await pool.query(
      'DELETE FROM reflections WHERE id = ? AND student_id = ?',
      [id, studentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '心得不存在或无权删除' });
    }

    res.json({ success: true, message: '心得已删除' });

  } catch (error) {
    console.error('删除学习心得错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
