import express from 'express'
import fs from 'fs'

const app = express()
const port = 3000

app.get('/api/data', (req, res) => {
  const rawData = fs.readFileSync(
    'storage/key_value_stores/default/saved-client-data.json'
  )
  const data = JSON.parse(rawData)
  res.json(data)
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
