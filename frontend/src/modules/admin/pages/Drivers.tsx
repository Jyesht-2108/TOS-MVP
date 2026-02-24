import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Phone, User, Truck, Route as RouteIcon, CreditCard, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Driver } from '@/types';

export const Drivers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [routeFilter, setRouteFilter] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');

  // Fetch drivers
  const { 
    data: drivers, 
    isLoading, 
    error 
  } = useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: () => adminService.fetchDrivers(),
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

  const getStatusBadgeVariant = (status: string): "default" | "secondary" => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

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
                      <TableRow key={driver.id}>
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
                          <Badge variant={getStatusBadgeVariant(driver.status)}>
                            {driver.status}
                          </Badge>
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
    </AnimatedPage>
  );
};
