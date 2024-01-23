import { Actor } from 'apify'
import { PlaywrightCrawler, log } from 'crawlee'
import { router as competitorRouter } from './routes-woocommerce.js'
import { router as userRouter } from './routes.js'
import { saveToS3 } from './utils/aws.js'

await Actor.init()
// Define the URL to start the crawl from
const START_URL = 'https://www.pavementmaterials.co.za/collections'
const SITE1 = 'https://www.carrimonline.co.za/building/'

const competitorCrawler = new PlaywrightCrawler({
  // use this is for debugging during development.
  // uncommenting maxRequestsPerCrawl will allow the crawler complete the run cycle and gracefully end
  maxRequestsPerCrawl: 1,

  requestHandler: competitorRouter
})

const crawlingCompetitor = await competitorCrawler.run([SITE1])
// Runs when the crawler is finished.
if (crawlingCompetitor.requestsFinished) {
  console.log('🟢👍🟢 Crawler is finished')
  await saveToS3() // TODO: use this to send the file to aws S3 
}


// TODO: uncomment the code below to crawl the users website
// const userCrawler = new PlaywrightCrawler({
//   maxRequestsPerCrawl: 70,
//   requestHandler: userRouter
// })

// await userCrawler.run([START_URL])

await Actor.exit() //! Required for apify to graceful shutdown

// shopify ip 23.227.38.0
