// 此脚本需要在有 node_modules 的环境中运行
// 或者在 Railway 部署后通过 API 创建老师账号
// 
// 使用方法：
// 1. 在 Railway 数据库管理界面执行 create-teacher.sql 创建表
// 2. 在本地或 Railway 环境中运行: node backend/scripts/create-teacher.js
// 3. 或者通过 API 端点创建（需要先实现）

const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

async function createTeacher() {
  try {
    console.log('📝 开始创建老师账号...');
    
    // 创建 teachers 表（如果不存在）
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
    console.log('✅ 老师表已创建或已存在');

    // 检查老师是否已存在
    const [existing] = await pool.query(
      'SELECT * FROM teachers WHERE teacher_id = ?',
      ['BMN-5680']
    );

    // 加密密码
    const hashedPassword = await bcrypt.hash('BMN-5680!@', 10);
    console.log('✅ 密码已加密');

    if (existing.length > 0) {
      console.log('📝 老师账号已存在，更新密码...');
      await pool.query(
        'UPDATE teachers SET password = ?, teacher_name = ? WHERE teacher_id = ?',
        [hashedPassword, '鈺倫老師', 'BMN-5680']
      );
      console.log('✅ 密码已更新');
    } else {
      console.log('📝 创建新老师账号...');
      await pool.query(
        'INSERT INTO teachers (teacher_id, teacher_name, password) VALUES (?, ?, ?)',
        ['BMN-5680', '鈺倫老師', hashedPassword]
      );
      console.log('✅ 老师账号创建成功');
    }

    console.log('\n✅ 完成！');
    console.log('📋 老师账号信息:');
    console.log('   账号: BMN-5680');
    console.log('   密码: BMN-5680!@');
    console.log('   姓名: 鈺倫老師\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 创建老师账号失败:', error);
    process.exit(1);
  }
}

createTeacher();
