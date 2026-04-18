import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { DataSource, Repository, QueryFailedError } from 'typeorm';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Event } from 'src/event/event.entity'

@Injectable()
export class TicketService {
  constructor(
    private dataSource: DataSource,
    private notificationsGateway: NotificationsGateway,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) { }

  /**
   * Books a new ticket for a user for a specific event and seat number.
   * @param userId
   * @param eventId
   * @param seatNumber
   * @returns
   */
  async bookTicket(userId: number, eventId: number, seatNumber: string) {
    const ticket = await this.dataSource.transaction(async (manager) => {
      const eventRepo = manager.getRepository(Event);
      const ticketRepo = manager.getRepository(Ticket);

      const event = await eventRepo.findOne({ where: { id: eventId } });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (event.availableSeats <= 0) {
        throw new BadRequestException('No available seats');
      }

      event.availableSeats -= 1;
      await eventRepo.save(event);

      const ticket = ticketRepo.create({
        userId,
        eventId,
        seatNumber,
        bookingDate: new Date(),
      });

      // 👇 optional but recommended (handles unique seat constraint)

      try {
        await ticketRepo.save(ticket);
      } catch (err) {
        if (err instanceof QueryFailedError) {
          throw new BadRequestException('Seat already booked');
        }
        throw err;
      }

      return ticket;
    });
    await this.notificationsGateway.sendNotification(
      userId,
      'Your ticket has been booked successfully.'
    );

    return ticket;
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
