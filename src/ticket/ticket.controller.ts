import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BookTicketDto } from './ticket.dto';


@ApiBearerAuth('access-token')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async bookTicket(@Request() req, @Body() ticketData: BookTicketDto) {
    return this.ticketService.bookTicket(
      req.user.userId,
      ticketData.eventId,
      ticketData.seatNumber,
    );
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMyTickets(@Request() req) {
    return this.ticketService.getTicketsForUser(req.user.userId);
  }
}
