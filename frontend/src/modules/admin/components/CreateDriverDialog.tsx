import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';

const driverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  licenseNumber: z.string().optional(),
  vehicleNumber: z.string().optional(),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface CreateDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateDriverDialog: React.FC<CreateDriverDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: '',
      phone: '',
      licenseNumber: '',
      vehicleNumber: '',
    },
  });

  const createDriverMutation = useMutation({
    mutationFn: async (data: DriverFormData) => {
      // Mock implementation - in production this would call the API
      const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;
      
      if (USE_MOCK) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In mock mode, we'll just return success
        // Status is automatically set to ACTIVE when driver is created
        return {
          id: `driver-${Date.now()}`,
          tenantId: 'tenant-1',
          ...data,
          status: 'ACTIVE', // Automatically set to ACTIVE
        };
      }
      
      const response = await api.post('/admin/drivers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver created successfully');
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create driver');
    },
  });

  const onSubmit = (data: DriverFormData) => {
    createDriverMutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>
            Enter the driver's details to add them to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter driver's full name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* License Number */}
            <div className="grid gap-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="Enter license number (optional)"
                {...register('licenseNumber')}
              />
              {errors.licenseNumber && (
                <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>
              )}
            </div>

            {/* Vehicle Number */}
            <div className="grid gap-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                placeholder="Enter vehicle number (optional)"
                {...register('vehicleNumber')}
              />
              {errors.vehicleNumber && (
                <p className="text-sm text-destructive">{errors.vehicleNumber.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createDriverMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createDriverMutation.isPending}>
              {createDriverMutation.isPending ? 'Creating...' : 'Create Driver'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
