import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Sparkles, Image, BookOpen, Video, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../api.js'

function NewDream() {
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '平静',
    clarity: 5,
    isLucidDream: false,
    tags: []
  })

  const moods = ['开心', '恐惧', '焦虑', '平静', '兴奋', '悲伤', '神秘']
  const tagOptions = ['飞行', '坠落', '追逐', '水', '动物', '家人', '工作', '学校', '死亡', '爱情']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.content) return

    setIsSubmitting(true)
    try {
      const response = await api.post('/dreams', formData)
      navigate(`/dreams/${response.data._id}`)
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold gradient-text mb-4">记录新梦境</h1>
        <p className="text-white/60">用文字或语音描述你的梦境，AI将帮你解析和创作</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="block text-white/80 mb-2">梦境标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="给你的梦境起个名字..."
            className="input-dream"
            required
          />
        </div>

        {/* 梦境内容 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white/80">梦境描述</label>
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? '停止录音' : '语音输入'}
            </button>
          </div>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="详细描述你的梦境...你看到了什么？感受到了什么？发生了什么？"
            className="input-dream min-h-[200px] resize-none"
            required
          />
          {isRecording && (
            <p className="text-dream-400 text-sm mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              正在录音... (语音转文字功能开发中)
            </p>
          )}
        </div>

        {/* 情绪 */}
        <div>
          <label className="block text-white/80 mb-3">梦境情绪</label>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setFormData({ ...formData, mood })}
                className={`px-4 py-2 rounded-xl transition-all ${
                  formData.mood === mood
                    ? 'bg-dream-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* 清晰度 */}
        <div>
          <label className="block text-white/80 mb-3">
            梦境清晰度: <span className="text-dream-400">{formData.clarity}/10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.clarity}
            onChange={(e) => setFormData({ ...formData, clarity: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-dream-500"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>模糊</span>
            <span>清晰</span>
          </div>
        </div>

        {/* 清醒梦 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="lucid"
            checked={formData.isLucidDream}
            onChange={(e) => setFormData({ ...formData, isLucidDream: e.target.checked })}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-dream-500 focus:ring-dream-500"
          />
          <label htmlFor="lucid" className="text-white/80 cursor-pointer">
            这是一个清醒梦（我知道自己在做梦）
          </label>
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-white/80 mb-3">梦境标签</label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  formData.tags.includes(tag)
                    ? 'bg-dream-500/30 text-dream-300 border border-dream-500/50'
                    : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.content}
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                保存梦境
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default NewDream
