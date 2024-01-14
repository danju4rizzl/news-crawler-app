import { PlaywrightCrawler } from 'crawlee'

const START_URL = 'https://warehouse-theme-metal.myshopify.com/collections/'
const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page }) => {
    const categoryCard = '.collection-block-item'
    // Wait for the actor cards to render.
    await page.waitForSelector(categoryCard)
    // Execute a function in the browser which targets
    // the actor card elements and allows their manipulation.
    const categoryTexts = await page.$$eval(categoryCard, (cards) => {
      // Extract text content from the actor cards AKA categoryCard
      return cards.map((card) => card.textContent)
    })
    categoryTexts.forEach((text, idx) => {
      console.log(`CATEGORY_${idx + 1}: ${text}\n`)
    })
  }
})
await crawler.run([START_URL])

// https://warehouse-theme-metal.myshopify.com/collections/

// 19GbGWr4yE9x39YvjKC4Kvmfc9hx9myBVb
