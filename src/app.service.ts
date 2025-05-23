import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerHeatbeat(): string {
    return 'Server hearbeat works!';
  }
}
