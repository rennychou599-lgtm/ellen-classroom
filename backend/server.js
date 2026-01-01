const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const gradesRoutes = require('./routes/grades');
const reflectionsRoutes = require('./routes/reflections');
const progressRoutes = require('./routes/progress');
const feedbackRoutes = require('./routes/feedback');

const app = express();
// 确保 PORT 是有效的整数
let PORT = parseInt(process.env.PORT, 10);

// 验证 PORT 是否有效
if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
  console.warn('⚠️  无效的 PORT 值:', process.env.PORT);
  console.warn('使用默认端口 3000');
  PORT = 3000;
}

// 中间件
// 启用 gzip 压缩（减小传输大小，提升加载速度）
app.use(compression({
  level: 6, // 压缩级别 1-9，6 是平衡性能和压缩率的好选择
  filter: (req, res) => {
    // 只压缩文本类型的响应
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供静态文件（前端）
// 注意：__dirname 是 backend 目录，所以 '../' 指向项目根目录
const staticPath = path.join(__dirname, '../');
console.log('📁 静态文件路径:', staticPath);
console.log('📁 __dirname:', __dirname);

// 配置静态文件服务，启用缓存
app.use(express.static(staticPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0', // 生产环境缓存 1 年
  etag: true, // 启用 ETag
  lastModified: true, // 启用 Last-Modified
  setHeaders: (res, path) => {
    // 为图片设置更长的缓存时间
    if (path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // 为 CSS/JS 设置缓存
    if (path.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/reflections', reflectionsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feedback', feedbackRoutes);

// SPA 路由回退（所有非 API 路由返回 index.html）
app.get('*', (req, res, next) => {
  // 如果是 API 请求，继续到 404 处理
  if (req.path.startsWith('/api')) {
    return next();
  }
  // 如果是静态资源请求（有扩展名），继续
  if (path.extname(req.path)) {
    return next();
  }
  // 否则返回 index.html（用于 SPA 路由）
  const indexPath = path.join(__dirname, '../index.html');
  console.log('📄 返回 index.html，路径:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ 无法发送 index.html:', err.message);
      return next();
    }
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '路由不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
async function startServer() {
  // 测试数据库连接
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.log('⚠️  警告: 数据库连接失败，但服务器仍会启动');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📡 API 地址: http://localhost:${PORT}/api`);
    console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 监听地址: 0.0.0.0:${PORT}`);
  });
}

startServer();
