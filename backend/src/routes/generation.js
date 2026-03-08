import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import Dream from '../models/Dream.js';

const router = express.Router();

// Kimi API 客户端
const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY || process.env.OPENAI_API_KEY || 'your-api-key',
  baseURL: 'https://api.moonshot.cn/v1'
});

// 生成梦境图片
router.post('/image/:dreamId', async (req, res) => {
  try {
    const { style = 'surrealism' } = req.body;
    const dream = await Dream.findById(req.params.dreamId);
    if (!dream) {
      return res.status(404).json({ error: '梦境未找到' });
    }
    
    // 构建图片生成提示词
    const promptPrompt = `请将以下梦境描述转换为适合AI绘画的英文提示词：

梦境：${dream.content}
情绪：${dream.mood}
风格：${style}

要求：
1. 提取梦境中最具视觉冲击力的场景
2. 使用详细的视觉描述词汇
3. 包含光影、色彩、氛围等细节
4. 只返回英文提示词，不要其他内容`;

    const promptCompletion = await kimi.chat.completions.create({
      model: 'moonshot-v1-128k',
      messages: [{ role: 'user', content: promptPrompt }],
      temperature: 0.8
    });
    
    const imagePrompt = promptCompletion.choices[0].message.content.trim();
    
    // 使用 Kimi 的图像生成（如果支持）或返回提示词让用户用其他工具
    // 这里先返回提示词，实际使用时可以接入即梦或其他图像API
    
    // 保存生成的图片信息
    dream.generatedImage = {
      url: null, // 待生成
      prompt: imagePrompt,
      createdAt: new Date()
    };
    await dream.save();
    
    res.json({
      prompt: imagePrompt,
      message: '图片提示词已生成，请使用即梦或其他AI绘画工具生成图片',
      dreamId: dream._id
    });
  } catch (error) {
    console.error('图片生成错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 生成视频（使用即梦 Seedance API）
router.post('/video/:dreamId', async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.dreamId);
    if (!dream) {
      return res.status(404).json({ error: '梦境未找到' });
    }
    
    // 构建视频生成提示词
    const storyContent = dream.generatedStory?.content || dream.content;
    
    const videoPrompt = `基于以下梦境故事生成视频：

${storyContent.substring(0, 1000)}

关键场景：
${dream.analysis?.symbols?.join(', ') || '梦境场景'}

情绪基调：${dream.mood}

请生成一个梦幻、超现实风格的短视频，展现梦境中最具代表性的画面。`;

    // 初始化视频生成任务
    dream.generatedVideo = {
      status: 'pending',
      createdAt: new Date()
    };
    await dream.save();
    
    res.json({
      message: '视频生成任务已创建',
      status: 'pending',
      dreamId: dream._id,
      prompt: videoPrompt
    });
  } catch (error) {
    console.error('视频生成错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 检查视频生成状态
router.get('/video/status/:dreamId', async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.dreamId);
    if (!dream || !dream.generatedVideo) {
      return res.status(404).json({ error: '视频任务未找到' });
    }
    
    res.json(dream.generatedVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
