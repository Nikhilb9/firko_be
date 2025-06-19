import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IAuthData } from '../auth/interface/auth.interface';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { RatingResponseDto } from './dto/get-rating.response.dto';
import { IRatingResponse } from './interface/rating.interface';
import { ResponseMessage } from 'src/common/utils/api-response-message.util';

@Controller('rating')
@ApiExtraModels(RatingResponseDto)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Post service rating' })
  @ApiBody({ type: CreateRatingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.created('Rating'),
    type: ApiResponseDto,
  })
  async giveRating(
    @Request() req: Request & { user: IAuthData },
    @Body() dto: CreateRatingDto,
  ): Promise<ApiResponseDto<null>> {
    const userId = req.user.id;
    await this.ratingService.giveRating(userId, dto);
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.created('Rating'),
    );
  }

  @Get('/:serviceId')
  @ApiOperation({ summary: 'Service rating list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Ratings'),
    type: ApiResponseDto<RatingResponseDto[]>,
  })
  async getServiceProductRatings(@Param('serviceId') serviceId: string) {
    const res: IRatingResponse[] =
      await this.ratingService.getRatings(serviceId);
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Ratings'),
      res,
    );
  }
}
