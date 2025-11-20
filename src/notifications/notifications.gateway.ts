import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: true }) // TODO: Configure CORS properly for production
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('sendNotification')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('notification', `New message: ${message}`);
  }

  // TODO: Implement real-time notifications for likes, comments, follows
}
