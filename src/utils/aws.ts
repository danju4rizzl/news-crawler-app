import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

const client = new S3Client({ region: 'us-east-2' })

export const saveToS3 = async () => {
  const bucketName = `crawler-bot-v1`
  const buckets = new ListBucketsCommand({})

  const createBucket = new CreateBucketCommand({
    Bucket: bucketName
  })

  try {
    const { Buckets } = await client.send(buckets)
    const allBuckets = Buckets?.map((b) => b.Name).join('\n')

    // checks if the bucket already exist if not create the bucketName
    if (!allBuckets?.includes(bucketName)) {
      const { Location } = await client.send(createBucket)
      console.log(`Created ${Location} bucket`)
    }
    console.log('Buckets:  ', allBuckets)

    // return res
  } catch (err) {
    console.error(`Error uploading data to S3: ${err}`)
  }
}
