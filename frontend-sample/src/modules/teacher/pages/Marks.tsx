import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

export default function Marks() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [examType, setExamType] = useState('midterm');

  const students = [
    { id: '1', name: 'John Doe', rollNo: '101', marks: 85, maxMarks: 100 },
    { id: '2', name: 'Jane Smith', rollNo: '102', marks: 92, maxMarks: 100 },
    { id: '3', name: 'Mike Johnson', rollNo: '103', marks: 78, maxMarks: 100 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Enter Marks</h1>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Marks
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10-A">Class 10-A</SelectItem>
                <SelectItem value="10-B">Class 10-B</SelectItem>
                <SelectItem value="9-A">Class 9-A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Mid Term</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="unit">Unit Test</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Marks Obtained</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={student.marks}
                      className="w-20"
                      min="0"
                      max={student.maxMarks}
                    />
                  </TableCell>
                  <TableCell>{student.maxMarks}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      (student.marks / student.maxMarks) * 100 >= 75 ? 'text-green-600' :
                      (student.marks / student.maxMarks) * 100 >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {((student.marks / student.maxMarks) * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
