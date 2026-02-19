import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Download, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const homeworkData = [
  {
    id: '1',
    date: '2026-02-19',
    subject: 'Mathematics',
    teacher: 'Mr. John Smith',
    title: 'Introduction to Fractions',
    homework: 'Complete exercises 1-10 from Chapter 5. Show all working.',
    attachments: ['worksheet.pdf'],
    status: 'pending',
    dueDate: '2026-02-21'
  },
  {
    id: '2',
    date: '2026-02-19',
    subject: 'Science',
    teacher: 'Ms. Sarah Johnson',
    title: 'States of Matter',
    homework: 'Read Chapter 3 and prepare notes on solid, liquid, and gas properties.',
    attachments: ['chapter3.pdf', 'notes-template.docx'],
    status: 'pending',
    dueDate: '2026-02-22'
  },
  {
    id: '3',
    date: '2026-02-18',
    subject: 'English',
    teacher: 'Mrs. Emily Brown',
    title: 'Essay Writing',
    homework: 'Write a 500-word essay on "My Favorite Book"',
    attachments: [],
    status: 'completed',
    dueDate: '2026-02-20'
  },
  {
    id: '4',
    date: '2026-02-18',
    subject: 'History',
    teacher: 'Mr. David Wilson',
    title: 'Ancient Civilizations',
    homework: 'Create a timeline of major events in Ancient Egypt',
    attachments: ['timeline-template.pdf'],
    status: 'completed',
    dueDate: '2026-02-19'
  },
];

export default function Homework() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  const filteredHomework = homeworkData.filter(hw => {
    const matchesStatus = filterStatus === 'all' || hw.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || hw.subject === filterSubject;
    return matchesStatus && matchesSubject;
  });

  const pendingCount = homeworkData.filter(hw => hw.status === 'pending').length;
  const completedCount = homeworkData.filter(hw => hw.status === 'completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Homework & Diary</h1>
        <p className="text-lg text-muted-foreground mt-2">View assignments and class notes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Total Assignments</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{homeworkData.length}</div>
            <p className="text-sm text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Pending</CardTitle>
            <BookOpen className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-sm text-muted-foreground mt-1">To complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px] h-11 text-base">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[200px] h-11 text-base">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHomework.map((hw) => (
              <Card key={hw.id} className={`${
                hw.status === 'pending' ? 'border-orange-200 bg-orange-50/30' : 'border-green-200 bg-green-50/30'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        hw.status === 'pending' ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {hw.status === 'pending' ? (
                          <BookOpen className="h-6 w-6 text-orange-600" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{hw.subject}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            hw.status === 'pending' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {hw.status === 'pending' ? 'Pending' : 'Completed'}
                          </span>
                        </div>
                        <p className="text-base font-medium text-muted-foreground mb-1">{hw.title}</p>
                        <p className="text-sm text-muted-foreground mb-3">By {hw.teacher}</p>
                        
                        <div className="bg-white/50 p-4 rounded-lg mb-3">
                          <p className="text-base">{hw.homework}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Posted: {hw.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className={hw.status === 'pending' ? 'text-orange-600 font-medium' : ''}>
                              Due: {hw.dueDate}
                            </span>
                          </div>
                        </div>

                        {hw.attachments.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Attachments:</p>
                            <div className="flex flex-wrap gap-2">
                              {hw.attachments.map((file, idx) => (
                                <Button key={idx} variant="outline" size="sm" className="text-sm">
                                  <Download className="mr-2 h-4 w-4" />
                                  {file}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
