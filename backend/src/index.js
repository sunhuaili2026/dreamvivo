import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dreamRoutes from './routes/dreams.js';
import analysisRoutes from './routes/analysis.js';
import generationRoutes from './routes/generation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamvivo')
  .then(() => console.log('✅ MongoDB 连接成功'))
  .catch(err => console.error('❌ MongoDB 连接失败:', err));

// 路由
app.use('/api/dreams', dreamRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/generation', generationRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`🚀 DreamVivo 后端服务运行在 http://localhost:${PORT}`);
});
