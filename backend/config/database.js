const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
// 支持 Railway 的 MySQL 环境变量命名
// Railway 使用的变量名：MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'ellen_classroom',
  port: parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 调试：显示数据库连接配置（不显示密码）
console.log('🔍 数据库连接配置:');
console.log('  Host:', process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost');
console.log('  User:', process.env.MYSQLUSER || process.env.MYSQL_USER || 'root');
console.log('  Database:', process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'ellen_classroom');
console.log('  Port:', process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306');

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
