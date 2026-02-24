import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  UserPlus,
  Users,
  Trash2,
  Calendar,
  User,
  MapPin,
  Navigation,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { routesService } from '@/services/routes.service';
import { RouteResponse, RouteStudent, RouteDriverAssignment } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AssignDriverDialog } from '../components/AssignDriverDialog';
import { AssignStudentsDialog } from '../components/AssignStudentsDialog';
import { CreateRouteDialog } from '../components/CreateRouteDialog';

export const RouteDetails: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);
  const [isAssignStudentsDialogOpen, setIsAssignStudentsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch route details
  const {
    data: route,
    isLoading: isLoadingRoute,
    error: routeError,
  } = useQuery<RouteResponse>({
    queryKey: ['route', routeId],
    queryFn: () => routesService.fetchRouteById(routeId!),
    enabled: !!routeId,
  });

  // Fetch route students
  const {
    data: students,
    isLoading: isLoadingStudents,
  } = useQuery<RouteStudent[]>({
    queryKey: ['route-students', routeId],
    queryFn: () => routesService.fetchRouteStudents(routeId!),
    enabled: !!routeId,
  });

  // Fetch driver assignments
  const {
    data: driverAssignments,
    isLoading: isLoadingDrivers,
  } = useQuery<RouteDriverAssignment[]>({
    queryKey: ['route-drivers', routeId],
    queryFn: () => routesService.fetchDriverAssignments(routeId!),
    enabled: !!routeId,
  });

  // Get active driver
  const activeDriver = driverAssignments?.find((assignment) => !assignment.activeTo);

  // Fetch driver activity to check if there's an active trip
  const {
    data: driverActivity,
  } = useQuery({
    queryKey: ['driver-activity', activeDriver?.driverId],
    queryFn: async () => {
      if (!activeDriver?.driverId) return null;
      // Import adminService to fetch driver activity
      const { adminService } = await import('@/services/admin.service');
      const activities = await adminService.fetchDriverActivity();
      return activities.find((activity: import('@/types').DriverActivity) => activity.driverId === activeDriver.driverId);
    },
    enabled: !!activeDriver?.driverId,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Check if driver has an active trip
  const hasActiveTrip = driverActivity?.status === 'ACTIVE' && !!driverActivity?.currentTripId;

  // Remove student mutation
  const removeStudentMutation = useMutation({
    mutationFn: ({ studentId }: { studentId: string }) =>
      routesService.removeStudent(routeId!, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route-students', routeId] });
      queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      toast.success('Student removed from route successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to remove student');
    },
  });

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove "${studentName}" from this route?`
      )
    ) {
      removeStudentMutation.mutate({ studentId });
    }
  };

  const handleTrackLiveRoute = () => {
    if (!hasActiveTrip) {
      toast.error('Cannot track location', {
        description: 'The bus has not left the campus yet. Tracking is only available when the driver has an active trip.',
      });
      return;
    }

    if (driverActivity?.currentTripId) {
      // Navigate to trip details page with live map
      navigate(`/admin/trips/${driverActivity.currentTripId}`);
    }
  };

  const handleAssignDriver = () => {
    setIsAssignDriverDialogOpen(true);
  };

  const handleAssignStudents = () => {
    setIsAssignStudentsDialogOpen(true);
  };

  const handleEditRoute = () => {
    setIsEditDialogOpen(true);
  };

  const getStatusBadgeVariant = (
    status: string
  ): 'default' | 'secondary' => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

  if (routeError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/routes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Routes
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-sm text-destructive">
                Failed to load route details. Please try again later.
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
            <Button variant="ghost" onClick={() => navigate('/admin/routes')} className="touch-target">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {isLoadingRoute ? (
                  <Skeleton className="h-9 w-64" />
                ) : (
                  route?.name
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Route details and assignments
            </p>
          </div>
        </div>
        {route && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleTrackLiveRoute}
              disabled={!hasActiveTrip}
              title={!hasActiveTrip ? 'Tracking is only available when the driver has an active trip' : 'Track live route'}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Track Live Route
              {!hasActiveTrip && <span className="ml-2 text-xs">(No active trip)</span>}
            </Button>
            <Button variant="outline" onClick={handleEditRoute}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Route
            </Button>
          </div>
        )}
      </motion.div>

      {/* Route Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Route Information</CardTitle>
          <CardDescription>Basic details about this route</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRoute ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : route ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Route Name
                </p>
                <p className="text-lg font-semibold">{route.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Status
                </p>
                <Badge variant={getStatusBadgeVariant(route.status)}>
                  {route.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Created Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-semibold">
                    {format(new Date(route.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Assigned Driver Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assigned Driver</CardTitle>
              <CardDescription>
                Current driver assigned to this route
              </CardDescription>
            </div>
            <Button onClick={handleAssignDriver}>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Driver
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingDrivers ? (
            <Skeleton className="h-20 w-full" />
          ) : activeDriver ? (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{activeDriver.driver?.name || 'Unknown Driver'}</p>
                <p className="text-sm text-muted-foreground">
                  Assigned since {format(new Date(activeDriver.activeFrom), 'MMM dd, yyyy')}
                </p>
                {driverActivity && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: <span className={`font-medium ${
                      driverActivity.status === 'ACTIVE' ? 'text-green-600' : 
                      driverActivity.status === 'IDLE' ? 'text-yellow-600' : 
                      'text-gray-600'
                    }`}>
                      {driverActivity.status}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTrackLiveRoute}
                  disabled={!hasActiveTrip}
                  title={!hasActiveTrip ? 'Tracking is only available when the driver has an active trip' : 'Track live location'}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Track Location
                </Button>
                {!hasActiveTrip && (
                  <p className="text-xs text-muted-foreground text-center">
                    No active trip
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No Driver Assigned</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This route doesn't have a driver assigned yet
              </p>
              <Button onClick={handleAssignDriver}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Driver
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assigned Students</CardTitle>
              <CardDescription>
                Students currently assigned to this route
              </CardDescription>
            </div>
            <Button onClick={handleAssignStudents}>
              <Users className="mr-2 h-4 w-4" />
              Assign Students
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingStudents ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : students && students.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Attendance</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((routeStudent) => {
                    const attendancePresent = routeStudent.attendancePresent ?? 0;
                    const attendanceTotal = routeStudent.attendanceTotal ?? 0;
                    const attendancePercentage = attendanceTotal > 0 
                      ? Math.round((attendancePresent / attendanceTotal) * 100) 
                      : 0;
                    
                    return (
                      <TableRow key={routeStudent.studentId}>
                        <TableCell className="font-medium">
                          {routeStudent.student?.name || 'Unknown Student'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(
                              routeStudent.student?.status || 'ACTIVE'
                            )}
                          >
                            {routeStudent.student?.status || 'ACTIVE'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {attendancePresent}/{attendanceTotal}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({attendancePercentage}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveStudent(
                                routeStudent.studentId,
                                routeStudent.student?.name || 'this student'
                              )
                            }
                            disabled={removeStudentMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No Students Assigned</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This route doesn't have any students assigned yet
              </p>
              <Button onClick={handleAssignStudents}>
                <Users className="mr-2 h-4 w-4" />
                Assign Students
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Driver Dialog */}
      {routeId && (
        <AssignDriverDialog
          open={isAssignDriverDialogOpen}
          onOpenChange={setIsAssignDriverDialogOpen}
          routeId={routeId}
          currentDriver={activeDriver}
        />
      )}

      {/* Assign Students Dialog */}
      {routeId && (
        <AssignStudentsDialog
          open={isAssignStudentsDialogOpen}
          onOpenChange={setIsAssignStudentsDialogOpen}
          routeId={routeId}
        />
      )}

      {/* Edit Route Dialog */}
      {route && (
        <CreateRouteDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          route={route}
        />
      )}
      </div>
    </AnimatedPage>
  );
};
