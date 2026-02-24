import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { TripAttendance } from '@/types';
import { auditLogService } from '@/services/auditLog.service';

interface CorrectAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  attendance: TripAttendance;
}

export const CorrectAttendanceDialog: React.FC<CorrectAttendanceDialogProps> = ({
  open,
  onOpenChange,
  tripId,
  attendance,
}) => {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<'PRESENT' | 'ABSENT' | 'PENDING'>(attendance.status);
  const [reason, setReason] = useState('');

  const correctAttendanceMutation = useMutation({
    mutationFn: async (data: { status: 'PRESENT' | 'ABSENT' | 'PENDING'; reason: string }) => {
      // Call audit log service which captures:
      // - Who edited (from auth context)
      // - When (timestamp)
      // - Old value (current attendance.status)
      // - New value (data.status)
      // - Reason (data.reason - mandatory)
      return await auditLogService.correctAttendance(
        tripId,
        attendance.studentId,
        {
          studentId: attendance.studentId,
          newStatus: data.status,
          reason: data.reason,
        },
        attendance.status, // Old value
        attendance.studentName
      );
    },
    onSuccess: (auditLog) => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs', tripId] });
      toast.success('Attendance corrected successfully', {
        description: `Audit log entry #${auditLog.id} created`,
      });
      onOpenChange(false);
      setReason('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to correct attendance');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast.error('Please provide a reason for the correction');
      return;
    }

    if (newStatus === attendance.status) {
      toast.error('Please select a different status');
      return;
    }

    correctAttendanceMutation.mutate({
      status: newStatus,
      reason: reason.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Correct Attendance</DialogTitle>
            <DialogDescription>
              Update attendance status for {attendance.studentName}. This action will be logged in the audit trail.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Status */}
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div className="p-3 bg-muted rounded-md">
                <span className="font-medium capitalize">{attendance.status.toLowerCase()}</span>
              </div>
            </div>

            {/* New Status */}
            <div className="space-y-2">
              <Label htmlFor="status">New Status *</Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as 'PRESENT' | 'ABSENT' | 'PENDING')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENT">Present</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Correction *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this attendance is being corrected..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                This reason will be recorded in the audit trail
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={correctAttendanceMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={correctAttendanceMutation.isPending}
            >
              {correctAttendanceMutation.isPending ? 'Correcting...' : 'Correct Attendance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
