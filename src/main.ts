import { PlaywrightCrawler, log } from 'crawlee'
import { router } from './routes.js'

// Define the URL to start the crawl from
const START_URL = 'https://warehouse-theme-metal.myshopify.com/collections/'

const crawler = new PlaywrightCrawler({
  // use this is for debugging during development.
  // uncommenting maxRequestsPerCrawl will allow the crawler complete the run cycle and gracefully end
  maxRequestsPerCrawl: 50,

  // Instead of the long requestHandler with
  // if clauses we provide a router instance.
  requestHandler: router
})

// Start the crawl from the START_URL
await crawler.run([START_URL])
