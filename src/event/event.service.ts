// src/event/event.service.ts

import { Injectable } from '@nestjs/common';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  private events: Event[] = [];

  createEvent(data: Event) {
    const newEvent = {
      ...data,
      id: this.events.length + 1,
    };

    this.events.push(newEvent);
    return newEvent;
  }

  getEvents() {
    return this.events;
  }
}
