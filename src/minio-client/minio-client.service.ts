import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto'

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = process.env.MINIO_BUCKET

  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
  ) {


    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            "s3:ListBucket",
            "s3:GetBucketLocation"

          ],
          Resource: ['arn:aws:s3:::images'], // Change this according to your bucket name
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:PutObject',
            's3:AbortMultipartUpload',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
          ],
          Resource: ['arn:aws:s3:::images/*'], // Change this according to your bucket name
        },
      ],
    };
    this.client.setBucketPolicy(
      'images',
      JSON.stringify(policy),
      function (err) {
        if (err) throw err;

        console.log('Bucket policy set');
      },
    );

    this.logger = new Logger('MinioStorageService');
  }


  algorithm = 'aes-256-cbc';
  key = crypto.randomBytes(32);
  iv = crypto.randomBytes(16);

  async encrypt(text: string) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key), this.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: this.iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  }

  async decrypt(text: any) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }



  public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {

    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    }
    let temp_filename = Date.now().toString()
    let hashedFileName = await this.encrypt(temp_filename);
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    let filename = hashedFileName.encryptedData + ext
    const fileName: string = `${filename}`;
    const fileBuffer = file.buffer;

    this.client.putObject(baseBucket, fileName, fileBuffer, metaData, function (err, res) {
      if (err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    })


    return {
      hashedFileName: { iv: hashedFileName.iv, encryptedData: hashedFileName.encryptedData + ext },
      relative_path: `${process.env.MINIO_BUCKET}/${filename}`,
      absolute_path: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${filename}`
    }
  }
  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objetName, function (err, res) {
      if (err) throw new HttpException("Oops Something wrong happend", HttpStatus.BAD_REQUEST)
    })
  }
}