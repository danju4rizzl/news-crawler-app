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
  // await Dataset.pushData(results)

  // Export the Dataset to JSON file
  // await Dataset.exportToJSON('saved-client-data')

  // Log the client's information
  console.log("Client's info: ", results)
})

// Default handler for other labels
router.addDefaultHandler(async ({ page, enqueueLinks }) => {
  // Selector for the category element
  const categorySelector = '.job_listings .grid__item a'

  // Selector for the next page element
  const nextPageSelector = '.job-manager-pagination ul li a'

  // Wait for the category selector to appear on the page
  await page.waitForSelector(categorySelector)

  while (true) {
    // Enqueue links with the 'LISTING' label using the category selector
    await enqueueLinks({
      selector: categorySelector,
      label: 'LISTING'
    })

    // Get the available page numbers
    const pageNumbers = await page.$$eval(nextPageSelector, (buttons) =>
      buttons.map((button) => parseInt(`${button.getAttribute('data-page')}`))
    )

    // Find the highest page number
    const maxPageNumber = Math.max(...pageNumbers)

    if (maxPageNumber !== pageNumbers[pageNumbers.length - 1]) {
      // Find the next button based on the hightest page number

      // TODO: Fix the next button
      const nextButton = await page.$(
        nextPageSelector + `[data-page="${maxPageNumber + 1}"]`
      )

      console.log('PageNumber ', pageNumbers)
      console.log('maxPageNumber ', maxPageNumber)
      console.log('next button ', nextButton)

      // If nextButton exists, enqueue links with the 'LISTING' label using the next page selector
      if (nextButton) {
        await nextButton.click()
        await page.waitForSelector(categorySelector)

        // TODO: must fix next button not working: returning null
        // await enqueueLinks({
        //   selector: categorySelector,
        //   label: 'LISTING'
        // })
        await page.screenshot({ path: 'screenshot.png' })
        console.log('gotten ', nextButton)
      } else {
        break
      }
    }
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
