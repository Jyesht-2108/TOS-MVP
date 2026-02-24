import { RecentActivity } from '@/types';

// In-memory activity store (in a real app, this would be in a database)
let activities: RecentActivity[] = [];
let activityIdCounter = 1;

// Activity listeners for real-time updates
type ActivityListener = (activities: RecentActivity[]) => void;
const listeners: Set<ActivityListener> = new Set();

/**
 * Add a new activity to the tracker
 */
export const addActivity = (
  type: RecentActivity['type'],
  description: string,
  userId?: string,
  userName?: string
): void => {
  const newActivity: RecentActivity = {
    id: `activity-${activityIdCounter++}`,
    type,
    description,
    timestamp: new Date().toISOString(),
    userId,
    userName,
  };

  // Add to beginning of array (most recent first)
  activities = [newActivity, ...activities];

  // Keep only last 50 activities
  if (activities.length > 50) {
    activities = activities.slice(0, 50);
  }

  // Notify all listeners
  notifyListeners();
};

/**
 * Get recent activities
 */
export const getRecentActivities = (limit: number = 10): RecentActivity[] => {
  return activities.slice(0, limit);
};

/**
 * Subscribe to activity updates
 */
export const subscribeToActivities = (listener: ActivityListener): (() => void) => {
  listeners.add(listener);
  
  // Return unsubscribe function
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Notify all listeners of activity changes
 */
const notifyListeners = (): void => {
  listeners.forEach(listener => {
    listener([...activities]);
  });
};

/**
 * Initialize with some default activities (for demo purposes)
 */
export const initializeActivities = (): void => {
  if (activities.length === 0) {
    // Add some initial activities
    const now = Date.now();
    
    activities = [
      {
        id: 'activity-init-4',
        type: 'ROUTE_UPDATED',
        description: 'Route "Evening Route C" status changed to Active',
        timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
        userId: '550e8400-e29b-41d4-a716-446655440001',
        userName: 'Admin User',
      },
      {
        id: 'activity-init-3',
        type: 'STUDENT_ASSIGNED',
        description: '5 students assigned to Morning Route A',
        timestamp: new Date(now - 1000 * 60 * 120).toISOString(),
        userId: '550e8400-e29b-41d4-a716-446655440001',
        userName: 'Admin User',
      },
      {
        id: 'activity-init-2',
        type: 'DRIVER_ASSIGNED',
        description: 'Driver John Smith assigned to Route B',
        timestamp: new Date(now - 1000 * 60 * 60).toISOString(),
        userId: '550e8400-e29b-41d4-a716-446655440001',
        userName: 'Admin User',
      },
      {
        id: 'activity-init-1',
        type: 'ROUTE_CREATED',
        description: 'New route "Morning Route A" created',
        timestamp: new Date(now - 1000 * 60 * 30).toISOString(),
        userId: '550e8400-e29b-41d4-a716-446655440001',
        userName: 'Admin User',
      },
    ];
    
    activityIdCounter = 5;
  }
};

/**
 * Clear all activities (for testing)
 */
export const clearActivities = (): void => {
  activities = [];
  activityIdCounter = 1;
  notifyListeners();
};
