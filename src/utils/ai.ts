import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.AI_API_KEY) {
  throw new Error('AI_API_KEY is not set')
}

const ai = new GoogleGenerativeAI(process.env.AI_API_KEY)

const aiModel = ai.getGenerativeModel({ model: 'gemini-pro' })

export default aiModel
