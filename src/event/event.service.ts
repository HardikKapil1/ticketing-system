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

    async getEvents(filter?: string, page?: string, limit?: string, search?: string) {
        // 1. Start with a copy of all events
        let result = await this.eventRepository.find();
        const now = new Date();

        // 2. APPLY FILTERS (Modify the 'result' array, don't return yet!)
        if (search) {
            return this.eventRepository.find({
                where: [
                    { title: Like(`%${search}%`) },
                    { location: Like(`%${search}%`) }
                ]
            });
        }
        // 3. APPLY SEARCH (Works on top of the filtered result)
        if (search) {
            const keyword = search.toLowerCase();
            result = result.filter((e: Event) =>
                (e.title?.toLowerCase().includes(keyword) ?? false) ||
                (e.location?.toLowerCase().includes(keyword) ?? false)
            );
        }
        // 4. APPLY PAGINATION (Always do this last!)
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 5;

        const startIndex = (pageNum - 1) * limitNum;
        const paginatedData = result.slice(startIndex, startIndex + limitNum);

        // 5. RETURN THE FINAL SHAPE
        return {
            total: result.length,
            page: pageNum,
            limit: limitNum,
            data: paginatedData,
        };
    }
}
