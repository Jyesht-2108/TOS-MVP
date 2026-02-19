import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ApplicationDetail() {
  const { id } = useParams();

  const application = {
    id: 'APP-001',
    studentName: 'John Doe',
    dob: '2015-05-15',
    grade: '10',
    parentName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+91 9876543210',
    status: 'pending',
    submittedDate: '2026-02-10',
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Application Details</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Application {application.id}</CardTitle>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {application.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Student Name</label>
              <p className="text-lg">{application.studentName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <p className="text-lg">{application.dob}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Grade</label>
              <p className="text-lg">Grade {application.grade}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Parent Name</label>
              <p className="text-lg">{application.parentName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{application.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-lg">{application.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
