import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../../common/services/s3.service';
import { imageFileFilter } from './filters/image-file.filter';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ResponseMessage } from '../../common/utils/api-response-message.util';

@Controller('upload')
@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Upload a file to S3' })
  @ApiConsumes('multipart/form-data')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const data = await this.s3Service.uploadFile(file);
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.uploadedSuccessfully('Image'),
      {
        key: data.key,
        originalName: data.url,
      },
    );
  }
}
