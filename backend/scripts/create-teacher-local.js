// 本地开发环境创建老师账号脚本
// 使用方法: node backend/scripts/create-teacher-local.js

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTeacherLocal() {
  let connection;
  
  try {
    console.log('📝 开始创建本地老师账号...');
    
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'ellen_classroom',
      port: parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10)
    });

    console.log('✅ 数据库连接成功');

    // 创建 teachers 表（如果不存在）
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id VARCHAR(50) UNIQUE NOT NULL,
        teacher_name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ teachers 表已创建或已存在');

    // 检查老师是否已存在
    const [existing] = await connection.query(
      'SELECT * FROM teachers WHERE teacher_id = ?',
      ['BMN-5680']
    );

    // 加密密码
    const hashedPassword = await bcrypt.hash('BMN-5680!@', 10);
    console.log('✅ 密码已加密');

    if (existing.length > 0) {
      console.log('📝 老师账号已存在，更新密码...');
      await connection.query(
        'UPDATE teachers SET password = ?, teacher_name = ? WHERE teacher_id = ?',
        [hashedPassword, '鈺倫老師', 'BMN-5680']
      );
      console.log('✅ 密码已更新');
    } else {
      console.log('📝 创建新老师账号...');
      await connection.query(
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
    console.log('🌐 现在可以访问: http://localhost:3000/admin.html\n');

  } catch (error) {
    console.error('❌ 创建老师账号失败:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 提示: 数据库连接失败');
      console.error('   请确认:');
      console.error('   1. MySQL 服务正在运行');
      console.error('   2. backend/.env 文件中的数据库配置正确');
      console.error('   3. 数据库已创建 (CREATE DATABASE ellen_classroom;)');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 提示: 数据库不存在');
      console.error('   请先创建数据库: CREATE DATABASE ellen_classroom;');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTeacherLocal();
