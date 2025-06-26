import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { GUPSHUP_BASE_URL } from '../../config/config';

@Injectable()
export class SmsService {
  private readonly apiUrl: string | undefined;
  private readonly userPassword: string | undefined;
  private readonly userId: string | undefined;
  private readonly messageMethod: string = 'SendMessage';
  private readonly messageType: string = 'text';
  private readonly formatType: string = 'text';
  private readonly authSchema: string = 'plain';
  private readonly version: string = '1.1';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = GUPSHUP_BASE_URL;
    this.userId = this.configService.get<string>('GUPSHUP_SMS_USER_ID');
    this.userPassword = this.configService.get<string>('GUPSHUP_SMS_PASSWORD');
  }

  async sendSMS(sendTo: string, message: string): Promise<any> {
    const queryObject: Record<string, unknown> = {
      userid: this.userId,
      passsword: this.userPassword,
      method: this.messageMethod,
      messageType: this.messageType,
      format: this.formatType,
      auth_scheme: this.authSchema,
      v: this.version,
      send_to: sendTo,
      msg: message,
    };
    const queryString = qs.stringify(queryObject);

    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.apiUrl}?${queryString}`),
      );
      return response.data;
    } catch {
      throw new HttpException('SMS sending failed', HttpStatus.BAD_GATEWAY);
    }
  }
}
