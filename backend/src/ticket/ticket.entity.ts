import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Ticket {
  @Unique(['eventId', 'seatNumber']) // Ensure seat uniqueness per event
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookingDate!: Date;

  @Column()
  seatNumber!: string;

  @Column()
  userId!: number;

  @Column()
  eventId!: number;
}
