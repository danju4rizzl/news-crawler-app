import { Dataset, createPlaywrightRouter } from 'crawlee'

export const router = createPlaywrightRouter()

// Handler for the 'LISTING' label
router.addHandler('LISTING', async ({ page }) => {
  // Locate the element with class 'job_description'
  const infoElement = page.locator('.job_description')

  // Get all the inner texts of the 'infoElement'
  const allInfo = await infoElement.allInnerTexts()

  // Format the retrieved information
  const results = formatAllInfo(allInfo)

  // Push the formatted data to the Dataset
  await Dataset.pushData(results)

  // Export the Dataset to JSON file
  await Dataset.exportToJSON('client-data')

  // Log the client's information
  console.log("Client's info: ", results)
})

// Default handler for other labels
router.addDefaultHandler(async ({ page, enqueueLinks }) => {
  // Selector for the category element
  const categorySelector = '.job_listings .grid__item a'

  // Selector for the next page element
  const nextPageSelector = '.job-manager-pagination ul li:last-child'

  // Wait for the category selector to appear on the page
  await page.waitForSelector(categorySelector)

  // Enqueue links with the 'LISTING' label using the category selector
  await enqueueLinks({
    selector: categorySelector,
    label: 'LISTING'
  })

  // Wait for the next page selector to appear on the page
  const nextButton = await page.waitForSelector(nextPageSelector)

  // If nextButton exists, enqueue links with the 'LISTING' label using the next page selector
  if (nextButton) {
    await enqueueLinks({
      selector: nextPageSelector,
      label: 'LISTING'
    })
  }
})

/**
 * Function to format the listing information
 *
 * @param infos - An array of text from the listing information.
 * @returns - A formatted array of objects with the company name, location, contact, email, and website.
 */
function formatAllInfo(infos: string[]) {
  const results = []

  // Iterate through each item in 'allInfo'
  for (const item of infos) {
    // Split the item into an array of lines using the newline character as the delimiter
    // Filter out any empty or whitespace-only lines
    const [company, location, contact, email, website] = item
      .split('\n')
      .filter((p) => p.trim().length > 0)

    // Create a result object with formatted values
    const result = {
      company: company.replace('Company Name: ', ''),
      location: location.replace('Location: ', ''),
      contact: contact.replace('Contact Number: ', ''),
      email: email.replace('Email: ', ''),
      website: website.includes('www') ? website.replace('Website: ', '') : null
    }

    // Push the result object to the 'results' array
    results.push(result)
  }

  // Return the formatted 'results' array
  return results
}
