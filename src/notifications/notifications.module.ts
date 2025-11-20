import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsGateway, NotificationsService] // Export the gateway
})
export class NotificationsModule {}
