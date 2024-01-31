import { PlaywrightCrawler, log } from 'crawlee'
import { router } from './routes/yellowpages-south-africa.js'

// Define the URL to start the crawl from
const START_URLS = ['https://www.yellowpages-south-africa.com']

const clientCrawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 5,
  requestHandler: router
})

const crawl = await clientCrawler.run(START_URLS)

if (crawl.requestsFinished) {
  //
}
