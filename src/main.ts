import { PlaywrightCrawler, log } from 'crawlee'
import { router } from './routes/routes-clients.js'

// Define the URL to start the crawl from
const START_URLS = ['https://sabusinesslistings.co.za/listings/']

const clientCrawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 50,
  requestHandler: router
})

await clientCrawler.run(START_URLS)
