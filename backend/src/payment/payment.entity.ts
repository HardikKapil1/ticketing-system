import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderId!: string;

  @Column({ nullable: true })
  paymentId?: string;

  @Column()
  eventId!: number;

  @Column()
  seatNumber!: string;

  @Column()
  userId!: number;

  @Column()
  status!: string; // CREATED | SUCCESS | FAILED
}