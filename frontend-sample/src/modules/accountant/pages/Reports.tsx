import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, DollarSign, FileText, Calendar } from 'lucide-react';
import { useState } from 'react';

const monthlyRevenue = [
  { month: 'Jan', collected: 450000, pending: 50000, total: 500000 },
  { month: 'Feb', collected: 480000, pending: 45000, total: 525000 },
  { month: 'Mar', collected: 520000, pending: 40000, total: 560000 },
  { month: 'Apr', collected: 490000, pending: 55000, total: 545000 },
  { month: 'May', collected: 550000, pending: 35000, total: 585000 },
  { month: 'Jun', collected: 580000, pending: 30000, total: 610000 },
];

const paymentMethods = [
  { name: 'UPI', value: 45, color: '#3b82f6' },
  { name: 'Card', value: 30, color: '#8b5cf6' },
  { name: 'Cash', value: 15, color: '#10b981' },
  { name: 'Bank Transfer', value: 10, color: '#f59e0b' },
];

const feeCategories = [
  { category: 'Tuition', amount: 3200000 },
  { category: 'Transport', amount: 850000 },
  { category: 'Library', amount: 120000 },
  { category: 'Sports', amount: 180000 },
  { category: 'Lab', amount: 250000 },
];

const collectionTrend = [
  { week: 'Week 1', collected: 145000 },
  { week: 'Week 2', collected: 152000 },
  { week: 'Week 3', collected: 138000 },
  { week: 'Week 4', collected: 165000 },
];

export default function Reports() {
  const [reportType, setReportType] = useState('monthly');
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Financial Reports</h1>
          <p className="text-lg text-muted-foreground mt-2">Comprehensive financial analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] h-11 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-11 text-base">
            <Download className="mr-2 h-5 w-5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹32.5L</div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+15%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Collected</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹30.7L</div>
            <p className="text-sm text-muted-foreground mt-1">94.5% collection rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Pending</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">₹1.8L</div>
            <p className="text-sm text-muted-foreground mt-1">From 45 students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Avg per Student</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹26,350</div>
            <p className="text-sm text-muted-foreground mt-1">Per academic year</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Monthly Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" name="Collected" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Payment Methods Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feeCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Weekly Collection Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={collectionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Detailed Monthly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-base font-medium">Month</th>
                  <th className="text-right p-3 text-base font-medium">Total Due</th>
                  <th className="text-right p-3 text-base font-medium">Collected</th>
                  <th className="text-right p-3 text-base font-medium">Pending</th>
                  <th className="text-right p-3 text-base font-medium">Collection %</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRevenue.map((row) => (
                  <tr key={row.month} className="border-b hover:bg-accent/50">
                    <td className="p-3 text-base">{row.month}</td>
                    <td className="text-right p-3 text-base">₹{(row.total / 1000).toFixed(0)}K</td>
                    <td className="text-right p-3 text-base text-green-600">₹{(row.collected / 1000).toFixed(0)}K</td>
                    <td className="text-right p-3 text-base text-orange-600">₹{(row.pending / 1000).toFixed(0)}K</td>
                    <td className="text-right p-3 text-base font-semibold">
                      {((row.collected / row.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
