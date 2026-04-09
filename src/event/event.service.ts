// src/event/event.service.ts

import { Injectable } from '@nestjs/common';
import { Event } from './event.entity';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { FilterType } from './event.enum';

@Injectable()
export class EventService {
    private events: Event[] = [];
    /**   * Creates a new event and adds it to the in-memory list.
       * @param data - The event data to create.
       * @returns The newly created event.
       * @throws BadRequestException if the event title is missing.
    */
    private idCounter = 1;
    createEvent(data: Event) {
        if (!data.title) {
            throw new BadRequestException('Event title is required');
        }
        const newEvent = {
            ...data,
            id: this.idCounter++,
        };
        this.events.push(newEvent);
        return newEvent;
    }
    /**
     * Retrieves an event by its ID.
     * @param id 
     * @returns The event with the specified ID, or throws an error if not found.
     */
    getEventById(id: number) {
        const event = this.events.find((e) => e.id === id);
        if (!event) {
            throw new NotFoundException(`Event with id ${id} not found`);
        }
        console.log("Requested ID:", id);
        console.log("All events:", this.events);
        return event;
    }
    /**
     * Deletes an event by its ID.
     * @param id 
     * @returns A confirmation message.
     */
    deleteEvent(id: number) {
        const index = this.events.findIndex(e => e.id === id);

        if (index === -1) {
            throw new NotFoundException(`Event with id ${id} not found`);
        }

        this.events.splice(index, 1);

        return { message: 'Event deleted' };
    }
    /**
     * Updates an existing event by its ID.
     * @param id 
     * @param data 
     * @returns The updated event.
     */
    updateEvent(id: number, data: Partial<Event>) {
        const event = this.events.find(e => e.id === id);

        if (!event) {
            throw new NotFoundException(`Event with id ${id} not found`);
        }

        if (data.title !== undefined && data.title.trim() === '') {
            throw new BadRequestException('Title cannot be empty');
        }

        Object.assign(event, data);
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

    getEvents(filter?: string, page?: string, limit?: string, search?: string) {
        // 1. Start with a copy of all events
        let result = [...this.events];
        const now = new Date();

        // 2. APPLY FILTERS (Modify the 'result' array, don't return yet!)
        if (filter === FilterType.TODAY) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            result = result.filter(event => {
                if (!event.date) return false;
                const eventDate = new Date(event.date);
                return eventDate >= startOfDay && eventDate <= endOfDay;
            });
        }

        if (filter === FilterType.WEEK) {
            const start = new Date();
            start.setDate(now.getDate() - 7);
            start.setHours(0, 0, 0, 0);

            result = result.filter(event => {
                if (!event.date) return false;
                const eventDate = new Date(event.date);
                return eventDate >= start && eventDate <= now;
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
