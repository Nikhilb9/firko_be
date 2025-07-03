import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerHeartbeat(): string {
    return 'Server heartbeat works!';
  }
}
