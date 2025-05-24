import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  sign(payload: any): string {
    return this.jwt.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });
  }

  verify(token: string): any {
    try {
      return this.jwt.verify(token, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new Error('Invalid token', error as Error);
    }
  }
}
