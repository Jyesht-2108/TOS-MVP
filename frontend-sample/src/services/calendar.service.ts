import { CalendarEvent } from '@/components/calendar/EventCalendar';

// Mock data - will be replaced with actual API calls
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mathematics Unit Test',
    description: 'Unit test covering chapters 1-3',
    startDate: new Date(2026, 1, 25, 10, 0),
    endDate: new Date(2026, 1, 25, 11, 30),
    type: 'test',
    location: 'Room 101',
    attendees: ['Class 10-A'],
    createdBy: 'Mr. John Smith',
  },
  {
    id: '2',
    title: 'Science Mid-Term Exam',
    description: 'Mid-term examination for all science subjects',
    startDate: new Date(2026, 1, 27, 9, 0),
    endDate: new Date(2026, 1, 27, 12, 0),
    type: 'exam',
    location: 'Main Hall',
    attendees: ['Class 10-A', 'Class 10-B'],
    createdBy: 'Ms. Sarah Johnson',
  },
  {
    id: '3',
    title: 'Parent-Teacher Meeting',
    description: 'Quarterly parent-teacher meeting to discuss student progress',
    startDate: new Date(2026, 1, 28, 14, 0),
    endDate: new Date(2026, 1, 28, 17, 0),
    type: 'meeting',
    location: 'Conference Room',
    attendees: ['All Parents', 'All Teachers'],
    createdBy: 'Principal',
  },
  {
    id: '4',
    title: 'Annual Sports Day',
    description: 'Annual sports day celebration with various competitions',
    startDate: new Date(2026, 2, 5, 8, 0),
    endDate: new Date(2026, 2, 5, 16, 0),
    type: 'event',
    location: 'Sports Ground',
    attendees: ['All Students', 'All Staff'],
    createdBy: 'Sports Department',
  },
  {
    id: '5',
    title: 'English Essay Assignment Due',
    description: 'Submit essay on "The Impact of Technology on Education"',
    startDate: new Date(2026, 2, 1, 23, 59),
    type: 'assignment',
    attendees: ['Class 10-A'],
    createdBy: 'Mr. David Brown',
  },
  {
    id: '6',
    title: 'Spring Break',
    description: 'School closed for spring break',
    startDate: new Date(2026, 2, 15),
    endDate: new Date(2026, 2, 22),
    type: 'holiday',
    createdBy: 'Administration',
  },
];

class CalendarService {
  async getEvents(): Promise<CalendarEvent[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 500);
    });
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const events = await this.getEvents();
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  async getEventById(id: string): Promise<CalendarEvent | null> {
    const events = await this.getEvents();
    return events.find(event => event.id === id) || null;
  }

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent = {
          ...event,
          id: Math.random().toString(36).substr(2, 9),
        };
        mockEvents.push(newEvent);
        resolve(newEvent);
      }, 500);
    });
  }

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockEvents.findIndex(event => event.id === id);
        if (index === -1) {
          reject(new Error('Event not found'));
          return;
        }
        mockEvents[index] = { ...mockEvents[index], ...updates };
        resolve(mockEvents[index]);
      }, 500);
    });
  }

  async deleteEvent(id: string): Promise<void> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockEvents.findIndex(event => event.id === id);
        if (index === -1) {
          reject(new Error('Event not found'));
          return;
        }
        mockEvents.splice(index, 1);
        resolve();
      }, 500);
    });
  }
}

export const calendarService = new CalendarService();
