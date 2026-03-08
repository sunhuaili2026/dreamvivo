import mongoose from 'mongoose';

const dreamSchema = new mongoose.Schema({
  // 基础信息
  title: { type: String, required: true },
  content: { type: String, required: true },
  
  // 梦境元数据
  mood: { type: String, enum: ['开心', '恐惧', '焦虑', '平静', '兴奋', '悲伤', '神秘'], default: '平静' },
  clarity: { type: Number, min: 1, max: 10, default: 5 },
  isLucidDream: { type: Boolean, default: false },
  tags: [{ type: String }],
  
  // 语音记录
  audioUrl: { type: String },
  audioDuration: { type: Number },
  
  // AI分析结果
  analysis: {
    interpretation: { type: String },
    symbols: [{ type: String }],
    psychology: { type: String },
    createdAt: { type: Date }
  },
  
  // 生成的内容
  generatedImage: {
    url: { type: String },
    prompt: { type: String },
    createdAt: { type: Date }
  },
  
  generatedStory: {
    content: { type: String },
    title: { type: String },
    wordCount: { type: Number },
    createdAt: { type: Date }
  },
  
  generatedVideo: {
    url: { type: String },
    coverUrl: { type: String },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date }
  },
  
  // 用户关联
  userId: { type: String, default: 'anonymous' },
  
  // 时间戳
  dreamDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 索引
dreamSchema.index({ userId: 1, createdAt: -1 });
dreamSchema.index({ tags: 1 });

const Dream = mongoose.model('Dream', dreamSchema);

export default Dream;
