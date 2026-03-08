import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Sparkles, Image, BookOpen, Video, 
  Loader2, Wand2, Download, Share2, Trash2 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import axios from 'axios'

function DreamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dream, setDream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('analysis')
  const [generating, setGenerating] = useState({
    analysis: false,
    image: false,
    story: false,
    video: false
  })

  useEffect(() => {
    fetchDream()
  }, [id])

  const fetchDream = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/dreams/${id}`)
      setDream(response.data)
    } catch (error) {
      console.error('获取梦境失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAnalysis = async () => {
    setGenerating(prev => ({ ...prev, analysis: true }))
    try {
      const response = await axios.post(`/api/analysis/interpret/${id}`)
      setDream(prev => ({ ...prev, analysis: response.data }))
    } catch (error) {
      console.error('解梦失败:', error)
      alert('解梦失败，请重试')
    } finally {
      setGenerating(prev => ({ ...prev, analysis: false }))
    }
  }

  const generateImage = async () => {
    setGenerating(prev => ({ ...prev, image: true }))
    try {
      const response = await axios.post(`/api/generation/image/${id}`)
      setDream(prev => ({ ...prev, generatedImage: response.data }))
    } catch (error) {
      console.error('图片生成失败:', error)
      alert('图片生成失败，请重试')
    } finally {
      setGenerating(prev => ({ ...prev, image: false }))
    }
  }

  const generateStory = async () => {
    setGenerating(prev => ({ ...prev, story: true }))
    try {
      const response = await axios.post(`/api/analysis/continue/${id}`)
      setDream(prev => ({ ...prev, generatedStory: response.data }))
    } catch (error) {
      console.error('续写失败:', error)
      alert('续写失败，请重试')
    } finally {
      setGenerating(prev => ({ ...prev, story: false }))
    }
  }

  const generateVideo = async () => {
    setGenerating(prev => ({ ...prev, video: true }))
    try {
      const response = await axios.post(`/api/generation/video/${id}`)
      alert('视频生成任务已创建，请稍后查看')
    } catch (error) {
      console.error('视频生成失败:', error)
      alert('视频生成失败，请重试')
    } finally {
      setGenerating(prev => ({ ...prev, video: false }))
    }
  }

  const deleteDream = async () => {
    if (!confirm('确定要删除这个梦境吗？')) return
    try {
      await axios.delete(`/api/dreams/${id}`)
      navigate('/dreams')
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-dream-500 animate-spin" />
      </div>
    )
  }

  if (!dream) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">梦境未找到</p>
      </div>
    )
  }

  const tabs = [
    { id: 'analysis', label: '解梦', icon: Wand2, hasContent: dream.analysis },
    { id: 'image', label: '图片', icon: Image, hasContent: dream.generatedImage },
    { id: 'story', label: '续写', icon: BookOpen, hasContent: dream.generatedStory },
    { id: 'video', label: '视频', icon: Video, hasContent: dream.generatedVideo?.status === 'completed' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/dreams')}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回梦境列表
      </button>

      {/* 梦境标题区 */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{dream.title}</h1>
            <div className="flex items-center gap-4 text-sm text-white/50">
              <span>{format(new Date(dream.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}</span>
              <span className="px-2 py-0.5 bg-dream-500/20 text-dream-300 rounded">
                {dream.mood}
              </span>
              {dream.isLucidDream && (
                <span className="text-amber-400">清醒梦</span>
              )}
            </div>
          </div>
          <button
            onClick={deleteDream}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
            {dream.content}
          </p>
        </div>

        {dream.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {dream.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI 功能区 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-dream-400" />
          AI 创作
        </h2>

        {/* 标签页 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-dream-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.hasContent && (
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* 内容区 */}
        <div className="glass rounded-2xl p-6 min-h-[300px]">
          {/* 解梦 */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {!dream.analysis ? (
                <div className="text-center py-12">
                  <Wand2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 mb-4">还没有解梦结果</p>
                  <button
                    onClick={generateAnalysis}
                    disabled={generating.analysis}
                    className="btn-primary flex items-center gap-2 mx-auto"
                  >
                    {generating.analysis ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        开始解梦
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-dream-300">整体解读</h3>
                    <p className="text-white/80 leading-relaxed">{dream.analysis.interpretation}</p>
                  </div>
                  
                  {dream.analysis.symbols && dream.analysis.symbols.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-dream-300">关键符号</h3>
                      <div className="flex flex-wrap gap-2">
                        {dream.analysis.symbols.map((symbol, i) => (
                          <span key={i} className="px-3 py-1 bg-dream-500/20 text-dream-300 rounded-lg">
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-dream-300">心理学分析</h3>
                    <p className="text-white/80 leading-relaxed">{dream.analysis.psychology}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 图片 */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              {!dream.generatedImage ? (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 mb-4">还没有生成梦境图片</p>
                  <button
                    onClick={generateImage}
                    disabled={generating.image}
                    className="btn-primary flex items-center gap-2 mx-auto"
                  >
                    {generating.image ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        生成图片
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={dream.generatedImage.url}
                    alt="梦境可视化"
                    className="w-full rounded-xl"
                  />
                  <p className="text-sm text-white/40">提示词: {dream.generatedImage.prompt}</p>
                </div>
              )}
            </div>
          )}

          {/* 续写 */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              {!dream.generatedStory ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 mb-4">还没有续写故事</p>
                  <button
                    onClick={generateStory}
                    disabled={generating.story}
                    className="btn-primary flex items-center gap-2 mx-auto"
                  >
                    {generating.story ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        创作中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        续写故事
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-dream-300">
                    {dream.generatedStory.title}
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                      {dream.generatedStory.content}
                    </p>
                  </div>
                  <p className="text-sm text-white/40">
                    字数: {dream.generatedStory.wordCount}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 视频 */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              {(!dream.generatedVideo || dream.generatedVideo.status !== 'completed') ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 mb-4">
                    {dream.generatedVideo?.status === 'processing' 
                      ? '视频正在生成中，请稍后再来查看' 
                      : '还没有生成视频'}
                  </p>
                  {dream.generatedVideo?.status !== 'processing' && (
                    <button
                      onClick={generateVideo}
                      disabled={generating.video}
                      className="btn-primary flex items-center gap-2 mx-auto"
                    >
                      {generating.video ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          提交中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          生成视频
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <video
                    src={dream.generatedVideo.url}
                    controls
                    className="w-full rounded-xl"
                    poster={dream.generatedVideo.coverUrl}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default DreamDetail
