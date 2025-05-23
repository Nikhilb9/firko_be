import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/server')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/heartbeat')
  getServerHeatbeat(): string {
    return this.appService.getServerHeatbeat();
  }
}
