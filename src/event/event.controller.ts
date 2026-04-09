// src/event/event.controller.ts

import { Controller, Post, Body, Get, Param, Delete, Patch, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { UpdateEventDto } from './event.dto';
import { Filter } from 'typeorm';
import { FilterType } from './event.enum';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post()
    create(@Body() body: Event) {
        return this.eventService.createEvent(body);
    }

    @Get()
    findAll() {
        return this.eventService.getEvents();
    }

    @Get(':id')
    getbyId(@Param('id') id: string) {
        return this.eventService.getEventById(Number(id));
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.eventService.deleteEvent(Number(id));
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: UpdateEventDto) {
        return this.eventService.updateEvent(Number(id), body);
    }

    @Get()
    getAll(
        @Query('filter') filter?: FilterType,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.eventService.getEvents(filter, page, limit, search);
    }
}
