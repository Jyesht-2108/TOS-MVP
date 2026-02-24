import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bus, 
  Phone, 
  Clock, 
  Navigation,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { LiveMap } from '../components/LiveMap';
import { parentService } from '@/services/parent.service';
import { LiveRouteTracking } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export const TransportInfo: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch live tracking data
  const { 
    data: tracking, 
    isLoading, 
    error,
    refetch,
    isRefetching
  } = useQuery<LiveRouteTracking[]>({
    queryKey: ['liveTracking'],
    queryFn: () => parentService.fetchLiveTracking(),
    refetchInterval: autoRefresh ? 10000 : false, // Refresh every 10 seconds if auto-refresh is on
    refetchIntervalInBackground: false,
  });

  const handleManualRefresh = () => {
    refetch();
  };

  const getTripStatusBadge = (status: LiveRouteTracking['tripStatus']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const formatETA = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    try {
      const eta = new Date(timestamp);
      return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  const activeTracking = tracking?.filter(t => t.tripStatus === 'ACTIVE') || [];

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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Live Bus Tracking</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Track your children's school bus in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefetching}
              className="touch-target"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="touch-target"
            >
              <Navigation className="mr-2 h-4 w-4" />
              {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[500px] w-full rounded-lg" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Unable to Load Tracking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Failed to load live tracking data. Please try again.
                </p>
                <Button onClick={handleManualRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !tracking || tracking.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Routes</h3>
                <p className="text-sm text-muted-foreground">
                  Your children are not assigned to any active routes at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Live Map */}
            <Card>
              <CardHeader>
                <CardTitle>Live Map</CardTitle>
                <CardDescription>
                  Real-time location of buses on your children's routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTracking.length > 0 ? (
                  <LiveMap tracking={activeTracking} height="500px" />
                ) : (
                  <div className="text-center py-12 bg-muted rounded-lg">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Buses</h3>
                    <p className="text-sm text-muted-foreground">
                      There are no buses currently active on your children's routes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Route Details Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {tracking.map((route) => (
                <motion.div
                  key={route.routeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{route.routeName}</CardTitle>
                          <CardDescription className="mt-1">
                            {route.vehicleNumber || 'No vehicle assigned'}
                          </CardDescription>
                        </div>
                        {getTripStatusBadge(route.tripStatus)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Driver Info */}
                      {route.driverName && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bus className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{route.driverName}</p>
                            {route.driverPhone && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Phone className="h-3 w-3" />
                                <span>{route.driverPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Location & Status */}
                      <div className="space-y-2">
                        {route.currentLocation && route.tripStatus === 'ACTIVE' && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Current Speed</span>
                              <span className="font-medium">
                                {route.currentLocation.speed || 0} km/h
                              </span>
                            </div>
                            {route.estimatedArrival && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Est. Arrival
                                </span>
                                <span className="font-medium">
                                  {formatETA(route.estimatedArrival)}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground">Last Updated</span>
                          <span className="text-xs text-muted-foreground">
                            {formatLastUpdated(route.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};
