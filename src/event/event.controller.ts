// src/event/event.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() body: Event) {
    return this.eventService.createEvent(body);
  }

  @Get()
  findAll() {
    return this.eventService.getEvents();
  }
}
