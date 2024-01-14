import { PlaywrightCrawler } from 'crawlee'
import { Page } from 'playwright'
import { extractCategoryTexts } from './categoryExtractor.js'

// Define the URL to start the crawl from
const START_URL = 'https://warehouse-theme-metal.myshopify.com/collections/'

// Define the request handler function
// This function is passed to the PlaywrightCrawler constructor and is called for each page visited during the crawl
// The function receives an object containing the current page as an argument
// The page is then passed to the extractCategoryTexts function, which extracts and logs the category texts from the page
const requestHandler = async ({ page }: { page: Page }) => {
  await extractCategoryTexts(page)
}

// Create a new instance of PlaywrightCrawler
// Pass the request handler function to the constructor
const crawler = new PlaywrightCrawler({
  requestHandler
})

// Start the crawl from the START_URL
await crawler.run([START_URL])
