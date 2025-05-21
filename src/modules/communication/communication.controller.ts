import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { IAuthData } from '../auth/interface/auth.interface';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CommunicationRoomResponseDto } from './dto/get-communication-room.response';
import { CommunicationRoomMessageResponseDto } from './dto/get-communication-room-messages.response.dto';

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
    status: 200,
    description: 'Communication rooms',
    type: ApiResponseDto<CommunicationRoomResponseDto>,
  })
  async getCommunicationsRooms(@Request() req: Request & { user: IAuthData }) {
    const res = await this.communicateService.getUserCommunicationRooms(
      req.user.id,
    );
    return new ApiResponseDto(200, 'SUCCESS', 'Communication rooms', res);
  }

  @Get('/:roomId')
  @ApiOperation({ summary: 'Get communication room messages' })
  @ApiResponse({
    status: 200,
    description: 'Communication rooms message',
    type: ApiResponseDto<CommunicationRoomMessageResponseDto>,
  })
  async getCommunicationRoomMessages(@Param('roomId') roomId: string) {
    const res =
      await this.communicateService.getCommunicationRoomMessages(roomId);
    return new ApiResponseDto(
      200,
      'SUCCESS',
      'Communication rooms message',
      res,
    );
  }
}
