import { Controller, UseGuards, Request } from '@nestjs/common';
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
}
