import { Dataset, createPlaywrightRouter } from 'crawlee'
import { saveToDB } from '../utils/aws.js'
import { v4 as uuidv4 } from 'uuid'

export const router = createPlaywrightRouter()

router.addHandler('CLIENT', async ({ log }) => {
  log.info('Here in BUSINESSES')
})

// Default handler for other labels
router.addDefaultHandler(async ({ page, enqueueLinks, log }) => {
  log.info('Here in Default')
  const cards = await page.$$('.card')
  const results = []

  for (const card of cards) {
    const company = await card.$eval('h2 a', (el) => el.textContent)
    const phone = await card.$eval(
      '.card-body .col-4:nth-of-type(1) + .col-8:nth-of-type(2)',
      (el) =>
        el.textContent
          ?.replace('-', '')
          .replace(' ', '')
          .replace('+27', '0')
          .trim()
    )

    const result = {
      id: uuidv4(),
      company,
      phone
    }

    const savedData = await saveToDB(result)
    console.log('saved:', savedData)
    results.push(result)
  }

  // Check the next buttons for pagination
  const nextButton = await page.$('ul.pagination li:last-child a ')
  if (nextButton) {
    await enqueueLinks({
      selector: 'ul.pagination li:last-child a',
      label: 'BUSINESSES'
    })
  }

  // Save the data that scraped
  console.log(results)
  // await Dataset.pushData(results)
  // await Dataset.exportToJSON('yellowpages-south-africa')
})
