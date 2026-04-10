import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
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