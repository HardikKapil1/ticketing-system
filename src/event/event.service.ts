// src/event/event.service.ts

import { Injectable } from '@nestjs/common';
import { Event } from './event.entity';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { getDateRange } from '../utils/date-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from 'typeorm';

@Injectable()
export class EventService {
    @InjectRepository(Event)
    private eventRepository!: Repository<Event>;

    /**   * Creates a new event and adds it to the in-memory list.
       * @param data - The event data to create.
       * @returns The newly created event.
       * @throws BadRequestException if the event title is missing.
    */
    async createEvent(data: Event) {
        if (!data.title) {
            throw new BadRequestException('Event title is required');
        }
        const newEvent = {
            ...data,
        };
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
        console.log("Requested ID:", id);
        console.log("All events:", await this.eventRepository.find());
        return event;
    }
    /**
     * Deletes an event by its ID.
     * @param id 
     * @returns A confirmation message.
     */
    async deleteEvent(id: number) {
        const event = await this.eventRepository.findOne({ where: { id } });

        if (!event) {
            throw new NotFoundException(`Event with id ${id} not found`);
        }

        await this.eventRepository.remove(event);

        return { message: 'Event deleted' };
    }
    /**
     * Updates an existing event by its ID.
     * @param id 
     * @param data 
     * @returns The updated event.
     */
    async updateEvent(id: number, data: Partial<Event>) {
        const event = await this.eventRepository.findOne({ where: { id } });

        if (!event) {
            throw new NotFoundException(`Event with id ${id} not found`);
        }

        if (data.title !== undefined && data.title.trim() === '') {
            throw new BadRequestException('Title cannot be empty');
        }

        Object.assign(event, data);
        await this.eventRepository.save(event);
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
    // src/event/event.service.ts

    async getEvents(page?: string, limit?: string, search?: string) {
        const query = this.eventRepository.createQueryBuilder('event');
        if (search) {
            const { start, end } = getDateRange(search);

            query.andWhere('event.date BETWEEN :start AND :end', {
                start,
                end,
            });
        }
        // ✅ SEARCH
        if (search) {
            query.andWhere(
                '(event.title LIKE :search OR event.location LIKE :search)',
                { search: `%${search}%` }
            );
        }

        // ✅ PAGINATION
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Number(limit) || 5;

        query.skip((pageNum - 1) * limitNum);
        query.take(limitNum);

        // ✅ EXECUTE
        const [data, total] = await query.getManyAndCount();

        return {
            total,
            page: pageNum,
            limit: limitNum,
            data,
        };
    }
}
