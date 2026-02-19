import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');

  const payments = [
    { id: 'PAY-001', invoice: 'INV-001', student: 'John Doe', amount: 5000, method: 'UPI', date: '2026-02-15', status: 'success' },
    { id: 'PAY-002', invoice: 'INV-002', student: 'Jane Smith', amount: 5000, method: 'Card', date: '2026-02-14', status: 'success' },
    { id: 'PAY-003', invoice: 'INV-003', student: 'Mike Johnson', amount: 5000, method: 'UPI', date: '2026-02-13', status: 'failed' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Payment History</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹10,000</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹5,000</div>
            <p className="text-sm text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95%</div>
            <p className="text-sm text-muted-foreground">Payment success</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.invoice}</TableCell>
                  <TableCell>{payment.student}</TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{payment.status}</span>
                    </div>
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
