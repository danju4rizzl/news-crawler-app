import { Dataset, PlaywrightCrawler, log } from 'crawlee'
import { router } from './routes/yellowpages-south-africa.js'
import { DataItem, saveBatchToDynamo } from './utils/aws.js'

// Define the URL to start the crawl from
const START_URLS = ['https://www.yellowpages-south-africa.com']

const clientCrawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 5,
  requestHandler: router
})

await clientCrawler.run(START_URLS)

if (!clientCrawler.running) {
  const allScrapedData = await Dataset.getData()

  const transformedData = allScrapedData.items.map(
    ({ id, company, phone }) => ({
      id,
      company,
      phone
    })
  )

  saveBatchToDynamo(transformedData)
}
