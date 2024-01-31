# Getting started with Crawlee

The application uses `crawlee`to handle the heavy-lifting of scraping websites. You can visit the docs at [Crawlee Docs](https://crawlee.dev/).

## Development

After cloning the repo, you need to run the following command from the terminal in root directory of the project.

```
# installs all dependencies
pnpm i (recommended)

# or
npm i

# yarn
```

After the dependencies are installed you can run the application in development mode.

```
# start the development server
pnpm run start

# or
npm run start

# yarn start
```

Then entry point for the application is in the `main.ts` file. For now all routes are located in the `/src/routes/` directory.
