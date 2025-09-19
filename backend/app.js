// 引入express
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const app = express()
const port = 5000

// 解析请求体为 JSON
app.use(bodyParser.json())

// 允许所有来源的跨域请求
app.use(cors())

// 引入配置
const config = require('./config.json')

// 存储聊天历史的对象
const chatHistory = {}

/**
 * 生成唯一的聊天ID
 * @returns {string} - 聊天ID
 */
function generateChatId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 定义 chat 接口
app.post('/api/chat', async (req, res) => {
  try {
    const { message, session_id } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // 如果没有提供 session_id，则生成一个新的
    let currentSessionId = session_id || generateChatId()

    // 如果 session_id 不存在于历史记录中，则初始化
    if (!chatHistory[currentSessionId]) {
      chatHistory[currentSessionId] = []
    }

    // 将用户消息添加到历史记录
    chatHistory[currentSessionId].push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    })

    // 动态导入 catg 函数
    const { catg } = await import('./catg.js')

    // 调用 catg 函数获取 AI 回复
    const result = await catg(message)

    // 将 AI 回复添加到历史记录
    chatHistory[currentSessionId].push({
      role: 'assistant',
      content: result,
      timestamp: new Date().toISOString(),
    })

    res.json({
      result,
      session_id: currentSessionId,
    })
  } catch (error) {
    console.error('Error in chat endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 定义 history 接口
app.get('/api/history/:session_id', (req, res) => {
  try {
    const { session_id } = req.params

    if (!chatHistory[session_id]) {
      return res.status(404).json({ error: 'Chat history not found' })
    }

    res.json({
      session_id,
      history: chatHistory[session_id],
    })
  } catch (error) {
    console.error('Error in history endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// 获取配置信息接口
app.get('/api/config', (req, res) => {
  // 只返回安全的配置信息，不包含敏感信息
  res.json({
    api_base: config.llm.api_base,
    model: 'xop3qwen4b',
  })
})

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
