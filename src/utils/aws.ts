import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const s3 = new S3Client({ region: 'us-east-2' })
const db = new DynamoDBClient({ region: 'us-west-2' })

export const saveToDB = async (data) => {
  const { company, phone, id } = data

  const ddbDocClient = DynamoDBDocumentClient.from(db)

  const saveOnDB = new PutCommand({
    TableName: 'scaper-db',
    Item: {
      id,
      company,
      phone
    }
  })

  return await ddbDocClient.send(saveOnDB)
}

export const saveToS3 = async () => {
  const bucketName = `crawler-bot-v1`
  const buckets = new ListBucketsCommand({})

  const createBucket = new CreateBucketCommand({
    Bucket: bucketName
  })

  try {
    const { Buckets } = await s3.send(buckets)
    const allBuckets = Buckets?.map((b) => b.Name).join('\n')

    // checks if the bucket already exist if not create the bucketName
    if (!allBuckets?.includes(bucketName)) {
      const { Location } = await s3.send(createBucket)
      console.log(`Created ${Location} bucket`)
    }
    console.log('Buckets:  ', allBuckets)

    // return res
  } catch (err) {
    console.error(`Error uploading data to S3: ${err}`)
  }
}
