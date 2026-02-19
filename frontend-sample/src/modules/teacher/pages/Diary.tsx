import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';

export default function Diary() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [subject, setSubject] = useState('');
  const [homework, setHomework] = useState('');

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Class Diary</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Diary Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10-A">Class 10-A</SelectItem>
              <SelectItem value="10-B">Class 10-B</SelectItem>
              <SelectItem value="9-A">Class 9-A</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            className="w-full min-h-[150px] p-3 border rounded-lg"
            placeholder="Homework and notes..."
            value={homework}
            onChange={(e) => setHomework(e.target.value)}
          />
          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send to Parents
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
