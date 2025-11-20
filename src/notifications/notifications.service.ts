import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  // TODO: Implement logic to send notifications
  sendNotification(userId: string, message: string) {
    console.log(`Sending notification to user ${userId}: ${message}`);
  }
}
