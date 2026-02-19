import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const schedule = {
  Monday: [
    { time: '09:00 - 10:00', class: '10-A', subject: 'Mathematics', room: 'Room 201' },
    { time: '11:00 - 12:00', class: '9-B', subject: 'Mathematics', room: 'Room 105' },
    { time: '02:00 - 03:00', class: '10-B', subject: 'Mathematics', room: 'Room 201' },
  ],
  Tuesday: [
    { time: '09:00 - 10:00', class: '10-B', subject: 'Mathematics', room: 'Room 201' },
    { time: '10:00 - 11:00', class: '9-A', subject: 'Mathematics', room: 'Room 105' },
    { time: '01:00 - 02:00', class: '10-A', subject: 'Mathematics', room: 'Room 201' },
  ],
  Wednesday: [
    { time: '09:00 - 10:00', class: '10-A', subject: 'Mathematics', room: 'Room 201' },
    { time: '11:00 - 12:00', class: '9-B', subject: 'Mathematics', room: 'Room 105' },
  ],
  Thursday: [
    { time: '10:00 - 11:00', class: '10-B', subject: 'Mathematics', room: 'Room 201' },
    { time: '02:00 - 03:00', class: '9-A', subject: 'Mathematics', room: 'Room 105' },
    { time: '03:00 - 04:00', class: '10-A', subject: 'Mathematics', room: 'Room 201' },
  ],
  Friday: [
    { time: '09:00 - 10:00', class: '10-A', subject: 'Mathematics', room: 'Room 201' },
    { time: '11:00 - 12:00', class: '10-B', subject: 'Mathematics', room: 'Room 201' },
    { time: '01:00 - 02:00', class: '9-B', subject: 'Mathematics', room: 'Room 105' },
  ],
  Saturday: [
    { time: '09:00 - 10:00', class: '9-A', subject: 'Mathematics', room: 'Room 105' },
    { time: '10:00 - 11:00', class: '10-B', subject: 'Mathematics', room: 'Room 201' },
  ],
};

export default function Schedule() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">My Schedule</h1>
          <p className="text-lg text-muted-foreground mt-2">Weekly class timetable</p>
        </div>
        <Button className="h-11 text-base">
          <Calendar className="mr-2 h-5 w-5" />
          Export Schedule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Total Classes</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-sm text-muted-foreground mt-1">Per week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Teaching Hours</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18 hrs</div>
            <p className="text-sm text-muted-foreground mt-1">Per week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Classes Today</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground mt-1">Monday schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <div className="grid gap-6">
        {weekDays.map((day) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {day}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedule[day as keyof typeof schedule].length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {schedule[day as keyof typeof schedule].map((slot, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-base">{slot.time}</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{slot.subject}</h4>
                      <p className="text-sm text-muted-foreground mb-1">Class {slot.class}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{slot.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-base">No classes scheduled</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
