import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Calendar, Tag, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import axios from 'axios'

function DreamList() {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMood, setFilterMood] = useState('')

  const moods = ['全部', '开心', '恐惧', '焦虑', '平静', '兴奋', '悲伤', '神秘']

  useEffect(() => {
    fetchDreams()
  }, [filterMood])

  const fetchDreams = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterMood && filterMood !== '全部') {
        params.mood = filterMood
      }
      const response = await axios.get('/api/dreams', { params })
      setDreams(response.data.dreams)
    } catch (error) {
      console.error('获取梦境失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDreams = dreams.filter(dream =>
    dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dream.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getMoodColor = (mood) => {
    const colors = {
      '开心': 'bg-yellow-500/20 text-yellow-400',
      '恐惧': 'bg-red-500/20 text-red-400',
      '焦虑': 'bg-orange-500/20 text-orange-400',
      '平静': 'bg-blue-500/20 text-blue-400',
      '兴奋': 'bg-pink-500/20 text-pink-400',
      '悲伤': 'bg-slate-500/20 text-slate-400',
      '神秘': 'bg-purple-500/20 text-purple-400'
    }
    return colors[mood] || 'bg-white/10 text-white/60'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-dream-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 标题和搜索 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">我的梦境</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索梦境..."
              className="input-dream pl-10 w-64"
            />
          </div>
          <Link
            to="/new"
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            记录梦境
          </Link>
        </div>
      </div>

      {/* 情绪筛选 */}
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => setFilterMood(mood === '全部' ? '' : mood)}
            className={`px-4 py-2 rounded-xl transition-all ${
              (mood === '全部' && !filterMood) || filterMood === mood
                ? 'bg-dream-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* 梦境列表 */}
      {filteredDreams.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-white/30" />
          </div>
          <p className="text-white/40">还没有梦境记录</p>
          <Link to="/new" className="text-dream-400 hover:underline mt-2 inline-block">
            记录第一个梦境 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDreams.map((dream, index) => (
            <motion.div
              key={dream._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/dreams/${dream._id}`}
                className="glass rounded-2xl p-6 block card-hover group"
              >
                {/* 头部 */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-dream-300 transition-colors line-clamp-1">
                    {dream.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${getMoodColor(dream.mood)}`}>
                    {dream.mood}
                  </span>
                </div>

                {/* 内容预览 */}
                <p className="text-white/60 line-clamp-3 mb-4 text-sm leading-relaxed">
                  {dream.content}
                </p>

                {/* 底部信息 */}
                <div className="flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(dream.createdAt), 'MM月dd日', { locale: zhCN })}
                    </span>
                    <span>清晰度: {dream.clarity}/10</span>
                    {dream.isLucidDream && (
                      <span className="text-dream-400">清醒梦</span>
                    )}
                  </div>
                  
                  {/* 生成状态指示 */}
                  <div className="flex items-center gap-2">
                    {dream.analysis && (
                      <span className="w-2 h-2 rounded-full bg-green-500" title="已解梦" />
                    )}
                    {dream.generatedImage && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" title="已生成图片" />
                    )}
                    {dream.generatedStory && (
                      <span className="w-2 h-2 rounded-full bg-purple-500" title="已续写" />
                    )}
                  </div>
                </div>

                {/* 标签 */}
                {dream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {dream.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {dream.tags.length > 3 && (
                      <span className="text-xs text-white/30">+{dream.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DreamList
