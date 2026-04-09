// src/event/event.controller.ts

import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';

import { EventService } from './event.service';
import { Event } from './event.entity';
import { UpdateEventDto } from './event.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilterType } from './event.enum';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    // 🔓 PUBLIC
    @Post()
    create(@Body() body: Event) {
        return this.eventService.createEvent(body);
    }

    // 🔐 PROTECTED
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiQuery({ name: 'filter', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    getAll(
        @Query('filter') filter?: FilterType,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.eventService.getEvents(filter, page, limit, search);
    }

    // 🔐 PROTECTED
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getById(@Param('id') id: string) {
        return this.eventService.getEventById(Number(id));
    }

    // 🔐 PROTECTED
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.eventService.deleteEvent(Number(id));
    }

    // 🔐 PROTECTED
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: UpdateEventDto,
    ) {
        return this.eventService.updateEvent(Number(id), body);
    }
}