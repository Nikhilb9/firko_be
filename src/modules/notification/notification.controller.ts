import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Put,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { NotificationResponseDto } from './dto/get-notification-list-response.dto';
import { NotificationService } from './notification.service';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { IAuthData } from '../auth/interface/auth.interface';
import { GetNotificationListQueryDto } from './dto/get-notification-list-query.dto';
import { ResponseMessage } from '../../common/utils/api-response-message.util';

@Controller('notification')
@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
@ApiExtraModels(NotificationResponseDto)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get('/list')
  @ApiOperation({ summary: 'Get user notification list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.updated('User notifications'),
    type: ApiResponseDto<NotificationResponseDto>,
  })
  async getUserNotifications(
    @Request() req: Request & { user: IAuthData },
    @Query() query: GetNotificationListQueryDto,
  ): Promise<ApiResponseDto<NotificationResponseDto[]>> {
    const notifications: NotificationResponseDto[] =
      await this.notificationService.getUserNotifications(
        req.user.id,
        query.page,
        query.limit,
      );
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('User notifications'),
      notifications,
    );
  }

  @Put('/:notificationId')
  @ApiOperation({ summary: 'Update notification is read' })
  @ApiParam({
    name: 'notificationId',
    description: 'Update notification is read',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.updated('Notification'),
    type: ApiResponseDto,
  })
  async updateUserNotificationIsRead(
    @Param('notificationId') notificationId: string,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<null>> {
    await this.notificationService.readUserNotification(
      notificationId,
      req.user.id,
    );

    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.updated('Notification'),
    );
  }
}
