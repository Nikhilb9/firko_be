import { Controller, Get } from '@nestjs/common';

@Controller('communication')
export class CommunicationController {
  @Get('/rooms')
  getCommunicationsRooms() {}

  @Get('/:roomId')
  getCommunicationRoomMessages() {}
}
