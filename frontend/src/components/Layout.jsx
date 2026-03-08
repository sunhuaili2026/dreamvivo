import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Plus, BookOpen, Sparkles } from 'lucide-react'

function Layout({ children }) {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Sparkles, label: '首页' },
    { path: '/dreams', icon: BookOpen, label: '梦境库' },
    { path: '/new', icon: Plus, label: '记录梦境' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <nav className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dream-500 to-dream-700 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">DreamVivo</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-dream-500/20 text-dream-300'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="glass px-6 py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
          <p>✨ DreamVivo - 让梦境照进现实</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
