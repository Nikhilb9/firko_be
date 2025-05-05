import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RatingModule } from './rating/rating.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CommunicationModule } from './communication/communication.module';
import { ServiceProvidersModule } from './service-providers/service-providers.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    RatingModule,
    SubscriptionModule,
    CommunicationModule,
    ServiceProvidersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
