export type UserRole = 'admin' | 'principal' | 'teacher' | 'student' | 'parent' | 'accountant' | 'admissions_staff';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Student {
  id: string;
  usn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  classId: string;
  sectionId: string;
  rollNumber: string;
  status: 'active' | 'inactive';
  photo?: string;
}

export interface Class {
  id: string;
  name: string;
  gradeLevel: number;
  academicYear: string;
  status: 'active' | 'inactive';
}

export interface Application {
  id: string;
  applicantName: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  gradeApplied: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'enrolled';
  submittedAt: string;
}
