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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { attendanceService, AttendanceRecord } from '@/services/attendance.service';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface AttendanceOverrideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance: AttendanceRecord | null;
  tripId: string;
}

export const AttendanceOverrideModal: React.FC<AttendanceOverrideModalProps> = ({
  open,
  onOpenChange,
  attendance,
  tripId,
}) => {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<'PRESENT' | 'ABSENT'>(
    attendance?.status || 'PRESENT'
  );
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ reason?: string }>({});

  // Reset form when modal opens/closes or attendance changes
  React.useEffect(() => {
    if (open && attendance) {
      setNewStatus(attendance.status || 'PRESENT');
      setReason('');
      setErrors({});
    }
  }, [open, attendance]);

  const overrideMutation = useMutation({
    mutationFn: async () => {
      if (!attendance) throw new Error('No attendance record selected');
      
      return attendanceService.adminOverrideAttendance(attendance.id, {
        status: newStatus,
        reason: reason.trim(),
      });
    },
    onSuccess: (data) => {
      toast.success('Attendance Updated', {
        description: `${attendance?.studentName}'s attendance has been updated to ${newStatus}`,
      });
      
      // Invalidate and refetch attendance data
      queryClient.invalidateQueries({ queryKey: ['tripAttendance', tripId] });
      queryClient.invalidateQueries({ queryKey: ['activeTrips'] });
      
      // Close modal
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Failed to Update Attendance', {
        description: error.message || 'An error occurred while updating attendance',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate reason
    const newErrors: { reason?: string } = {};
    
    if (!reason.trim()) {
      newErrors.reason = 'Reason is required for attendance override';
    } else if (reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Check if status actually changed
    if (newStatus === attendance?.status) {
      toast.info('No Changes', {
        description: 'The attendance status has not been changed',
      });
      return;
    }
    
    overrideMutation.mutate();
  };

  if (!attendance) return null;

  const currentStatus = attendance.status;
  const isStatusChanged = newStatus !== currentStatus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Override Attendance</DialogTitle>
            <DialogDescription>
              Update attendance status for {attendance.studentName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Current Status Info */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Current Status:</span>
                {currentStatus === 'PRESENT' ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Present
                  </span>
                ) : currentStatus === 'ABSENT' ? (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="h-4 w-4" />
                    Absent
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    Unmarked
                  </span>
                )}
              </div>
              {attendance.markedAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Marked at {new Date(attendance.markedAt).toLocaleString()}
                </p>
              )}
            </div>

            {/* New Status Selection */}
            <div className="space-y-3">
              <Label htmlFor="status" className="text-base font-semibold">
                New Status <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as 'PRESENT' | 'ABSENT')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PRESENT" id="present" />
                  <Label
                    htmlFor="present"
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Present
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ABSENT" id="absent" />
                  <Label
                    htmlFor="absent"
                    className="flex items-center gap-2 cursor-pointer font-normal"
                  >
                    <XCircle className="h-4 w-4 text-red-600" />
                    Absent
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-base font-semibold">
                Reason for Override <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for changing attendance status (minimum 10 characters)"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errors.reason) {
                    setErrors({ ...errors, reason: undefined });
                  }
                }}
                rows={4}
                className={errors.reason ? 'border-destructive' : ''}
              />
              {errors.reason && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.reason}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                This reason will be recorded in the audit log
              </p>
            </div>

            {/* Warning if status changed */}
            {isStatusChanged && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium">Attendance Override</p>
                    <p className="mt-1">
                      You are changing the status from{' '}
                      <span className="font-semibold">{currentStatus || 'Unmarked'}</span> to{' '}
                      <span className="font-semibold">{newStatus}</span>. This action will be
                      logged in the audit trail.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={overrideMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={overrideMutation.isPending || !isStatusChanged}>
              {overrideMutation.isPending ? 'Updating...' : 'Update Attendance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
