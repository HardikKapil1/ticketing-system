import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Repository } from 'typeorm';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class TicketService {
  constructor(
    private notificationsGateway: NotificationsGateway,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>
  ) {}

  /**
   * Books a new ticket for a user for a specific event and seat number.
   * @param userId
   * @param eventId
   * @param seatNumber
   * @returns
   */
  async bookTicket(userId: number, eventId: number, seatNumber: string) {
    const newTicket = this.ticketRepository.create({
      bookingDate: new Date(),
      seatNumber,
      userId,
      eventId,
    });
    await this.ticketRepository.save(newTicket);
    // Send notification to the user
    await this.notificationsGateway.sendNotification(userId, "Your ticket has been booked successfully.");
    return newTicket;
  }
  /**
   * Retrieves all tickets for a specific user.
   * @param userId
   * @returns Promise<Ticket[]>
   */
  async getTicketsForUser(userId: number) {
    return this.ticketRepository.find({ where: { userId } });
  }
/**
 * Retrieves all tickets.
 * @returns Promise<Ticket[]>
 */
async getAllTickets() {
  return this.ticketRepository.find();
}
}
