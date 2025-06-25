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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IAuthData } from '../auth/interface/auth.interface';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { FeedbackResponseDto } from './dto/feedback.response.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('feedback')
@ApiTags('feedback')
@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
@ApiExtraModels(CreateFeedbackDto)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create new feedback' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feedback created successfully',
    type: ApiResponseDto,
  })
  async createFeedback(
    @Request() req: Request & { user: IAuthData },
    @Body() dto: CreateFeedbackDto,
  ): Promise<ApiResponseDto<null>> {
    const userId = req.user.id;
    await this.feedbackService.createFeedback(userId, dto);
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      'Feedback created successfully',
    );
  }

  @Get(':feedbackId')
  @ApiOperation({ summary: 'Get all feedback for a service' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feedback list retrieved successfully',
    type: ApiResponseDto,
  })
  async getFeedback(
    @Param('feedbackId') feedbackId: string,
  ): Promise<ApiResponseDto<FeedbackResponseDto>> {
    const feedback = await this.feedbackService.getFeedbackById(feedbackId);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      'Feedback list retrieved successfully',
      feedback,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User feedback list retrieved successfully',
    type: ApiResponseDto,
  })
  async getAllFeedback(
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<FeedbackResponseDto[]>> {
    const userId = req.user.id;
    const feedback = await this.feedbackService.getAllFeedbackByUserId(userId);

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      'User feedback list retrieved successfully',
      feedback,
    );
  }
}
