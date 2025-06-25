import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwt: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  sign(payload: any): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string | number>('JWT_EXPIRES_IN');

    return this.jwt.sign(payload, {
      secret,
      expiresIn,
    });
  }

  verify(token: string): any {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      return this.jwt.verify(token, { secret });
    } catch (error) {
      throw new Error('Invalid token', error as Error);
    }
  }
}
