import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { IAuthData } from '../auth/interface/auth.interface';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommunicationRoomResponseDto } from './dto/get-communication-room.response';
import { CommunicationRoomMessageResponseDto } from './dto/get-communication-room-messages.response.dto';
import { ResponseMessage } from '../../common/utils/api-response-message.util';

@Controller('communication')
@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
@ApiExtraModels(
  CommunicationRoomMessageResponseDto,
  CommunicationRoomResponseDto,
)
export class CommunicationController {
  constructor(private readonly communicateService: CommunicationService) {}

  @Get('/rooms')
  @ApiOperation({ summary: 'Get user communication room' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Communication rooms'),
    type: ApiResponseDto<CommunicationRoomResponseDto>,
  })
  async getCommunicationsRooms(@Request() req: Request & { user: IAuthData }) {
    const res = await this.communicateService.getUserCommunicationRooms(
      req.user.id,
    );
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Communication rooms'),
      res,
    );
  }

  @Get('/unread')
  @ApiOperation({ summary: 'Get unread messages for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Unread messages'),
    type: ApiResponseDto,
  })
  async getUnreadMessages(@Request() req: Request & { user: IAuthData }) {
    const res = await this.communicateService.getUnreadMessagesForUser(
      req.user.id,
    );
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Unread messages'),
      res,
    );
  }

  @Get('/:roomId')
  @ApiOperation({ summary: 'Get communication room messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully(
      'Communication rooms message',
    ),
    type: ApiResponseDto<CommunicationRoomMessageResponseDto>,
  })
  async getCommunicationRoomMessages(
    @Param('roomId') roomId: string,
    @Request() req: Request & { user: IAuthData },
  ) {
    const res = await this.communicateService.getCommunicationRoomMessages(
      roomId,
      req.user.id,
    );
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Communication rooms message'),
      res,
    );
  }

  @Get('/:roomId/unread-count')
  @ApiOperation({ summary: 'Get unread message count for a room' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('Unread message count'),
    type: ApiResponseDto,
  })
  async getUnreadMessageCount(
    @Param('roomId') roomId: string,
    @Request() req: Request & { user: IAuthData },
  ) {
    const res = await this.communicateService.getUnreadMessageCount(
      roomId,
      req.user.id,
    );
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Unread message count'),
      { count: res },
    );
  }

  @Post('/:roomId/mark-read')
  @ApiOperation({ summary: 'Mark all messages in a room as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.updated('Messages marked as read'),
    type: ApiResponseDto,
  })
  async markRoomMessagesAsRead(
    @Param('roomId') roomId: string,
    @Request() req: Request & { user: IAuthData },
  ) {
    await this.communicateService.markRoomMessagesAsRead(roomId, req.user.id);
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.updated('Messages marked as read'),
      null,
    );
  }
}
