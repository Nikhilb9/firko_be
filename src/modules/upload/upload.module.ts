import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { S3Service } from '../../common/services/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { JwtService } from '../../common/services/jwt.service';
import { SharedJwtModule } from '../../common/modules/jwt.module';

@Module({
  imports: [SharedJwtModule],
  controllers: [UploadController],
  providers: [S3Service, S3Client, JwtService],
})
export class UploadModule {}
