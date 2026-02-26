import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Route as RouteIcon,
  Calendar,
  UserCircle,
  BookOpen,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AnimatedPage } from '@/components/AnimatedPage';
import { adminService } from '@/services/admin.service';
import { Student, StudentAttendanceSummary, AttendanceStatus } from '@/types';
import { format } from 'date-fns';

export const StudentDetails: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  // Fetch all students to find the specific one
  const {
    data: students,
    isLoading: isLoadingStudent,
    error: studentError,
  } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: () => adminService.fetchStudents(),
    enabled: !!studentId,
  });

  const student = students?.find(s => s.id === studentId);

  // Fetch student attendance
  const {
    data: attendance,
    isLoading: isLoadingAttendance,
  } = useQuery<StudentAttendanceSummary>({
    queryKey: ['studentAttendance', studentId],
    queryFn: () => adminService.fetchStudentAttendance(studentId!),
    enabled: !!studentId && !!student?.routeId,
  });

  const getStatusBadgeVariant = (status: string): "default" | "secondary" => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

  const getAttendanceStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Present
          </Badge>
        );
      case 'ABSENT':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Absent
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  if (studentError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/students')} className="touch-target">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-sm text-destructive">
                Failed to load student details. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoadingStudent && !student) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/students')} className="touch-target">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                Student not found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/students')} className="touch-target">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {isLoadingStudent ? (
                  <Skeleton className="h-9 w-64" />
                ) : (
                  student?.name
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Student details and transport information
              </p>
            </div>
          </div>
        </motion.div>

        {/* Student Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Personal and academic details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStudent ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : student ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Full Name
                  </p>
                  <p className="text-lg font-semibold">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Grade & Section
                  </p>
                  <p className="text-lg font-semibold">
                    {student.grade && student.section ? (
                      `Grade ${student.grade}-${student.section}`
                    ) : (
                      <span className="text-muted-foreground italic text-base">Not set</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Status
                  </p>
                  <Badge variant={getStatusBadgeVariant(student.status)} className="text-sm">
                    {student.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Parent Name
                  </p>
                  <p className="text-lg font-semibold">
                    {student.parentName || (
                      <span className="text-muted-foreground italic text-base">Not set</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Student ID
                  </p>
                  <p className="text-sm font-mono text-muted-foreground">{student.id}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Transport Assignment Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RouteIcon className="h-5 w-5" />
              Transport Assignment
            </CardTitle>
            <CardDescription>
              Current route assignment for this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStudent ? (
              <Skeleton className="h-20 w-full" />
            ) : student?.routeId && student?.routeName ? (
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/admin/routes/${student.routeId}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <RouteIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{student.routeName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assigned to this route
                    </p>
                    <p className="text-xs text-primary mt-1">Click to view route details</p>
                  </div>
                  <Badge variant="default">
                    Assigned
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Route Assigned</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This student is not currently assigned to any transport route
                </p>
                <Button onClick={() => navigate('/admin/routes')} className="touch-target">
                  <RouteIcon className="mr-2 h-4 w-4" />
                  View All Routes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance Summary
            </CardTitle>
            <CardDescription>
              Transport attendance record for this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!student?.routeId ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Student must be assigned to a route to track attendance.
                </p>
              </div>
            ) : isLoadingAttendance ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : attendance ? (
              <div className="space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                    </div>
                    <p className="text-2xl font-bold">{attendance.totalTrips}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-medium text-muted-foreground">Present</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{attendance.presentCount}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm font-medium text-muted-foreground">Absent</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{attendance.absentCount}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-muted-foreground">Attendance %</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{attendance.attendancePercentage}%</p>
                  </div>
                </div>

                {/* Recent Records */}
                {attendance.recentRecords.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Recent Attendance Records</h3>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[120px]">Date</TableHead>
                            <TableHead className="min-w-[100px]">Trip Type</TableHead>
                            <TableHead className="min-w-[180px]">Route</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[140px]">Marked At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendance.recentRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(new Date(record.tripDate), 'MMM dd, yyyy')}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={record.tripType === 'PICKUP' ? 'default' : 'secondary'}>
                                  {record.tripType === 'PICKUP' ? 'Pickup' : 'Drop'}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{record.routeName}</TableCell>
                              <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                              <TableCell>
                                {record.markedAt ? (
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(record.markedAt), 'hh:mm a')}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground italic">Not marked</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No attendance records found for this student.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No attendance data available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};
