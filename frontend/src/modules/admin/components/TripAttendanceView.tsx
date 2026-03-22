import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Users,
  UserCheck,
  UserX,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedCard } from '@/components/AnimatedCard';
import { attendanceService, AttendanceRecord } from '@/services/attendance.service';
import { AttendanceOverrideModal } from './AttendanceOverrideModal';

interface TripAttendanceViewProps {
  tripId: string;
}

const StatusBadge: React.FC<{ status: 'PRESENT' | 'ABSENT' | null }> = ({ status }) => {
  if (status === 'PRESENT') {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Present
      </Badge>
    );
  }
  
  if (status === 'ABSENT') {
    return (
      <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="mr-1 h-3 w-3" />
        Absent
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
      <AlertCircle className="mr-1 h-3 w-3" />
      Unmarked
    </Badge>
  );
};

const AttendanceStatCard: React.FC<{
  title: string;
  count: number;
  total: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}> = ({ title, count, total, icon, color, delay = 0 }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">/ {total}</p>
              </div>
              <p className="text-xs text-muted-foreground">{percentage}%</p>
            </div>
            <div className={`rounded-full p-3 ${color}`}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const TripAttendanceView: React.FC<TripAttendanceViewProps> = ({ tripId }) => {
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  // Fetch attendance data
  const {
    data: attendanceData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tripAttendance', tripId],
    queryFn: () => attendanceService.fetchTripAttendance(tripId),
    refetchInterval: 10000, // Refetch every 10 seconds for live updates
  });

  const handleEditAttendance = (attendance: AttendanceRecord) => {
    setSelectedAttendance(attendance);
    setIsOverrideModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-semibold">Failed to Load Attendance</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!attendanceData) {
    return null;
  }

  const { totalStudents, presentCount, absentCount, unmarkedCount, attendance = [] } = attendanceData;

  return (
    <div className="space-y-6">
      {/* Attendance Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <AttendanceStatCard
          title="Present"
          count={presentCount}
          total={totalStudents}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          color="bg-green-100"
          delay={0}
        />
        <AttendanceStatCard
          title="Absent"
          count={absentCount}
          total={totalStudents}
          icon={<UserX className="h-6 w-6 text-red-600" />}
          color="bg-red-100"
          delay={0.1}
        />
        <AttendanceStatCard
          title="Unmarked"
          count={unmarkedCount}
          total={totalStudents}
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          color="bg-amber-100"
          delay={0.2}
        />
      </div>

      {/* Student Attendance List */}
      <AnimatedCard delay={0.3} hover={false}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Attendance
              </CardTitle>
              <CardDescription>
                Real-time attendance status for all students on this trip
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {totalStudents} Students
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!attendance || attendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">No Students Assigned</p>
              <p className="text-sm text-muted-foreground mt-2">
                There are no students assigned to this trip
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {attendance.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <p className="font-medium">{record.studentName}</p>
                      {record.markedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Marked at {new Date(record.markedAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                  
                  {/* Edit button - only show for marked students */}
                  {record.status !== null && !record.locked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAttendance(record)}
                      className="ml-2"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  
                  {record.locked && (
                    <Badge variant="secondary" className="ml-2">
                      Locked
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </AnimatedCard>

      {/* Override Modal */}
      <AttendanceOverrideModal
        open={isOverrideModalOpen}
        onOpenChange={setIsOverrideModalOpen}
        attendance={selectedAttendance}
        tripId={tripId}
      />
    </div>
  );
};
