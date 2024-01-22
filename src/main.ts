import { Actor } from 'apify'
import { PlaywrightCrawler, log } from 'crawlee'
import { router as competitorRouter } from './routes-woocommerce.js'
import { router as userRouter } from './routes.js'

await Actor.init()
// Define the URL to start the crawl from
const START_URL = 'https://www.pavementmaterials.co.za/collections'
const SITE1 = 'https://www.carrimonline.co.za/building/'

const competitorCrawler = new PlaywrightCrawler({
  // use this is for debugging during development.
  // uncommenting maxRequestsPerCrawl will allow the crawler complete the run cycle and gracefully end
  maxRequestsPerCrawl: 70,

  requestHandler: competitorRouter
})

await competitorCrawler.run([SITE1])

const userCrawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 70,
  requestHandler: userRouter
})

// Start the crawl from the START_URL
await userCrawler.run([START_URL])

await Actor.exit() //! Required for apify to graceful shutdown

// shopify ip 23.227.38.0
