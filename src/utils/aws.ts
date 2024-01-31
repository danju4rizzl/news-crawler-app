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

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

import fs from 'fs'

const s3 = new S3Client({ region: 'us-west-2' })
const db = new DynamoDBClient({ region: 'us-west-2' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export interface DataItem {
  id: string
  company: string | null
  phone: string | undefined
}

/**
 * Use this to save a single item to dynamodb.
 * */

export const saveDataToDynamoDB = async (data: DataItem) => {
  const { company, phone, id } = data
  const ddbDocClient = DynamoDBDocumentClient.from(db)

  const saveItem = new PutCommand({
    TableName: 'scaper-db',
    Item: {
      id,
      company,
      phone
    },
    ConditionExpression: 'attribute_not_exists(company)'
  })

  try {
    console.log(`Saving ${company} to Database`)
    return await ddbDocClient.send(saveItem)
  } catch (error) {
    console.log('Soothing happens when uploading scraped data to s3')
  }
}

// Used to save the exported json file to s3
/**
 *
 * @param scrapedFileName Name of the file to upload into S3. This is the file that the scraper has saved locally in the default `storage dir`. 🟡 Remember to include the file extension .json | .png | jpg | pdf...etc
 * @example saveToS3('competitor-data-file.json')
 *
 */
export const backupToS3 = async (scrapedFileName: string) => {
  const bucketName = `crawler-bot-v2`
  const objectName = scrapedFileName
  const filePath = resolve(
    __dirname,
    '../../storage/key_value_stores/default/',
    objectName
  )
  // console.log('filepath: ', filePath) // you can debug the filepath

  const fileStream = fs.createReadStream(filePath)
  const buckets = new ListBucketsCommand({})

  const createBucket = new CreateBucketCommand({
    Bucket: bucketName
  })

  const uploadFile = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectName,
    Body: fileStream
  })

  try {
    const { Buckets } = await s3.send(buckets)
    const allBuckets = Buckets?.map((b) => b.Name).join('\n')

    // checks if the bucket already exist if not create the bucketName
    if (!allBuckets?.includes(bucketName)) {
      const { Location } = await s3.send(createBucket)
      console.log(`Created ${Location} bucket`)
    }

    console.log('🟣 Creating S3 backup... \n')
    await s3.send(uploadFile)
    console.log('🟢 Successfully created backup in S3 🪣')

    // return res
  } catch (err) {
    console.error(`Error uploading data to S3: ${err}`)
  }
}

/**
 * TODO: Use this to save the data in batches.
 * Temporarily the function giving an error, so we are using `saveDataToDynamoDB` to save files
 *  */
const __saveBatchToDynamo = async (data: DataItem[]) => {
  const ddbDocClient = DynamoDBDocumentClient.from(db)

  const transformedData = data.map(({ id, company, phone }: DataItem) => ({
    PutRequest: {
      Item: {
        id,
        company,
        phone
      }
    }
  }))

  const saveBatchItems = new BatchWriteCommand({
    RequestItems: {
      ScrapedDatabase: transformedData
    }
  })

  try {
    console.log('data going to AWS', data)
    return await ddbDocClient.send(saveBatchItems)
  } catch (error) {
    console.log('Something happened when sending to AWS')
  }
}
