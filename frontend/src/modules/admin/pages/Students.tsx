import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, GraduationCap, User, Route as RouteIcon, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Student } from '@/types';

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [routeFilter, setRouteFilter] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');
  const [viewMode, setViewMode] = useState<'all' | 'by-grade' | 'by-route'>('all');

  // Fetch students
  const { 
    data: students, 
    isLoading, 
    error 
  } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: () => adminService.fetchStudents(),
  });

  // Filter students by search query and filters
  const filteredStudents = React.useMemo(() => {
    if (!students) return [];
    
    let filtered = students;

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    // Apply route filter
    if (routeFilter === 'ASSIGNED') {
      filtered = filtered.filter(student => student.routeId);
    } else if (routeFilter === 'UNASSIGNED') {
      filtered = filtered.filter(student => !student.routeId);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.parentName?.toLowerCase().includes(query) ||
        student.grade?.toLowerCase().includes(query) ||
        student.routeName?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [students, searchQuery, statusFilter, routeFilter]);

  // Group students by grade
  const studentsByGrade = React.useMemo(() => {
    if (!filteredStudents) return {};
    
    const grouped: Record<string, Student[]> = {};
    
    filteredStudents.forEach(student => {
      const grade = student.grade || 'Unassigned';
      if (!grouped[grade]) {
        grouped[grade] = [];
      }
      grouped[grade].push(student);
    });
    
    // Sort grades
    const sortedGrades = Object.keys(grouped).sort((a, b) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b, undefined, { numeric: true });
    });
    
    const sortedGrouped: Record<string, Student[]> = {};
    sortedGrades.forEach(grade => {
      sortedGrouped[grade] = grouped[grade];
    });
    
    return sortedGrouped;
  }, [filteredStudents]);

  // Group students by route
  const studentsByRoute = React.useMemo(() => {
    if (!filteredStudents) return {};
    
    const grouped: Record<string, Student[]> = {};
    
    filteredStudents.forEach(student => {
      const route = student.routeName || 'Unassigned';
      if (!grouped[route]) {
        grouped[route] = [];
      }
      grouped[route].push(student);
    });
    
    // Sort routes with Unassigned at the end
    const sortedRoutes = Object.keys(grouped).sort((a, b) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    });
    
    const sortedGrouped: Record<string, Student[]> = {};
    sortedRoutes.forEach(route => {
      sortedGrouped[route] = grouped[route];
    });
    
    return sortedGrouped;
  }, [filteredStudents]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!students) return { total: 0, active: 0, assigned: 0, unassigned: 0 };
    
    return {
      total: students.length,
      active: students.filter(s => s.status === 'ACTIVE').length,
      assigned: students.filter(s => s.routeId).length,
      unassigned: students.filter(s => !s.routeId).length,
    };
  }, [students]);

  const getStatusBadgeVariant = (status: string): "default" | "secondary" => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

  // Render student table
  const renderStudentTable = (studentsList: Student[]) => (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Student</TableHead>
            <TableHead className="min-w-[100px]">Grade</TableHead>
            <TableHead className="min-w-[150px]">Parent</TableHead>
            <TableHead className="min-w-[180px]">Assigned Route</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentsList.map((student) => (
            <TableRow 
              key={student.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/admin/students/${student.id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{student.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {student.grade && student.section ? (
                  <span className="text-sm">
                    Grade {student.grade}-{student.section}
                  </span>
                ) : student.grade ? (
                  <span className="text-sm">Grade {student.grade}</span>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Not set</span>
                )}
              </TableCell>
              <TableCell>
                {student.parentName ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.parentName}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">No parent</span>
                )}
              </TableCell>
              <TableCell>
                {student.routeName ? (
                  <div className="flex items-center gap-2">
                    <RouteIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.routeName}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(student.status)}>
                  {student.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage students and their transport assignments
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
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All registered students
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
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
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
                  Have transport assigned
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
                <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unassigned}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need route assignment
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Students List</CardTitle>
            <CardDescription>
              View students organized by different criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, parent, grade, or route..."
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
                  <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs for different views */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-sm text-destructive">
                  Failed to load students. Please try again later.
                </p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No students found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== 'ALL' || routeFilter !== 'ALL'
                    ? 'Try adjusting your search or filters'
                    : 'No students registered in the system'}
                </p>
              </div>
            ) : (
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'all' | 'by-grade' | 'by-route')} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Students</TabsTrigger>
                  <TabsTrigger value="by-grade">By Grade</TabsTrigger>
                  <TabsTrigger value="by-route">By Route</TabsTrigger>
                </TabsList>

                {/* All Students View */}
                <TabsContent value="all" className="mt-0">
                  {renderStudentTable(filteredStudents)}
                </TabsContent>

                {/* By Grade View */}
                <TabsContent value="by-grade" className="mt-0 space-y-6">
                  {Object.entries(studentsByGrade).map(([grade, gradeStudents]) => (
                    <motion.div
                      key={grade}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          {grade === 'Unassigned' ? 'No Grade Assigned' : `Grade ${grade}`}
                        </h3>
                        <Badge variant="secondary" className="text-sm">
                          {gradeStudents.length} {gradeStudents.length === 1 ? 'student' : 'students'}
                        </Badge>
                      </div>
                      {renderStudentTable(gradeStudents)}
                    </motion.div>
                  ))}
                </TabsContent>

                {/* By Route View */}
                <TabsContent value="by-route" className="mt-0 space-y-6">
                  {Object.entries(studentsByRoute).map(([route, routeStudents]) => (
                    <motion.div
                      key={route}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <RouteIcon className="h-5 w-5 text-primary" />
                          {route === 'Unassigned' ? 'No Route Assigned' : route}
                        </h3>
                        <Badge variant="secondary" className="text-sm">
                          {routeStudents.length} {routeStudents.length === 1 ? 'student' : 'students'}
                        </Badge>
                      </div>
                      {renderStudentTable(routeStudents)}
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};
