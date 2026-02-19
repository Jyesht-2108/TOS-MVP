import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: 'test' | 'exam' | 'holiday' | 'meeting' | 'event' | 'assignment';
  location?: string;
  attendees?: string[];
  createdBy?: string;
  color?: string;
}

interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const eventColors = {
  test: 'bg-blue-500',
  exam: 'bg-red-500',
  holiday: 'bg-green-500',
  meeting: 'bg-purple-500',
  event: 'bg-orange-500',
  assignment: 'bg-yellow-500',
};

const eventTextColors = {
  test: 'text-blue-700',
  exam: 'text-red-700',
  holiday: 'text-green-700',
  meeting: 'text-purple-700',
  event: 'text-orange-700',
  assignment: 'text-yellow-700',
};

const eventBgColors = {
  test: 'bg-blue-50',
  exam: 'bg-red-50',
  holiday: 'bg-green-50',
  meeting: 'bg-purple-50',
  event: 'bg-orange-50',
  assignment: 'bg-yellow-50',
};

export function EventCalendar({ events = [], onEventClick, className }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  return (
    <>
      <Card className={cn('shadow-sm', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Event Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={view === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('month')}
                  className="h-7 px-3"
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                  className="h-7 px-3"
                >
                  Week
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('day')}
                  className="h-7 px-3"
                >
                  Day
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">
                {monthNames[month]} {year}
              </h2>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              const date = day ? new Date(year, month, day) : null;
              const dayEvents = date ? getEventsForDate(date) : [];
              const today = isToday(day);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={cn(
                    'min-h-24 border rounded-lg p-2 transition-all',
                    day ? 'bg-white hover:bg-accent/50 cursor-pointer' : 'bg-gray-50',
                    today && 'ring-2 ring-primary'
                  )}
                >
                  {day && (
                    <>
                      <div className={cn(
                        'text-sm font-medium mb-1',
                        today ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : ''
                      )}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <motion.div
                            key={event.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleEventClick(event)}
                            className={cn(
                              'text-xs p-1 rounded cursor-pointer truncate',
                              eventBgColors[event.type],
                              eventTextColors[event.type]
                            )}
                          >
                            <div className="flex items-center gap-1">
                              <div className={cn('w-2 h-2 rounded-full', eventColors[event.type])} />
                              <span className="font-medium truncate">{event.title}</span>
                            </div>
                          </motion.div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground pl-1">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4">
            {Object.entries(eventColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', color)} />
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn('w-4 h-4 rounded-full', selectedEvent && eventColors[selectedEvent.type])} />
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.startDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {selectedEvent.endDate && ` - ${new Date(selectedEvent.endDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                  </p>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                </div>
              )}

              {selectedEvent.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.attendees.join(', ')}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Event Type</p>
                    <p className="font-medium capitalize">{selectedEvent.type}</p>
                  </div>
                  {selectedEvent.createdBy && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Created By</p>
                      <p className="font-medium">{selectedEvent.createdBy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
