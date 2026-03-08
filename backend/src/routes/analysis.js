import express from 'express';
import OpenAI from 'openai';
import Dream from '../models/Dream.js';

const router = express.Router();

// Kimi API 客户端 (Moonshot AI)
const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY || process.env.OPENAI_API_KEY || 'your-api-key',
  baseURL: 'https://api.moonshot.cn/v1'
});

// AI解梦
router.post('/interpret/:dreamId', async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.dreamId);
    if (!dream) {
      return res.status(404).json({ error: '梦境未找到' });
    }
    
    const prompt = `请作为专业的梦境分析师，解读以下梦境：

梦境内容：${dream.content}
梦境情绪：${dream.mood}
清晰度：${dream.clarity}/10
是否为清醒梦：${dream.isLucidDream ? '是' : '否'}

请从以下几个角度进行分析：
1. 梦境的整体含义和象征
2. 梦中出现的关键符号及其意义
3. 从心理学角度（弗洛伊德/荣格理论）的解读
4. 可能的现实生活关联

请以JSON格式返回：
{
  "interpretation": "整体解读",
  "symbols": ["符号1", "符号2"],
  "psychology": "心理学分析"
}`;

    const completion = await kimi.chat.completions.create({
      model: 'moonshot-v1-128k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });
    
    const result = JSON.parse(completion.choices[0].message.content);
    
    // 保存分析结果
    dream.analysis = {
      ...result,
      createdAt: new Date()
    };
    await dream.save();
    
    res.json(dream.analysis);
  } catch (error) {
    console.error('解梦错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 梦境续写 - 生成短篇小说
router.post('/continue/:dreamId', async (req, res) => {
  try {
    const { style = '奇幻', length = 'short' } = req.body;
    const dream = await Dream.findById(req.params.dreamId);
    if (!dream) {
      return res.status(404).json({ error: '梦境未找到' });
    }
    
    const wordCount = length === 'short' ? 800 : length === 'medium' ? 1500 : 3000;
    
    const prompt = `请将以下梦境续写成一篇${style}风格的短篇小说，约${wordCount}字：

原始梦境：${dream.content}
梦境情绪：${dream.mood}

要求：
1. 保留梦境的核心意象和情感基调
2. 构建合理的故事情节，有起承转合
3. 创造生动的场景描写
4. 给故事一个完整的结局

请直接返回小说内容，不需要额外的解释。`;

    const completion = await kimi.chat.completions.create({
      model: 'moonshot-v1-128k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 4000
    });
    
    const story = completion.choices[0].message.content;
    const storyTitle = story.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50);
    
    // 保存续写结果
    dream.generatedStory = {
      content: story,
      title: storyTitle,
      wordCount: story.length,
      createdAt: new Date()
    };
    await dream.save();
    
    res.json(dream.generatedStory);
  } catch (error) {
    console.error('续写错误:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
