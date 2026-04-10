import { ApiProperty } from "@nestjs/swagger";

export class UpdateEventDto {
  @ApiProperty({ example: 'Concert', description: 'The title of the event' }) 
  title?: string;
  @ApiProperty({ example: '123 Main St', description: 'The location of the event' })
  location?: string;
  @ApiProperty({ example: '2023-10-15T20:00:00.000Z', description: 'The date and time of the event' })
  date?: Date;
}
export class CreateEventDto {
  @ApiProperty({ example: 'Concert Night' })
  title!: string;

  @ApiProperty({ example: 'Delhi' })
  location!: string;

  @ApiProperty({ example: '2026-05-01' })
  date!: Date;
}