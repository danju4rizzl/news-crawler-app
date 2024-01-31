import { createPlaywrightRouter, Dataset, utils } from 'crawlee'
import { getAiDescription, getAiTitle } from '../utils/helpers.js'
import { saveToS3 } from '../utils/aws.js'

export const router = createPlaywrightRouter()

// This route will run first WHEN a product detail page is visited.

// This route will run first WHEN a collection page is visited.
router.addHandler('COMPETITOR_CATEGORY', async ({ page, request }) => {
  // Create element selectors here
  const titleElement = page.locator('.product-summary h1')
  const categoryElement = page.locator('.posted_in a')
  const priceElement = page.locator('p.price.product-page-price bdi')
  const descriptionElement = page.locator(
    '.woocommerce-Tabs-panel--description'
  )

  // formatting the title here
  const rawTitle = await titleElement.textContent()
  const rawDesc = await descriptionElement.innerHTML()

  const description = await getAiDescription(rawDesc)
  const title = await getAiTitle(rawTitle, rawDesc)

  const price = (await priceElement.allInnerTexts()).map((p) =>
    parseFloat(p.replace('R', '').replace(',', '').trim())
  )

  // formatting the category here
  const category = (await categoryElement.allTextContents()).map((c) =>
    c.trim()
  )

  // formatting the entire result
  const results = {
    url: request.url,
    title,
    description,
    price,
    category
  }

  await Dataset.pushData(results)
  console.log('saved: ', results)
  await Dataset.exportToJSON('competitor-data-file')
  await Dataset.exportToCSV('competitor-data-file')
})

// This route will run first WHEN a default page is visited.
router.addDefaultHandler(async ({ page, enqueueLinks, infiniteScroll }) => {
  // This will scroll down the page and wait for 10sec to load dynamic content
  await infiniteScroll({ waitForSecs: 10 })

  const categoryElement = '.product-title > a'
  await page.waitForSelector(categoryElement)
  await enqueueLinks({
    selector: categoryElement,
    label: 'COMPETITOR_CATEGORY'
  })
})
