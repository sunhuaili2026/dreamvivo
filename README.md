# DreamVivo - 梦境AI创作平台

一个记录、解析、可视化并续写梦境的智能应用。

## 🌟 功能特性

- 📝 **梦境记录** - 支持文字和语音输入
- 🔮 **AI解梦** - 基于 Kimi AI 智能分析梦境含义
- 🎨 **梦境可视化** - 将梦境转为图片提示词
- 📖 **故事续写** - 生成短篇小说
- 🎬 **视频创作** - 将梦境故事转为视频

## 🚀 快速开始

### 环境要求
- Node.js 18+
- MongoDB
- Kimi API Key

### 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 配置环境变量

```bash
cp backend/.env.example backend/.env
# 编辑 backend/.env，填入你的 API 密钥
```

### 启动服务

```bash
# 启动后端 (端口 3001)
cd backend
npm run dev

# 启动前端 (端口 3000)
cd frontend
npm run dev
```

访问 http://localhost:3000

## 🏗️ 项目结构

```
dreamvivo/
├── frontend/          # React + Vite + Tailwind 前端
├── backend/           # Node.js + Express + MongoDB 后端
└── README.md
```

## 🛠️ 技术栈

- **前端**: React 18, Tailwind CSS, Vite, Framer Motion
- **后端**: Node.js, Express, MongoDB, Mongoose
- **AI**: Kimi (Moonshot AI)
- **部署**: 腾讯云

## 📄 许可证

MIT
