import { ApiProperty } from "@nestjs/swagger";

export class BookTicketDto {
    @ApiProperty({ example: 1, description: 'The ID of the event' })
    eventId!: number;
    @ApiProperty({ example: 'A1', description: 'The seat number for the ticket' })
    seatNumber!: string;
}