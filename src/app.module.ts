import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RatingModule } from './modules/rating/rating.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { ServiceProvidersModule } from './modules/service-providers/service-providers.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlacesModule } from './modules/places/places.module';
import { APP_GUARD } from '@nestjs/core';
import { RequestRateLimiterGuard } from './common/guards/request-rate-limitter.guard';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UserModule,
    RatingModule,
    SubscriptionModule,
    CommunicationModule,
    ServiceProvidersModule,
    UploadModule,
    NotificationModule,
    PlacesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: () => new RequestRateLimiterGuard(6, 60 * 1000, false),
    },
    AppService,
  ],
  exports: [],
})
export class AppModule {}
