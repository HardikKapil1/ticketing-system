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
}
