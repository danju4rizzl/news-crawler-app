# Getting started with Crawlee

The application uses `crawlee`to handle the heavy-lifting of scraping websites. You can visit the docs at [Crawlee Docs](https://crawlee.dev/).

## Development

After cloning the repo, you need to run the following command from the terminal in root directory of the project.

```bash
# installs all dependencies
pnpm i (recommended)

# or
npm i

# yarn
```

After the dependencies are installed you can run the application in development mode.

```bash
# start the development server
pnpm run start

# or
npm run start

# yarn start
```

Then entry point for the application is in the `main.ts` file. For now all routes are in the `/src/routes.ts` directory

### Working with AWS

Whenever the scraper finishes it saves the scraped data with the `saveToS3()` called in the `main.ts` file by sends the json file to Amazon Simple Storage Service (s3).

You can update the s3 Configuration like so:

```js
// src/lib/aws.ts
const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: '<ADD_ENV_VARIABLE_HERE>',
    secretAccessKey: '<ADD_ENV_VARIABLE_HERE>'
  }
})
```

The application also saves the scraped data to an [Amazon Dynamodb](https://docs.aws.amazon.com/dynamodb/index.html) table. You can add or modify the `aws.ts` file to make changes to the database.

### Working with AI - GenerativeAI

The configuration is found in the `src/lib/ai.ts`, which exports `aiModel` globally trough the application. However you'll need a GenerativeAI API key from [Google's Maker Suite](https://makersuite.google.com/app).

You can also change the prompts sent to the AI model in `src\lib\helpers.ts` eg:

```js
const response = await aiModel.generateContent(`Change the prompt here`)
```
