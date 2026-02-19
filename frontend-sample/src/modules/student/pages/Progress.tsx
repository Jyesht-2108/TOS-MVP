import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award } from 'lucide-react';

export default function Progress() {
  const subjects = [
    { name: 'Mathematics', marks: 85, grade: 'A', rank: 5 },
    { name: 'Science', marks: 92, grade: 'A+', rank: 2 },
    { name: 'English', marks: 78, grade: 'B+', rank: 12 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Academic Progress</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Overall Percentage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
            <p className="text-sm text-muted-foreground">+5% from last term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Class Rank</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5th</div>
            <p className="text-sm text-muted-foreground">Out of 35 students</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">Rank: {subject.rank}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{subject.marks}%</div>
                  <div className="text-sm text-muted-foreground">Grade: {subject.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
