export enum UserRole {
  ADMIN = 'ADMIN',
  FRANCHISE = 'FRANCHISE',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  franchiseId?: string; // If role is Franchise or Student
}

export interface Franchise {
  id: string;
  instituteName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  // Specific fields from requirements
  aadharNumber?: string;
  panNumber?: string;
  computerCount?: number;
}

export interface Student {
  id: string;
  enrollmentNo: string;
  name: string;
  fatherName: string;
  courseId: string;
  franchiseId: string;
  franchiseName?: string; // Populated for display
  dob: string;
  mobile: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  sessionStart: string;
  sessionEnd: string;
  status: 'active' | 'completed' | 'dropout';
}

export interface Course {
  id: string;
  name: string;
  code: string;
  duration: string; // e.g., "1 Year"
  type: 'Long Term' | 'Short Term' | 'Certificate';
  fees: number;
  description: string;
}

export interface DashboardStats {
  totalFranchises: number;
  totalStudents: number;
  totalCourses: number;
  pendingApplications: number;
}