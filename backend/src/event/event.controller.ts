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
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { CreateEventDto } from './event.dto';
import { UpdateEventDto } from './event.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilterType } from '../common/enums/event.enum';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtUser } from 'src/common/interfaces/jwt-user.inteface';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 🔐 ADMIN ONLY
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: CreateEventDto, @Req() req: { user: JwtUser }) {
    return this.eventService.createEvent(body, req.user.userId );
  }

  // 🔐 AUTHENTICATED USERS
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiQuery({ name: 'filter', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAll(
    @Req() req: { user: JwtUser },
    @Query('filter') filter?: FilterType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.eventService.getEvents(req.user, filter, page, limit, search);
  }

  // 🔐 AUTHENTICATED USERS
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getById(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.eventService.getEventById(Number(id));
  }

  // 🔐 ADMIN ONLY
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.eventService.deleteEvent(Number(id), req.user);
  }

  // 🔐 ADMIN ONLY
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateEventDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.eventService.updateEvent(Number(id), body, req.user);
  }
}
