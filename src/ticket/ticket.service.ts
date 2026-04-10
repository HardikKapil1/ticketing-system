import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
    @InjectRepository(Ticket)
    private ticketRepository!: Repository<Ticket>;

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
        return newTicket;
    }
}
