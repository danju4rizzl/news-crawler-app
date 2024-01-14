import { PlaywrightCrawler } from 'crawlee'
import { Page } from 'playwright'
import { extractCategoryTexts } from './productsCrawlers.js'

// Define the URL to start the crawl from
const START_URL = 'https://warehouse-theme-metal.myshopify.com/collections/'

// Define the request handler function
// This function is passed to the PlaywrightCrawler constructor and is called for each page visited during the crawl
// The function receives an object containing the current page as an argument
// The page is then passed to the extractCategoryTexts function, which extracts and logs the category texts from the page
// const requestHandler = async ({ page }: { page: Page }) => {
//   await extractCategoryTexts(page)
// }

// Create a new instance of PlaywrightCrawler
// Pass the request handler function to the constructor
const crawler = new PlaywrightCrawler({
  /**
   *! The requestHandler will now visit all the listings URL's and all the details URL's
   */
  requestHandler: async ({ page, request, enqueueLinks }) => {
    console.log(`Processing: ${request.url} Label is: 👉🏽 ${request.label}`)
    if (request.label === 'DETAIL') {
      // We're not doing anything with the details yet.
    } else if (request.label === 'CATEGORY') {
      // We are now on a category page. We can use this to paginate through and enqueue all products,
      // as well as any subsequent pages we find

      await page.waitForSelector('.product-item > a')
      await enqueueLinks({
        selector: '.product-item > a',
        label: 'DETAIL' // <= note the different label
      })

      // Now we need to find the "Next" button and enqueue the next page of results (if it exists)
      const nextButton = await page.$('a.pagination__next')
      if (nextButton) {
        await enqueueLinks({
          selector: 'a.pagination__next',
          label: 'CATEGORY' // <= note the same label
        })
      }
    } else {
      // This means we're on the start page, with no label.
      // On this page, we just want to enqueue all the category pages.

      await page.waitForSelector('.collection-block-item')
      await enqueueLinks({
        selector: '.collection-block-item',
        label: 'CATEGORY'
      })
    }
  }
})

// Start the crawl from the START_URL
await crawler.run([START_URL])
