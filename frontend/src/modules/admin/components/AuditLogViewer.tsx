import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { History, User, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { auditLogService } from '@/services/auditLog.service';
import { AttendanceAuditLog } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

interface AuditLogViewerProps {
  tripId: string;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ tripId }) => {
  // Fetch audit logs for this trip
  const {
    data: auditLogs,
    isLoading,
    error,
  } = useQuery<AttendanceAuditLog[]>({
    queryKey: ['auditLogs', tripId],
    queryFn: () => auditLogService.getAuditLogs(tripId),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusBadge = (status: 'PRESENT' | 'ABSENT' | 'PENDING') => {
    switch (status) {
      case 'PRESENT':
        return <Badge variant="default" className="bg-green-500">Present</Badge>;
      case 'ABSENT':
        return <Badge variant="destructive">Absent</Badge>;
      case 'PENDING':
        return <Badge variant="default" className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Attendance Audit Log
          </CardTitle>
          <CardDescription>
            History of attendance corrections for this trip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Attendance Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Failed to load audit logs. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Attendance Audit Log
        </CardTitle>
        <CardDescription>
          Complete history of attendance corrections for this trip ({auditLogs?.length || 0} entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!auditLogs || auditLogs.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              No attendance corrections have been made for this trip.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All corrections are automatically logged with who, when, and why.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                {/* Header - Student and Time */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{log.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(log.editedAt), { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Status Change - Old Value → New Value */}
                <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-md">
                  <span className="text-muted-foreground">Status changed:</span>
                  {getStatusBadge(log.oldStatus)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  {getStatusBadge(log.newStatus)}
                </div>

                {/* Reason - Mandatory field */}
                <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-900">
                  <p className="text-sm font-medium mb-1 text-amber-900 dark:text-amber-100">
                    Reason for Correction:
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200">{log.reason}</p>
                </div>

                {/* Footer - Who edited and metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Edited by:</span>
                    <span>{log.editedByName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>ID: {log.id}</span>
                    <span>{format(new Date(log.editedAt), 'MMM dd, yyyy HH:mm:ss')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
