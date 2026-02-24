import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Car,
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
import { LiveMap } from '@/modules/parent/components/LiveMap';
import { adminService } from '@/services/admin.service';
import { ActiveTrip } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

export const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  // Fetch trip details
  const {
    data: trip,
    isLoading,
    error,
  } = useQuery<ActiveTrip>({
    queryKey: ['trip', tripId],
    queryFn: () => adminService.fetchTripDetails(tripId!),
    enabled: !!tripId,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const getGPSHealthBadge = (status: ActiveTrip['gpsHealthStatus']) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Healthy
          </Badge>
        );
      case 'WARNING':
        return (
          <Badge variant="default" className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        );
      case 'STALE':
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Stale
          </Badge>
        );
    }
  };

  const getAttendanceIcon = (status: 'PRESENT' | 'ABSENT' | 'PENDING') => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ABSENT':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAttendanceBadge = (status: 'PRESENT' | 'ABSENT' | 'PENDING') => {
    switch (status) {
      case 'PRESENT':
        return <Badge variant="default" className="bg-green-500">Present</Badge>;
      case 'ABSENT':
        return <Badge variant="destructive">Absent</Badge>;
      case 'PENDING':
        return <Badge variant="default" className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/live-monitoring')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Live Monitoring
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-sm text-destructive">
                Failed to load trip details. Please try again later.
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
          className="flex items-center gap-4"
        >
          <Button variant="ghost" onClick={() => navigate('/admin/live-monitoring')} className="touch-target">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isLoading ? <Skeleton className="h-9 w-64" /> : trip?.routeName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Trip details and live tracking
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : trip ? (
          <>
            {/* Trip Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vehicle</span>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{trip.vehicleNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Driver</span>
                    <span className="font-medium">{trip.driverName}</span>
                  </div>
                  {trip.driverPhone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{trip.driverPhone}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trip Type</span>
                    <Badge>{trip.tripType}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Start Time</span>
                    <span className="font-medium">
                      {format(new Date(trip.startTime), 'hh:mm a')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GPS Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Health Status</span>
                    {getGPSHealthBadge(trip.gpsHealthStatus)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Ping</span>
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(trip.lastGPSPing), { addSuffix: true })}
                    </span>
                  </div>
                  {trip.currentLocation && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Speed</span>
                        <span className="font-medium">{trip.currentLocation.speed || 0} km/h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {trip.currentLocation.latitude.toFixed(4)}, {trip.currentLocation.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Live Map */}
            {trip.currentLocation && (
              <Card>
                <CardHeader>
                  <CardTitle>Live Location</CardTitle>
                  <CardDescription>
                    Real-time bus location on the map
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LiveMap
                    tracking={[{
                      routeId: trip.routeId,
                      routeName: trip.routeName,
                      vehicleNumber: trip.vehicleNumber,
                      driverName: trip.driverName,
                      driverPhone: trip.driverPhone,
                      currentLocation: trip.currentLocation,
                      tripStatus: 'ACTIVE',
                      lastUpdated: trip.lastGPSPing,
                    }]}
                    height="400px"
                  />
                </CardContent>
              </Card>
            )}

            {/* Attendance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Attendance</CardTitle>
                    <CardDescription>
                      Attendance progress for this trip
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{trip.presentStudents}</div>
                      <div className="text-xs text-muted-foreground">Present</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">{trip.pendingStudents}</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{trip.absentStudents}</div>
                      <div className="text-xs text-muted-foreground">Absent</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Student Name</TableHead>
                        <TableHead className="min-w-[120px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Pickup Time</TableHead>
                        <TableHead className="min-w-[200px]">Pickup Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trip.attendance.map((attendance) => (
                        <TableRow key={attendance.studentId}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getAttendanceIcon(attendance.status)}
                              <span className="font-medium">{attendance.studentName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getAttendanceBadge(attendance.status)}</TableCell>
                          <TableCell>
                            <span className="text-sm">{attendance.pickupTime || 'N/A'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {attendance.pickupLocation || 'N/A'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AnimatedPage>
  );
};
