import { Dataset, createPlaywrightRouter } from 'crawlee'

export const router = createPlaywrightRouter()

router.addHandler('CLIENT', async ({ page, enqueueLinks, log }) => {
  log.info('Here in BUSINESSES')
})

// Default handler for other labels
router.addDefaultHandler(async ({ page, enqueueLinks, log, request }) => {
  log.info('Here in Default')
  const cards = await page.$$('.card')
  const results = []

  for (const card of cards) {
    const title = await card.$eval('h2 a', (el) => el.textContent)
    const phone = await card.$eval(
      '.card-body .col-4:nth-of-type(1) + .col-8:nth-of-type(2)',
      (el) =>
        el.textContent
          ?.replace('-', '')
          .replace(' ', '')
          .replace('+27', '0')
          .trim()
    )

    results.push({
      title,
      phone
    })
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
  await Dataset.pushData(results)
  await Dataset.exportToJSON('yellowpages-south-africa')
})
