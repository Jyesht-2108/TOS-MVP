import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Syllabus() {
  const subjects = [
    { id: '1', name: 'Mathematics', chapters: 12, completed: 8, progress: 67 },
    { id: '2', name: 'Science', chapters: 15, completed: 10, progress: 67 },
    { id: '3', name: 'English', chapters: 10, completed: 7, progress: 70 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Syllabus</h1>

      <div className="grid gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle>{subject.name}</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-semibold">{subject.completed}/{subject.chapters} chapters</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
