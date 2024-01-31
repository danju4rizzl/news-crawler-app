import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb'

const s3 = new S3Client({ region: 'us-east-2' })
const db = new DynamoDBClient({ region: 'us-west-2' })

export interface DataItem {
  id: string
  company: string
  phone: string
}

const dataArr: DataItem[] = [
  { id: '1', company: 'ABC', phone: '123' },
  { id: '2', company: 'DEF', phone: '456' },
  { id: '3', company: 'GHI', phone: '789' }
]

export const saveSingleToDynamo = async (data: any) => {
  const { company, phone, id } = data
  const ddbDocClient = DynamoDBDocumentClient.from(db)

  const saveItem = new PutCommand({
    TableName: 'scaper-db',
    Item: {
      id,
      company,
      phone
    }
  })

  return await ddbDocClient.send(saveItem)
}

// Save the data the data in batches
export const saveBatchToDynamo = async (data: DataItem[]) => {
  const ddbDocClient = DynamoDBDocumentClient.from(db)

  const transformedData = data.map((item: DataItem) => ({
    PutRequest: { Item: item }
  }))

  const saveBatchItems = new BatchWriteCommand({
    RequestItems: {
      ScrapedDatabase: data.map(({ id, company, phone }: DataItem) => ({
        PutRequest: {
          Item: {
            id,
            company,
            phone
          }
        }
      }))
    }
  })

  // console.log('data going to AWS', transformedData)
  try {
    console.log('data going to AWS', data)
    return await ddbDocClient.send(saveBatchItems)
  } catch (error) {
    console.log('Something happened when sending to AWS')
  }
}

// Save the files to s3
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
