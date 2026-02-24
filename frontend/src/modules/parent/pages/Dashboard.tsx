import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Route as RouteIcon, 
  Calendar,
  MapPin,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AnimatedPage } from '@/components/AnimatedPage';
import { useAuthStore } from '@/stores/authStore';
import { parentService } from '@/services/parent.service';
import { ParentDashboardStats, ChildTransportInfo } from '@/types';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="cursor-default">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
      </Card>
    </motion.div>
  );
};

const StatCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
};

interface ChildCardProps {
  child: ChildTransportInfo;
  onViewDetails: (childId: string) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onViewDetails }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{child.name}</CardTitle>
              {child.grade && (
                <CardDescription>{child.grade}</CardDescription>
              )}
            </div>
          </div>
          {child.routeStatus && (
            <Badge variant={child.routeStatus === 'ACTIVE' ? 'default' : 'secondary'}>
              {child.routeStatus}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {child.routeName ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{child.routeName}</span>
            </div>
            
            {child.driverName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Driver: {child.driverName}</span>
              </div>
            )}
            
            {child.pickupTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Pickup: {child.pickupTime}</span>
              </div>
            )}
            
            {child.dropoffTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Drop-off: {child.dropoffTime}</span>
              </div>
            )}
            
            {child.pickupLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{child.pickupLocation}</span>
              </div>
            )}
            
            <Button 
              className="w-full mt-2" 
              variant="outline"
              onClick={() => onViewDetails(child.id)}
            >
              View Route Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-sm text-muted-foreground py-4 text-center">
            No route assigned yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ChildCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full mt-2" />
      </CardContent>
    </Card>
  );
};

export const ParentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery<ParentDashboardStats>({
    queryKey: ['parentDashboardStats'],
    queryFn: () => parentService.fetchDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch children transport info
  const { 
    data: children, 
    isLoading: childrenLoading, 
    error: childrenError 
  } = useQuery<ChildTransportInfo[]>({
    queryKey: ['childrenTransport'],
    queryFn: () => parentService.fetchChildrenTransport(),
    refetchInterval: 30000,
  });

  const handleViewDetails = (childId: string) => {
    navigate(`/parent/children/${childId}`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Parent'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Track your children's transport information and schedules.
          </p>
        </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : statsError ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                Failed to load dashboard statistics. Please try again later.
              </p>
            </CardContent>
          </Card>
        ) : stats ? (
          <>
            <StatCard
              title="My Children"
              value={stats.myChildren}
              icon={<Users className="h-4 w-4" />}
              description="Registered children"
            />
            <StatCard
              title="Active Routes"
              value={stats.activeRoutes}
              icon={<RouteIcon className="h-4 w-4" />}
              description="Currently assigned"
            />
            <StatCard
              title="Upcoming Trips"
              value={stats.upcomingTrips}
              icon={<Calendar className="h-4 w-4" />}
              description="This week"
            />
          </>
        ) : null}
      </div>

      {/* My Children Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">My Children</h2>
        
        {childrenLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ChildCardSkeleton />
            <ChildCardSkeleton />
          </div>
        ) : childrenError ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                Failed to load children information. Please try again later.
              </p>
            </CardContent>
          </Card>
        ) : children && children.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <ChildCard 
                key={child.id} 
                child={child} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No children registered yet.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </AnimatedPage>
  );
};
