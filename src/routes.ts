import { createPlaywrightRouter, Dataset } from 'crawlee'


export const router = createPlaywrightRouter()

// This route will run first WHEN a product detail page is visited.
router.addHandler('DETAIL', async ({ request, page }) => {
  const titleElement = page.locator('.detail-info h2.product-title')
  const summaryElement = page.locator('.pd_summary p')
  const cityElement = page.locator('.swatch label')
  const categoryElement = page.locator('.product-category-info a')
  const skuElement = page.locator('span.engoj-variant-sku')
  const descriptionElement = page.locator('.tab-content .desc.product-desc')
  const priceElement = page
    .locator('.product-price .engoj_price_main')
    .filter({
      hasText: 'R'
    })
    .first()

  const title = await titleElement.textContent()
  const summary = await summaryElement.textContent()

  const cities = (await cityElement.allTextContents()).map(
    (city) => city.trim() // fixes cities": [ "\n Cape Town\n ", "\n Johannesburg\n ",...]
  )

  const category = (await categoryElement.allTextContents()).map(
    (cat) => cat.replace(',', '').trim() // fixes ["Asphalt and Bitumen Products, "...]
  )

  let sku = null // sets the default sku value
  const skuExists = await skuElement.count()
  if (skuExists) {
    sku = await skuElement.textContent()
  }

  const currentPriceString = await priceElement.textContent()
  const transformedPrice =
    currentPriceString?.replace('R', '').replace('ZAR', '') || ''
  const price = Number(transformedPrice.replace(',', ''))

  const description = await descriptionElement.innerHTML()

  const results = {
    url: request.url,
    title,
    price,
    summary,
    sku,
    cities,
    category,
    description
  }

  await Dataset.pushData(results)
  await Dataset.exportToJSON('scraped-data-file')
})

// This route will run first WHEN a collection page is visited.
router.addHandler('COLLECTION', async ({ page, enqueueLinks }) => {
  const categoryButton = await page.waitForSelector('.title-product > a')
  if (categoryButton) {
    await enqueueLinks({
      selector: '.title-product > a',
      label: 'DETAIL'
    })
  }
})

// This route will run first WHEN a default page is visited.
router.addDefaultHandler(async ({ page, enqueueLinks }) => {
  await page.waitForSelector('.banner_title > a')
  await enqueueLinks({
    selector: '.banner_title > a',
    label: 'COLLECTION'
  })
})
