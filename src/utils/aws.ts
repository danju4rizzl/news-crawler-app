import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand
} from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

const client = new S3Client({ region: 'us-east-2' })

export const saveToS3 = async () => {
  const command = new ListBucketsCommand({})

  const filePath = path.resolve(
    __dirname,
    '../storage/key_value_stores/default/competitor-data-file.json'
  )
  const fileStream = fs.createReadStream(filePath)

  const params = {
    Bucket: 'your-bucket-name', // replace with your bucket name
    Key: 'competitor-data-file.json', // replace with your desired key
    Body: fileStream
  }

  try {
    // const response = await client.send(new PutObjectCommand(params))
    // console.log(`Successfully uploaded data to ${params.Bucket}/${params.Key}`)

    const { Buckets } = await client.send(command)
    const res = Buckets?.map((b) => b.Name).join('\n')
    console.log('Buckets:  ', res)
    // return res
  } catch (err) {
    console.error(`Error uploading data to S3: ${err}`)
  }
}
