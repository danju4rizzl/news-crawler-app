import { createPlaywrightRouter, Dataset } from 'crawlee'

export const router = createPlaywrightRouter()

// This route will run first WHEN a product detail page is visited.

// This route will run first WHEN a collection page is visited.
router.addHandler('COMPETITOR_CATEGORY', async ({ page, request }) => {
  const titleElement = page.locator('.product-summary h1')
  const categoryElement = page.locator('.posted_in a')
  const priceElement = page.locator('p.price.product-page-price bdi')
  const descriptionElement = page.locator(
    '.woocommerce-Tabs-panel--description'
  )

  const title = (await titleElement.textContent())?.trim()
  const description = await descriptionElement.innerHTML()

  const price = (await priceElement.allInnerTexts()).map((p) =>
    parseFloat(p.replace('R', '').replace(',', '').trim())
  )

  const category = (await categoryElement.allTextContents()).map((c) =>
    c.trim()
  )

  const results = {
    url: request.url,
    title,
    description,
    price,
    category
  }

  console.log(results)
  // await Dataset.pushData(results)
  // await Dataset.exportToJSON('competitor-data-file')
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
