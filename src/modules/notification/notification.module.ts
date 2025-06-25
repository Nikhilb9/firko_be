import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepositoryService } from './notification.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schema/notification.schema';
import { JwtService } from 'src/common/services/jwt.service';
import { SharedJwtModule } from 'src/common/modules/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    SharedJwtModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepositoryService, JwtService],
})
export class NotificationModule {}
