import {
  Controller,
  Get,
  HttpStatus,
  Param,
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

  @Get('/:roomId')
  @ApiOperation({ summary: 'Get communication room messages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully(
      'Communication rooms message',
    ),
    type: ApiResponseDto<CommunicationRoomMessageResponseDto>,
  })
  async getCommunicationRoomMessages(@Param('roomId') roomId: string) {
    const res =
      await this.communicateService.getCommunicationRoomMessages(roomId);
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('Communication rooms message'),
      res,
    );
  }
}
