import axios from 'axios'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const config = require('./config.json')

/**
 * 调用AI接口进行文本生成
 * @param {string} prompt - 提示词
 * @returns {Promise<string>} - 生成结果
 */
async function catg(prompt) {
  try {
    const response = await axios.post(
      `${config.llm.api_base}/chat/completions`,
      {
        model: 'xop3qwen4b', // 和 Python 一致
        messages: [{ role: 'user', content: prompt }], // 和 Python 一致
        stream: false, // 和 Python 一致
        temperature: 0.7, // 和 Python 一致
        max_tokens: 4096, // 和 Python 一致
        stream_options: {
          include_usage: false, // 和 Python 一致
        },
        extra_body: {
          search_disable: false, // 和 Python 一致
          show_ref_label: true, // 和 Python 一致（移除了 enable_thinking）
        },
        // 删掉了 extra_headers 字段
      },
      {
        headers: {
          Authorization: `Bearer ${config.llm.api_key}`,
          'Content-Type': 'application/json',
          lora_id: '1965621582310301696', // 关键：lora_id 移到这里
        },
      },
    )

    return response.data.choices[0].message.content
  } catch (error) {
    // 优化错误提示，和 Python 风格一致
    console.error(`调用模型失败: ${error.response?.data?.error?.message || error.message || error}`)
    throw error
  }
}

export { catg }
