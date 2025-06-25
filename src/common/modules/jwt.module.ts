import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '../services/jwt.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [JwtService],
  exports: [JwtModule, JwtService],
})
export class SharedJwtModule {}
