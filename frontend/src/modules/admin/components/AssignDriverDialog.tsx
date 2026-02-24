import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, AlertTriangle } from 'lucide-react';
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
import { routesService } from '@/services/routes.service';
import { adminService } from '@/services/admin.service';
import { AssignDriverRequest, RouteDriverAssignment } from '@/types';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Zod validation schema
const assignDriverSchema = z.object({
  driverId: z.string().min(1, 'Driver selection is required'),
});

type AssignDriverFormData = z.infer<typeof assignDriverSchema>;

interface AssignDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
  currentDriver?: RouteDriverAssignment;
}

export const AssignDriverDialog: React.FC<AssignDriverDialogProps> = ({
  open,
  onOpenChange,
  routeId,
  currentDriver,
}) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AssignDriverFormData>({
    resolver: zodResolver(assignDriverSchema),
    defaultValues: {
      driverId: '',
    },
  });

  const driverIdValue = watch('driverId');

  // Fetch available drivers
  const {
    data: drivers,
    isLoading: isLoadingDrivers,
    error: driversError,
  } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => adminService.fetchDrivers(),
    enabled: open,
  });

  // Assign driver mutation
  const assignDriverMutation = useMutation({
    mutationFn: (data: AssignDriverRequest) =>
      routesService.assignDriver(routeId, data),
    onSuccess: () => {
      // Invalidate and refetch route data
      queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      queryClient.invalidateQueries({ queryKey: ['route-drivers', routeId] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });

      // Show success toast
      const message = currentDriver
        ? 'Driver reassigned successfully'
        : 'Driver assigned successfully';
      toast.success(message);

      // Reset form and close dialog
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      // Show error toast
      const errorMessage =
        error?.response?.data?.message || 'Failed to assign driver';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: AssignDriverFormData) => {
    assignDriverMutation.mutate(data);
  };

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  // Check if selected driver is the current driver
  const isCurrentDriver = currentDriver && driverIdValue === currentDriver.driverId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentDriver ? 'Reassign Driver' : 'Assign Driver'}
          </DialogTitle>
          <DialogDescription>
            {currentDriver
              ? 'Select a new driver for this route. The current driver assignment will be ended.'
              : 'Select a driver to assign to this route.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Driver Warning */}
          {currentDriver && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Driver:</strong> {currentDriver.driver?.name || 'Unknown'}
                <br />
                Assigning a new driver will end the current assignment.
              </AlertDescription>
            </Alert>
          )}

          {/* Driver Selection Field */}
          <div className="space-y-2">
            <Label htmlFor="driver">
              Select Driver <span className="text-destructive">*</span>
            </Label>
            {isLoadingDrivers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : driversError ? (
              <div className="text-sm text-destructive">
                Failed to load drivers. Please try again.
              </div>
            ) : (
              <>
                <Select
                  value={driverIdValue}
                  onValueChange={(value) => setValue('driverId', value)}
                  disabled={assignDriverMutation.isPending}
                >
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers && drivers.length > 0 ? (
                      drivers
                        .filter((driver) => driver.status === 'ACTIVE')
                        .map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            <div className="flex flex-col">
                              <span>{driver.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {driver.phone}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="no-drivers" disabled>
                        No active drivers available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.driverId && (
                  <p className="text-sm text-destructive">
                    {errors.driverId.message}
                  </p>
                )}
                {isCurrentDriver && (
                  <p className="text-sm text-muted-foreground">
                    This driver is already assigned to this route.
                  </p>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={assignDriverMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                assignDriverMutation.isPending ||
                isLoadingDrivers ||
                !!driversError ||
                isCurrentDriver
              }
            >
              {assignDriverMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {currentDriver ? 'Reassign Driver' : 'Assign Driver'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
