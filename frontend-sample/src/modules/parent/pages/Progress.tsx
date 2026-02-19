import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award, BookOpen, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function Progress() {
  const subjects = [
    { name: 'Mathematics', marks: 85, grade: 'A', trend: 'up', improvement: '+5%' },
    { name: 'Science', marks: 92, grade: 'A+', trend: 'up', improvement: '+8%' },
    { name: 'English', marks: 78, grade: 'B+', trend: 'down', improvement: '-2%' },
    { name: 'History', marks: 88, grade: 'A', trend: 'up', improvement: '+3%' },
    { name: 'Geography', marks: 82, grade: 'A', trend: 'up', improvement: '+6%' },
  ];

  const monthlyProgress = [
    { month: 'Sep', marks: 75 },
    { month: 'Oct', marks: 78 },
    { month: 'Nov', marks: 82 },
    { month: 'Dec', marks: 80 },
    { month: 'Jan', marks: 85 },
    { month: 'Feb', marks: 85 },
  ];

  const subjectComparison = [
    { subject: 'Math', student: 85, classAvg: 75 },
    { subject: 'Science', student: 92, classAvg: 80 },
    { subject: 'English', student: 78, classAvg: 82 },
    { subject: 'History', student: 88, classAvg: 78 },
    { subject: 'Geography', student: 82, classAvg: 76 },
  ];

  const skillsData = [
    { skill: 'Problem Solving', value: 85 },
    { skill: 'Critical Thinking', value: 78 },
    { skill: 'Communication', value: 88 },
    { skill: 'Creativity', value: 82 },
    { skill: 'Teamwork', value: 90 },
  ];

  const gradeDistribution = [
    { name: 'A+', value: 2, color: '#10b981' },
    { name: 'A', value: 3, color: '#3b82f6' },
    { name: 'B+', value: 1, color: '#f59e0b' },
  ];

  const testPerformance = [
    { test: 'Unit Test 1', marks: 82 },
    { test: 'Unit Test 2', marks: 85 },
    { test: 'Mid-Term', marks: 88 },
    { test: 'Unit Test 3', marks: 84 },
    { test: 'Unit Test 4', marks: 90 },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Academic Progress</h1>
        <p className="text-primary-foreground/90 text-lg">
          Comprehensive view of your child's academic performance
        </p>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Average</p>
                <p className="text-3xl font-bold">85%</p>
                <p className="text-xs text-green-600 mt-1">+4% from last month</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Class Rank</p>
                <p className="text-3xl font-bold">#12</p>
                <p className="text-xs text-muted-foreground mt-1">Out of 45 students</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-xl">
                <Award className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subjects</p>
                <p className="text-3xl font-bold">6</p>
                <p className="text-xs text-muted-foreground mt-1">Total enrolled</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Target Achievement</p>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-xs text-green-600 mt-1">Above target</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-xl">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Progress Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="marks" stroke="#3b82f6" strokeWidth={2} name="Average Marks %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student vs Class Average */}
        <Card>
          <CardHeader>
            <CardTitle>Performance vs Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="student" fill="#3b82f6" name="Your Child" />
                <Bar dataKey="classAvg" fill="#94a3b8" name="Class Average" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Skills" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">Grade: {subject.grade}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold">{subject.marks}%</div>
                    <div className={`text-sm flex items-center gap-1 justify-end ${
                      subject.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${subject.trend === 'down' ? 'rotate-180' : ''}`} />
                      {subject.improvement}
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${subject.marks}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Performance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Test Performance Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={testPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="marks" fill="#3b82f6" name="Marks %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
