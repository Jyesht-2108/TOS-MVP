import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Phone, 
  User, 
  Truck, 
  Route as RouteIcon, 
  CreditCard, 
  Car,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { adminService } from '@/services/admin.service';
import { Driver, DriverAttendanceStatus } from '@/types';
import { format } from 'date-fns';
import { CreateDriverDialog } from '../components/CreateDriverDialog';

export const Drivers: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [routeFilter, setRouteFilter] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');
  const [isCreateDriverDialogOpen, setIsCreateDriverDialogOpen] = useState(false);

  // Fetch drivers
  const { 
    data: drivers, 
    isLoading, 
    error 
  } = useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: () => adminService.fetchDrivers(),
  });

  // Fetch today's attendance
  const {
    data: todayAttendance,
    isLoading: isLoadingAttendance,
  } = useQuery({
    queryKey: ['todayDriverAttendance'],
    queryFn: () => adminService.fetchTodayDriverAttendance(),
    refetchInterval: 60000, // Refetch every minute
  });

  // Filter drivers by search query and filters
  const filteredDrivers = React.useMemo(() => {
    if (!drivers) return [];
    
    let filtered = drivers;

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(driver => driver.status === statusFilter);
    }

    // Apply route filter
    if (routeFilter === 'ASSIGNED') {
      filtered = filtered.filter(driver => driver.routeId);
    } else if (routeFilter === 'UNASSIGNED') {
      filtered = filtered.filter(driver => !driver.routeId);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(driver => 
        driver.name.toLowerCase().includes(query) ||
        driver.phone.toLowerCase().includes(query) ||
        driver.licenseNumber?.toLowerCase().includes(query) ||
        driver.vehicleNumber?.toLowerCase().includes(query) ||
        driver.routeName?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [drivers, searchQuery, statusFilter, routeFilter]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!drivers) return { total: 0, active: 0, assigned: 0, available: 0 };
    
    return {
      total: drivers.length,
      active: drivers.filter(d => d.status === 'ACTIVE').length,
      assigned: drivers.filter(d => d.routeId).length,
      available: drivers.filter(d => d.status === 'ACTIVE' && !d.routeId).length,
    };
  }, [drivers]);

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'ACTIVE') {
      return <Badge className="bg-green-500">ACTIVE</Badge>;
    }
    return <Badge className="bg-gray-500">INACTIVE</Badge>;
  };

  const getAttendanceStatusBadge = (status: DriverAttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Present
          </Badge>
        );
      case 'ABSENT':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Absent
          </Badge>
        );
      case 'ON_LEAVE':
        return (
          <Badge variant="secondary">
            <AlertCircle className="mr-1 h-3 w-3" />
            On Leave
          </Badge>
        );
    }
  };

  // Calculate attendance stats
  const attendanceStats = React.useMemo(() => {
    if (!todayAttendance) return { present: 0, absent: 0, onLeave: 0 };
    
    return {
      present: todayAttendance.filter(a => a.status === 'PRESENT').length,
      absent: todayAttendance.filter(a => a.status === 'ABSENT').length,
      onLeave: todayAttendance.filter(a => a.status === 'ON_LEAVE').length,
    };
  }, [todayAttendance]);

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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Drivers</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage drivers and their route assignments
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDriverDialogOpen(true)} 
            className="w-full sm:w-auto touch-target"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All registered drivers
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently active
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assigned to Routes</CardTitle>
                <RouteIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.assigned}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently on routes
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.available}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready for assignment
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Attendance - {format(new Date(), 'MMMM dd, yyyy')}
            </CardTitle>
            <CardDescription>
              Driver attendance status for today (ERP Integration)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAttendance ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !todayAttendance || todayAttendance.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No attendance records for today.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Attendance Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-medium text-muted-foreground">Present</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm font-medium text-muted-foreground">Absent</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-950/20">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-600">{attendanceStats.onLeave}</p>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Driver</TableHead>
                        <TableHead className="min-w-[120px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Check-in Time</TableHead>
                        <TableHead className="min-w-[120px]">Check-out Time</TableHead>
                        <TableHead className="min-w-[200px]">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAttendance.map((attendance) => (
                        <TableRow 
                          key={attendance.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            const driver = drivers?.find(d => d.id === attendance.driverId);
                            if (driver) navigate(`/admin/drivers/${driver.id}`);
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{attendance.driverName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getAttendanceStatusBadge(attendance.status)}</TableCell>
                          <TableCell>
                            {attendance.checkInTime ? (
                              <span className="text-sm">
                                {format(new Date(attendance.checkInTime), 'hh:mm a')}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {attendance.checkOutTime ? (
                              <span className="text-sm">
                                {format(new Date(attendance.checkOutTime), 'hh:mm a')}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {attendance.remarks ? (
                              <span className="text-sm text-muted-foreground">{attendance.remarks}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* ERP Integration Notice */}
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        ERP Integration
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Attendance data is currently using mock data. In production, this will be automatically synced with your school's ERP system for real-time attendance tracking and reporting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Drivers List */}
        <Card>
          <CardHeader>
            <CardTitle>All Drivers</CardTitle>
            <CardDescription>
              View and manage all drivers in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, license, or vehicle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 touch-target"
                />
              </div>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
              >
                <SelectTrigger className="w-full sm:w-[140px] touch-target">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Route Filter */}
              <Select
                value={routeFilter}
                onValueChange={(value) => setRouteFilter(value as 'ALL' | 'ASSIGNED' | 'UNASSIGNED')}
              >
                <SelectTrigger className="w-full sm:w-[160px] touch-target">
                  <SelectValue placeholder="Route Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Routes</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="UNASSIGNED">Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-sm text-destructive">
                  Failed to load drivers. Please try again later.
                </p>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No drivers found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== 'ALL' || routeFilter !== 'ALL'
                    ? 'Try adjusting your search or filters'
                    : 'No drivers registered in the system'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Driver</TableHead>
                      <TableHead className="min-w-[140px]">Phone</TableHead>
                      <TableHead className="min-w-[140px]">License</TableHead>
                      <TableHead className="min-w-[120px]">Vehicle</TableHead>
                      <TableHead className="min-w-[180px]">Assigned Route</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow 
                        key={driver.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/admin/drivers/${driver.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{driver.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">{driver.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {driver.licenseNumber ? (
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{driver.licenseNumber}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {driver.vehicleNumber ? (
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{driver.vehicleNumber}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {driver.routeName ? (
                            <div className="flex items-center gap-2">
                              <RouteIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{driver.routeName}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadgeVariant(driver.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Create Driver Dialog */}
      <CreateDriverDialog
        open={isCreateDriverDialogOpen}
        onOpenChange={setIsCreateDriverDialogOpen}
      />
    </AnimatedPage>
  );
};
