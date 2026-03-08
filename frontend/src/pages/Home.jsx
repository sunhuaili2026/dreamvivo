import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Wand2, Image, BookOpen, Video, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function Home() {
  const features = [
    {
      icon: Wand2,
      title: 'AI解梦',
      desc: '智能分析梦境含义，探索潜意识世界',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Image,
      title: '梦境可视化',
      desc: '将梦境转为精美图片，留住梦中奇景',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: BookOpen,
      title: '故事续写',
      desc: '将梦境扩展成完整短篇小说',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Video,
      title: '视频创作',
      desc: '把梦境故事变成动态视频',
      color: 'from-amber-500 to-orange-500'
    }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dream-500/10 border border-dream-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-dream-400" />
            <span className="text-dream-300 text-sm">AI 驱动的梦境创作平台</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">记录梦境</span>
            <br />
            <span className="text-white">创造无限</span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            用文字或语音记录你的梦境，让AI帮你解梦、绘画、写作、创作视频。
            <br />
            每一个梦，都值得被认真对待。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/new"
              className="btn-primary flex items-center gap-2 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              开始记录梦境
            </Link>
            <Link
              to="/dreams"
              className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 transition-all flex items-center gap-2"
            >
              浏览梦境库
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="gradient-text">强大功能</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好探索你的梦境世界了吗？</h2>
        <p className="text-white/60 mb-8 max-w-xl mx-auto">
          每一个夜晚，你的大脑都在创造独特的故事。现在，让我们把这些故事变成现实。
        </p>
        <Link to="/new" className="btn-primary text-lg inline-flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          立即开始
        </Link>
      </section>
    </div>
  )
}

export default Home
