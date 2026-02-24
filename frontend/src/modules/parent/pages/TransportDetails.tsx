import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Route as RouteIcon, 
  MapPin, 
  Clock,
  Car,
  Phone,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { parentService } from '@/services/parent.service';
import { ChildTransportInfo } from '@/types';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export const TransportDetails: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();

  // Fetch child transport details
  const { 
    data: child, 
    isLoading, 
    error 
  } = useQuery<ChildTransportInfo>({
    queryKey: ['childTransportDetails', childId],
    queryFn: () => parentService.fetchChildTransportDetails(childId!),
    enabled: !!childId,
    retry: 1,
  });

  const handleBack = () => {
    navigate('/parent/children');
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Children
        </Button>
        
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">
                  Access Denied
                </h3>
                <p className="text-sm text-muted-foreground">
                  You don't have permission to view this child's transport details. 
                  This may be because the child doesn't exist or doesn't belong to your account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Children
        </Button>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Child not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div>
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Children
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Transport Details
            </h1>
            <p className="text-muted-foreground mt-1">
              View transport information for {child.name}
            </p>
          </div>
          {child.routeStatus && (
            <Badge 
              variant={child.routeStatus === 'ACTIVE' ? 'default' : 'secondary'}
              className="text-sm"
            >
              {child.routeStatus}
            </Badge>
          )}
        </div>
      </div>

      {/* Child Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Child Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
              <p className="text-base font-semibold">{child.name}</p>
            </div>
            {child.grade && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Grade</p>
                <p className="text-base font-semibold">{child.grade}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Section</p>
              <p className="text-base font-semibold">
                {child.grade ? child.grade.split(' ')[1] || 'A' : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Information */}
      {child.routeName ? (
        <>
          {/* Route Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RouteIcon className="h-5 w-5" />
                Assigned Route Information
              </CardTitle>
              <CardDescription>
                Current transport route assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Route Name</p>
                  <p className="text-base font-semibold">{child.routeName}</p>
                </div>
                {child.driverName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Driver Name</p>
                    <p className="text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {child.driverName}
                    </p>
                  </div>
                )}
                {child.vehicleNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Vehicle Number</p>
                    <p className="text-base font-semibold flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      {child.vehicleNumber}
                    </p>
                  </div>
                )}
                {child.driverPhone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Driver Contact</p>
                    <p className="text-base font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {child.driverPhone}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pickup and Drop-off Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pickup and Drop-off Schedule
              </CardTitle>
              <CardDescription>
                Daily transport schedule and locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {child.pickupTime && (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          Pickup
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {child.pickupTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        {child.pickupLocation || 'Not specified'}
                      </TableCell>
                    </TableRow>
                  )}
                  {child.dropoffTime && (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          Drop-off
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {child.dropoffTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        {child.dropoffLocation || 'Not specified'}
                      </TableCell>
                    </TableRow>
                  )}
                  {!child.pickupTime && !child.dropoffTime && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No schedule information available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <RouteIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Route Assigned</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This child is not currently assigned to any transport route. 
                Please contact the school administration for more information.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
