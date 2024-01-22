import aiModel from './ai.js'

export async function getAiDescription(rawDesc: string) {
  const aiDesc = await aiModel.generateContent(
    `make the description more readable i want you to clean all the html tags, generate product descriptions, analyze existing data, extract key features, and create compelling and unique product descriptions. Make sure to use SEO best practices and nothing else: ${rawDesc}`
  )
  const description = aiDesc.response.text()
  return description
}

export async function getAiTitle(rawTitle: string | null, rawDesc: string) {
  const aiTitle = await aiModel.generateContent(
    `You are an SEO, SALES and MARKETING expert. I want you to rephrase this: ${rawTitle}. You here is more information about ${rawTitle} here: ${rawDesc}. Make sure you give me only 1, with a maximum of 6 words and nothing else.`
  )
  const title = aiTitle.response.text()
  return title.replace('**', '').trim()
}
