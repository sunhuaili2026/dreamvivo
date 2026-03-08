import express from 'express';
import { body, validationResult } from 'express-validator';
import Dream from '../models/Dream.js';

const router = express.Router();

// 获取所有梦境
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, mood, tag } = req.query;
    const query = {};
    
    if (mood) query.mood = mood;
    if (tag) query.tags = { $in: [tag] };
    
    const dreams = await Dream.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Dream.countDocuments(query);
    
    res.json({
      dreams,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个梦境
router.get('/:id', async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) {
      return res.status(404).json({ error: '梦境未找到' });
    }
    res.json(dream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建梦境
router.post('/', [
  body('title').notEmpty().withMessage('标题不能为空'),
  body('content').notEmpty().withMessage('梦境内容不能为空')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const dream = new Dream(req.body);
    await dream.save();
    res.status(201).json(dream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新梦境
router.put('/:id', async (req, res) => {
  try {
    const dream = await Dream.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!dream) {
      return res.status(404).json({ error: '梦境未找到' });
    }
    res.json(dream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除梦境
router.delete('/:id', async (req, res) => {
  try {
    const dream = await Dream.findByIdAndDelete(req.params.id);
    if (!dream) {
      return res.status(404).json({ error: '梦境未找到' });
    }
    res.json({ message: '梦境已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
