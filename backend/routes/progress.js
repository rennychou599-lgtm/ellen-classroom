const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// 获取学生复习进度
router.get('/', async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: '请提供学生ID' });
    }

    const [progress] = await pool.query(
      `SELECT week, subject, status 
       FROM progress 
       WHERE student_id = ? 
       ORDER BY week ASC, subject ASC`,
      [studentId]
    );

    // 转换为前端需要的格式
    const progressData = {};
    progress.forEach(item => {
      if (!progressData[item.week]) {
        progressData[item.week] = {};
      }
      progressData[item.week][item.subject] = item.status;
    });

    res.json({ progress: progressData });

  } catch (error) {
    console.error('获取复习进度错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新复习进度
router.put('/', async (req, res) => {
  try {
    const { studentId, week, subject, status } = req.body;

    if (!studentId || !week || !subject || !status) {
      return res.status(400).json({ error: '请提供完整信息' });
    }

    const validStatuses = ['not-started', 'in-progress', 'completed', 'reviewed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: '无效的状态值' });
    }

    await pool.query(
      `INSERT INTO progress (student_id, week, subject, status) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?`,
      [studentId, week, subject, status, status]
    );

    res.json({ success: true, message: '进度已更新' });

  } catch (error) {
    console.error('更新复习进度错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 批量更新复习进度
router.put('/batch', async (req, res) => {
  try {
    const { studentId, progressData } = req.body;

    if (!studentId || !progressData) {
      return res.status(400).json({ error: '请提供完整信息' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const week in progressData) {
        for (const subject in progressData[week]) {
          const status = progressData[week][subject];
          await connection.query(
            `INSERT INTO progress (student_id, week, subject, status) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE status = ?`,
            [studentId, week, subject, status, status]
          );
        }
      }

      await connection.commit();
      res.json({ success: true, message: '进度已批量更新' });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('批量更新复习进度错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
