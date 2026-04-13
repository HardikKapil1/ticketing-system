// src/event/event.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  location!: string;

  @Column()
  date!: Date;

  @Column()
  userId!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', default: 0 })
  price!: number;

  @Column({ default: 100 })
  totalSeats!: number;

  @Column({ default: 100 })
  availableSeats!: number;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  bannerImage?: string;
}
