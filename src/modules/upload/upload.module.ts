import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { S3Service } from '../../common/services/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt/jwt.config';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UploadController],
  providers: [S3Service, S3Client],
})
export class UploadModule {}
