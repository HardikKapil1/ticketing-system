import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: '*' })
export class NotificationsGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token as string;
    console.log('Token received:', token);
    if (token) {
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        const userId = payload.userId;
        socket.join(`user_${userId}`);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }
  async sendNotification(userId: number, message: string) {
    this.server.to(`user_${userId}`).emit('notification', message);
  }
}
