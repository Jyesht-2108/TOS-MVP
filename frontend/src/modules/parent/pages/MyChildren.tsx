import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Users, User, Route as RouteIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { parentService } from '@/services/parent.service';
import { ChildTransportInfo } from '@/types';

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
            
            <Button 
              className="w-full mt-2" 
              variant="outline"
              onClick={() => onViewDetails(child.id)}
            >
              View Transport Details
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
        <Skeleton className="h-10 w-full mt-2" />
      </CardContent>
    </Card>
  );
};

export const MyChildren: React.FC = () => {
  const navigate = useNavigate();

  // Fetch children transport info
  const { 
    data: children, 
    isLoading, 
    error 
  } = useQuery<ChildTransportInfo[]>({
    queryKey: ['childrenTransport'],
    queryFn: () => parentService.fetchChildrenTransport(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleViewDetails = (childId: string) => {
    navigate(`/parent/children/${childId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your children's transport information.
        </p>
      </div>

      {/* Children Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChildCardSkeleton />
          <ChildCardSkeleton />
          <ChildCardSkeleton />
        </div>
      ) : error ? (
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
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Children Registered</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You don't have any children registered in the system yet. 
                Please contact the school administration to register your children.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
