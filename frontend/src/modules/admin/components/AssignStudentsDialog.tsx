import React, { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { routesService } from '@/services/routes.service';
import { adminService } from '@/services/admin.service';
import { AssignStudentsRequest, RouteStudent } from '@/types';
import { toast } from 'sonner';

interface AssignStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
}

export const AssignStudentsDialog: React.FC<AssignStudentsDialogProps> = ({
  open,
  onOpenChange,
  routeId,
}) => {
  const queryClient = useQueryClient();
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all available students
  const {
    data: allStudents,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => adminService.fetchStudents(),
    enabled: open,
  });

  // Fetch currently assigned students
  const {
    data: assignedStudents,
    isLoading: isLoadingAssigned,
  } = useQuery<RouteStudent[]>({
    queryKey: ['route-students', routeId],
    queryFn: () => routesService.fetchRouteStudents(routeId),
    enabled: open,
  });

  // Initialize selected students when data loads
  React.useEffect(() => {
    if (assignedStudents && open) {
      const assignedIds = new Set(assignedStudents.map(rs => rs.studentId));
      setSelectedStudentIds(assignedIds);
    }
  }, [assignedStudents, open]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!allStudents) return [];
    
    if (!searchQuery.trim()) {
      return allStudents;
    }

    const query = searchQuery.toLowerCase();
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(query)
    );
  }, [allStudents, searchQuery]);

  // Assign students mutation
  const assignStudentsMutation = useMutation({
    mutationFn: (data: AssignStudentsRequest) =>
      routesService.assignStudents(routeId, data),
    onSuccess: () => {
      // Invalidate and refetch route data
      queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      queryClient.invalidateQueries({ queryKey: ['route-students', routeId] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });

      // Show success toast
      toast.success('Students assigned successfully');

      // Reset and close dialog
      handleClose();
    },
    onError: (error: any) => {
      // Show error toast
      const errorMessage =
        error?.response?.data?.message || 'Failed to assign students';
      toast.error(errorMessage);
    },
  });

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    const studentIds = Array.from(selectedStudentIds);
    assignStudentsMutation.mutate({ studentIds });
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedStudentIds(new Set());
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    } else {
      onOpenChange(newOpen);
    }
  };

  const isLoading = isLoadingStudents || isLoadingAssigned;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Students</DialogTitle>
          <DialogDescription>
            Select students to assign to this route. Students can be assigned to multiple routes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={assignStudentsMutation.isPending || isLoading}
            />
          </div>

          {/* Students List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : studentsError ? (
            <div className="text-sm text-destructive text-center py-8">
              Failed to load students. Please try again.
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              {searchQuery ? 'No students found matching your search.' : 'No students available.'}
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-3">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudentIds.has(student.id);
                  const isInactive = student.status === 'INACTIVE';
                  
                  return (
                    <div
                      key={student.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        isInactive
                          ? 'bg-muted/50 opacity-60'
                          : isSelected
                          ? 'bg-primary/5 border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleStudent(student.id)}
                        disabled={assignStudentsMutation.isPending || isInactive}
                      />
                      <Label
                        htmlFor={`student-${student.id}`}
                        className={`flex-1 cursor-pointer ${
                          isInactive ? 'text-muted-foreground' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{student.name}</span>
                          {isInactive && (
                            <span className="text-xs text-muted-foreground ml-2">
                              (Inactive)
                            </span>
                          )}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Selection Summary */}
          {!isLoading && filteredStudents.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedStudentIds.size} student{selectedStudentIds.size !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={assignStudentsMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              assignStudentsMutation.isPending ||
              isLoading ||
              !!studentsError ||
              selectedStudentIds.size === 0
            }
          >
            {assignStudentsMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Assign Students
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
