import { Dataset, PlaywrightCrawler, log } from 'crawlee'
import { router } from './routes/yellowpages-south-africa.js'
import { backupToS3 } from './utils/aws.js'

// Define the URL to start the crawl from
const START_URLS = ['https://www.yellowpages-south-africa.com']

const clientCrawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 5,
  requestHandler: router
})

await clientCrawler.run(START_URLS)

// Runs when the crawler is finished.
if (!clientCrawler.running) {
  console.log('\n 🟢👍🟢 Crawler is finished \n')
  await backupToS3('yellowpages-south-africa.json')
}
