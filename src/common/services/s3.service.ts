import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3: S3Client,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') ?? '',
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') ?? '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const extension: string | undefined = file?.originalname?.split('.').pop();
    const key = `${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,

      Body: file.buffer,

      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return {
      key,
      url: `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`,
    };
  }
}
