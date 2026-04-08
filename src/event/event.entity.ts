// src/event/event.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  title: string | undefined;

  @Column()
  location: string | undefined;

  @Column()
  date: Date | undefined;
}
