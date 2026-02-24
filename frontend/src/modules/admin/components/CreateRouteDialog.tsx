import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { routesService } from '@/services/routes.service';
import { CreateRouteRequest, RouteStatus, RouteResponse } from '@/types';
import { toast } from 'sonner';

// Zod validation schema
const createRouteSchema = z.object({
  name: z.string().min(1, 'Route name is required').max(255, 'Route name is too long'),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    required_error: 'Status is required',
  }),
});

type CreateRouteFormData = z.infer<typeof createRouteSchema>;

interface CreateRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route?: RouteResponse; // Optional route for editing
}

export const CreateRouteDialog: React.FC<CreateRouteDialogProps> = ({
  open,
  onOpenChange,
  route,
}) => {
  const queryClient = useQueryClient();
  const isEditMode = !!route;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateRouteFormData>({
    resolver: zodResolver(createRouteSchema),
    defaultValues: {
      name: route?.name || '',
      status: route?.status || 'ACTIVE',
    },
  });

  // Update form when route changes
  React.useEffect(() => {
    if (route) {
      setValue('name', route.name);
      setValue('status', route.status);
    } else {
      reset();
    }
  }, [route, setValue, reset]);

  const statusValue = watch('status');

  // Create/Update route mutation
  const saveRouteMutation = useMutation({
    mutationFn: (data: CreateRouteFormData) => {
      if (isEditMode && route) {
        return routesService.updateRoute(route.id, data);
      }
      return routesService.createRoute(data);
    },
    onSuccess: () => {
      // Invalidate and refetch routes
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      if (isEditMode && route) {
        queryClient.invalidateQueries({ queryKey: ['route', route.id] });
      }
      
      // Show success toast
      toast.success(isEditMode ? 'Route updated successfully' : 'Route created successfully');
      
      // Reset form and close dialog
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      // Show error toast
      const errorMessage = error?.response?.data?.message || 
        (isEditMode ? 'Failed to update route' : 'Failed to create route');
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: CreateRouteFormData) => {
    saveRouteMutation.mutate(data);
  };

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Route' : 'Create New Route'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the route details below.'
              : 'Add a new transport route to your system. Fill in the route details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Route Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Route Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter route name"
              {...register('name')}
              disabled={saveRouteMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={statusValue}
              onValueChange={(value) => setValue('status', value as RouteStatus)}
              disabled={saveRouteMutation.isPending}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={saveRouteMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saveRouteMutation.isPending}>
              {saveRouteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? 'Update Route' : 'Create Route'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
