// src/event/event.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { Event } from './event.entity';
import { BadRequestException, Req, ForbiddenException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { getDateRange } from '../utils/date-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterType } from '../common/enums/event.enum';
import { Role } from 'src/common/enums/role.enum';
import { JwtUser } from 'src/common/interfaces/jwt-user.inteface';
import Redis from 'ioredis';
import { CreateEventDto, UpdateEventDto } from './event.dto';


@Injectable()
export class EventService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient!: Redis;

  @InjectRepository(Event)
  private eventRepository!: Repository<Event>;

  /**   * Creates a new event and adds it to the in-memory list.
   * @param data - The event data to create.
   * @returns The newly created event.
   * @throws BadRequestException if the event title is missing.
   */
  async createEvent(data: CreateEventDto, userId: number ) {
    if (!data.title) {
      throw new BadRequestException('Event title is required');
    }
    const newEvent = {
      ...data,
      userId, // 👈 attach owner
      availableSeats: data.totalSeats,
    };
    const keys =await this.redisClient.keys( 'events:*');
    if(keys.length > 0) {
      await this.redisClient.del(keys);
    }
    await this.eventRepository.save(newEvent);
    return newEvent;
  }
  /**
   * Retrieves an event by its ID.
   * @param id
   * @returns The event with the specified ID, or throws an error if not found.
   */
  async getEventById(id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    console.log('Requested ID:', id);
    console.log('All events:', await this.eventRepository.find());
    return event;
  }
  /**
   * Deletes an event by its ID.
   * @param id
   * @returns A confirmation message.
   */
  async deleteEvent(id: number, user: JwtUser) {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (user.role !== Role.ADMIN && event.userId !== user.userId) {
      throw new ForbiddenException('Not allowed to delete this event');
    }

    await this.eventRepository.remove(event);
    const keys =await this.redisClient.keys( 'events:*');
    if(keys.length > 0) {
      await this.redisClient.del(keys);
    }

    return { message: 'Event deleted' };
  }
  /**
   * Updates an existing event by its ID.
   * @param id
   * @param data
   * @returns The updated event.
   */
  async updateEvent(id: number, data: Partial<UpdateEventDto>, user: JwtUser) {
    const event = await this.eventRepository.findOne({ where: { id } });
    
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    
    if (user.role !== Role.ADMIN && event.userId !== user.userId) {
      throw new ForbiddenException('Not allowed to update this event');
    }
    
    if (data.title !== undefined && data.title.trim() === '') {
      throw new BadRequestException('Title cannot be empty');
    }
    
    Object.assign(event, data);
    await this.eventRepository.save(event);
    const keys =await this.redisClient.keys( 'events:*');
    if(keys.length > 0) {
      await this.redisClient.del(keys);
    }
    return event;
  }

  /**
   * Retrieves all events with optional filtering, searching, and pagination.
   * @param filter
   * @param page
   * @param limit
   * @param search
   * @returns A list of events based on the provided criteria.
   */
  async getEvents(
    userId:JwtUser,
    filter?: FilterType,
    page?: string,
    limit?: string,
    search?: string,
  ) {
    const cacheKey = `events:${filter || 'all'}:${search || 'none'}:${page || '1'}:${limit || '5'}`;
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const query = this.eventRepository.createQueryBuilder('event');

    if (filter && !Object.values(FilterType).includes(filter as FilterType)) {
      throw new BadRequestException('Invalid filter');
    }

    if (filter) {
      const { start, end } = getDateRange(filter);
      query.andWhere('event.date BETWEEN :start AND :end', { start, end });
    }

    if (search) {
      query.andWhere(
        '(event.title LIKE :search OR event.location LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(Number(limit) || 5, 50);

    query.skip((pageNum - 1) * limitNum);
    query.take(limitNum);
    query.orderBy('event.date', 'DESC');

    const [data, total] = await query.getManyAndCount();

    await this.redisClient.setex(cacheKey, 3600, JSON.stringify({ total, page: pageNum, limit: limitNum, data }));

    return { total, page: pageNum, limit: limitNum, data };
  }
}
