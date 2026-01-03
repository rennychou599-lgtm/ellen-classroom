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
    console.log('\n✅ 完成！');
    console.log('📝 请手动在数据库中创建老师账号');
    console.log('   可以使用 SQL 或通过管理界面添加\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ 创建老师账号失败:', error);
    process.exit(1);
  }
}

createTeacher();
