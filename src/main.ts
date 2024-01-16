import { Actor } from 'apify'
import { PlaywrightCrawler, log } from 'crawlee'
import { router } from './routes.js'

await Actor.init()

// Define the URL to start the crawl from
const START_URL = 'https://www.pavementmaterials.co.za/collections'

const crawler = new PlaywrightCrawler({
  // use this is for debugging during development.
  // uncommenting maxRequestsPerCrawl will allow the crawler complete the run cycle and gracefully end
  maxRequestsPerCrawl: 70,

  // Instead of the long requestHandler with
  // if clauses we provide a router instance.
  requestHandler: router
})

// Start the crawl from the START_URL
await crawler.run([START_URL])

await Actor.exit() //! Required for apify to graceful shutdown

// shopify ip 23.227.38.0
