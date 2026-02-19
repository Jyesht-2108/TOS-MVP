import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreditCard, Download } from 'lucide-react';

export default function Payments() {
  const payments = [
    { id: 'INV-001', description: 'Tuition Fee - Feb 2026', amount: 5000, status: 'paid', date: '2026-02-01' },
    { id: 'INV-002', description: 'Tuition Fee - Mar 2026', amount: 5000, status: 'pending', dueDate: '2026-03-01' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Fee Payments</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹5,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">₹5,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Next Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Mar 1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
                  <TableCell>{payment.date || payment.dueDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'pending' ? (
                      <Button size="sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
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
