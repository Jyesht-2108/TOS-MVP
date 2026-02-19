import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Award, Clock, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const upcomingTests = [
  { id: '1', subject: 'Mathematics', type: 'Unit Test', date: '2026-02-25', time: '09:00 AM', duration: '1 hour', chapters: 'Chapters 1-3', maxMarks: 50 },
  { id: '2', subject: 'Science', type: 'Mid-Term', date: '2026-02-27', time: '10:00 AM', duration: '2 hours', chapters: 'Full Syllabus', maxMarks: 100 },
  { id: '3', subject: 'English', type: 'Unit Test', date: '2026-03-01', time: '11:00 AM', duration: '1 hour', chapters: 'Chapters 4-6', maxMarks: 50 },
];

const completedTests = [
  { id: '1', subject: 'Mathematics', type: 'Unit Test 1', date: '2026-02-10', marks: 95, maxMarks: 100, grade: 'A+', rank: 3, average: 82 },
  { id: '2', subject: 'Science', type: 'Unit Test 1', date: '2026-02-12', marks: 88, maxMarks: 100, grade: 'A', rank: 8, average: 78 },
  { id: '3', subject: 'English', type: 'Unit Test 1', date: '2026-02-14', marks: 92, maxMarks: 100, grade: 'A+', rank: 5, average: 80 },
  { id: '4', subject: 'History', type: 'Unit Test 1', date: '2026-02-15', marks: 85, maxMarks: 100, grade: 'A', rank: 10, average: 75 },
];

export default function Tests() {
  const [filterType, setFilterType] = useState('all');

  const avgMarks = completedTests.reduce((sum, test) => sum + (test.marks / test.maxMarks) * 100, 0) / completedTests.length;
  const totalTests = completedTests.length;
  const upcomingCount = upcomingTests.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Tests & Exams</h1>
        <p className="text-lg text-muted-foreground mt-2">View upcoming tests and past results</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Upcoming Tests</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{upcomingCount}</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Completed</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTests}</div>
            <p className="text-sm text-muted-foreground mt-1">Tests taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Average Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{avgMarks.toFixed(1)}%</div>
            <p className="text-sm text-muted-foreground mt-1">Overall</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Best Rank</CardTitle>
            <Award className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">#3</div>
            <p className="text-sm text-muted-foreground mt-1">In Mathematics</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle className="text-xl">Upcoming Tests</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTests.map((test) => (
              <Card key={test.id} className="border-orange-200 bg-orange-50/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <FileText className="h-7 w-7 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{test.subject}</h3>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                            {test.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{test.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{test.time} ({test.duration})</span>
                          </div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Syllabus: {test.chapters}</p>
                          <p className="text-sm text-muted-foreground">Max Marks: {test.maxMarks}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <CardTitle className="text-xl">Past Results</CardTitle>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px] h-11 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                <SelectItem value="unit">Unit Tests</SelectItem>
                <SelectItem value="midterm">Mid-Term</SelectItem>
                <SelectItem value="final">Final Exams</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedTests.map((test) => (
              <Card key={test.id} className="border-green-200 bg-green-50/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                        <Award className="h-7 w-7 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{test.subject}</h3>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {test.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4" />
                          <span>{test.date}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Your Score</p>
                            <p className="text-2xl font-bold text-green-600">{test.marks}/{test.maxMarks}</p>
                          </div>
                          <div className="bg-white/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Grade</p>
                            <p className="text-2xl font-bold text-blue-600">{test.grade}</p>
                          </div>
                          <div className="bg-white/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Class Rank</p>
                            <p className="text-2xl font-bold text-purple-600">#{test.rank}</p>
                          </div>
                          <div className="bg-white/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Class Average</p>
                            <p className="text-2xl font-bold text-orange-600">{test.average}%</p>
                          </div>
                        </div>
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
