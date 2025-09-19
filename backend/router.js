const express = require('express')
const router = express.Router()
const catgRouter = require('./catg')

// 使用 catg 路由
router.use('/', catgRouter)

module.exports = router
