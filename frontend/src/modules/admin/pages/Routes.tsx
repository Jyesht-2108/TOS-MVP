import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Eye, 
  UserPlus, 
  Users, 
  Trash2 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { routesService } from '@/services/routes.service';
import { RouteResponse, RouteStatus } from '@/types';
import { toast } from 'sonner';
import { CreateRouteDialog } from '../components/CreateRouteDialog';
import { AssignDriverDialog } from '../components/AssignDriverDialog';
import { AssignStudentsDialog } from '../components/AssignStudentsDialog';

export const Routes: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RouteStatus>('ALL');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);
  const [isAssignStudentsDialogOpen, setIsAssignStudentsDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse | null>(null);

  // Fetch routes with React Query
  const { 
    data: routes, 
    isLoading, 
    error 
  } = useQuery<RouteResponse[]>({
    queryKey: ['routes', statusFilter],
    queryFn: () => {
      if (statusFilter === 'ALL') {
        return routesService.fetchRoutes();
      }
      return routesService.fetchRoutes(statusFilter);
    },
  });

  // Delete route mutation
  const deleteRouteMutation = useMutation({
    mutationFn: (routeId: string) => routesService.deleteRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete route');
    },
  });

  // Filter routes by search query
  const filteredRoutes = React.useMemo(() => {
    if (!routes) return [];
    if (!searchQuery) return routes;
    
    const query = searchQuery.toLowerCase();
    return routes.filter(route => 
      route.name.toLowerCase().includes(query) ||
      route.driverName?.toLowerCase().includes(query)
    );
  }, [routes, searchQuery]);

  const handleDeleteRoute = (routeId: string, routeName: string) => {
    if (window.confirm(`Are you sure you want to delete route "${routeName}"?`)) {
      deleteRouteMutation.mutate(routeId);
    }
  };

  const handleAssignDriver = (route: RouteResponse) => {
    setSelectedRoute(route);
    setIsAssignDriverDialogOpen(true);
  };

  const handleAssignStudents = (route: RouteResponse) => {
    setSelectedRoute(route);
    setIsAssignStudentsDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: RouteStatus): "default" | "secondary" => {
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Routes</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage transport routes and assignments
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto touch-target">
            <Plus className="mr-2 h-4 w-4" />
            Create Route
          </Button>
        </motion.div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
          <CardDescription>
            View and manage all transport routes in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search routes by name or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 touch-target"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'ALL' | RouteStatus)}
            >
              <SelectTrigger className="w-full sm:w-[180px] touch-target">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 flex-1" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-destructive">
                Failed to load routes. Please try again later.
              </p>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No routes found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first route'}
              </p>
              {!searchQuery && statusFilter === 'ALL' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Route
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Route Name</TableHead>
                    <TableHead className="w-[12%]">Status</TableHead>
                    <TableHead className="w-[18%]">Driver</TableHead>
                    <TableHead className="w-[12%]">Students</TableHead>
                    <TableHead className="w-[38%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.name}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(route.status)}>
                          {route.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {route.driverName || (
                          <span className="text-muted-foreground italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{route.studentCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 justify-start">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(`/admin/routes/${route.id}`)}
                            className="min-w-[85px]"
                          >
                            <Eye className="mr-1.5 h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAssignDriver(route)}
                            className="min-w-[95px] bg-blue-600 hover:bg-blue-700"
                          >
                            <UserPlus className="mr-1.5 h-4 w-4" />
                            Driver
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAssignStudents(route)}
                            className="min-w-[110px] bg-green-600 hover:bg-green-700"
                          >
                            <Users className="mr-1.5 h-4 w-4" />
                            Students
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRoute(route.id, route.name)}
                            className="min-w-[90px]"
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Route Dialog */}
      <CreateRouteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* Assign Driver Dialog */}
      {selectedRoute && (
        <AssignDriverDialog
          open={isAssignDriverDialogOpen}
          onOpenChange={setIsAssignDriverDialogOpen}
          routeId={selectedRoute.id}
        />
      )}

      {/* Assign Students Dialog */}
      {selectedRoute && (
        <AssignStudentsDialog
          open={isAssignStudentsDialogOpen}
          onOpenChange={setIsAssignStudentsDialogOpen}
          routeId={selectedRoute.id}
        />
      )}
      </div>
    </AnimatedPage>
  );
};
