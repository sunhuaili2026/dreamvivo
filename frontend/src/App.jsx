import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import DreamList from './pages/DreamList'
import DreamDetail from './pages/DreamDetail'
import NewDream from './pages/NewDream'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dreams" element={<DreamList />} />
        <Route path="/dreams/:id" element={<DreamDetail />} />
        <Route path="/new" element={<NewDream />} />
      </Routes>
    </Layout>
  )
}

export default App
