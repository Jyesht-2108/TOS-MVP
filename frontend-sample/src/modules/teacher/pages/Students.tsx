import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Mail, Phone, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

const students = [
  { id: '1', name: 'John Doe', rollNo: '101', class: '10-A', attendance: 95, avgScore: 85, trend: 'up', email: 'john@example.com', phone: '+91 9876543210' },
  { id: '2', name: 'Jane Smith', rollNo: '102', class: '10-A', attendance: 92, avgScore: 92, trend: 'up', email: 'jane@example.com', phone: '+91 9876543211' },
  { id: '3', name: 'Mike Johnson', rollNo: '103', class: '10-A', attendance: 88, avgScore: 78, trend: 'down', email: 'mike@example.com', phone: '+91 9876543212' },
  { id: '4', name: 'Sarah Williams', rollNo: '104', class: '10-A', attendance: 96, avgScore: 88, trend: 'up', email: 'sarah@example.com', phone: '+91 9876543213' },
  { id: '5', name: 'Tom Brown', rollNo: '201', class: '10-B', attendance: 90, avgScore: 82, trend: 'up', email: 'tom@example.com', phone: '+91 9876543214' },
];

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm);
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">My Students</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage and track student performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">180</div>
            <p className="text-sm text-muted-foreground mt-1">Across 5 classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Avg Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">92%</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
            <p className="text-sm text-muted-foreground mt-1">Overall average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <p className="text-sm text-muted-foreground mt-1">Above 90%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[200px] h-11 text-base">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="10-A">Class 10-A</SelectItem>
                <SelectItem value="10-B">Class 10-B</SelectItem>
                <SelectItem value="9-A">Class 9-A</SelectItem>
                <SelectItem value="9-B">Class 9-B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base">Roll No</TableHead>
                <TableHead className="text-base">Name</TableHead>
                <TableHead className="text-base">Class</TableHead>
                <TableHead className="text-base">Attendance</TableHead>
                <TableHead className="text-base">Avg Score</TableHead>
                <TableHead className="text-base">Trend</TableHead>
                <TableHead className="text-base">Contact</TableHead>
                <TableHead className="text-base">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-base">{student.rollNo}</TableCell>
                  <TableCell className="text-base">{student.name}</TableCell>
                  <TableCell className="text-base">{student.class}</TableCell>
                  <TableCell className="text-base">
                    <span className={`font-semibold ${
                      student.attendance >= 90 ? 'text-green-600' :
                      student.attendance >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.attendance}%
                    </span>
                  </TableCell>
                  <TableCell className="text-base">
                    <span className={`font-semibold ${
                      student.avgScore >= 85 ? 'text-green-600' :
                      student.avgScore >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.avgScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {student.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" title={student.email}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={student.phone}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
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
