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

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UserModule,
    RatingModule,
    SubscriptionModule,
    CommunicationModule,
    ServiceProvidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
