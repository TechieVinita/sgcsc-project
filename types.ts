
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
  franchiseId?: string;
}

export interface Franchise {
  id: string;
  // Personal & Identity
  instituteId: string;
  instituteOwnerName: string;
  instituteName: string;
  dob: string;
  aadharNumber: string;
  panNumber: string;
  // Files (URL strings for mock)
  aadharFront: string;
  aadharBack: string;
  panImage: string;
  institutePhoto: string;
  ownerSign: string;
  ownerPhoto: string;
  certificateCopy: string;
  // Address
  address: string;
  state: string;
  district: string;
  city: string; // Keeping for backward compatibility or alias to district
  // Infrastructure
  numComputerOperators: number;
  numClassRooms: number;
  totalComputers: number;
  centerSpace: string;
  // Contact
  whatsappNumber: string;
  contactNumber: string;
  email: string;
  headQualification: string;
  // Facilities (Yes/No)
  hasReception: 'Yes' | 'No';
  hasStaffRoom: 'Yes' | 'No';
  hasWaterSupply: 'Yes' | 'No';
  hasToilet: 'Yes' | 'No';
  // Login
  username: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface Student {
  id: string;
  // Core
  centerName: string; // Franchise Name
  franchiseId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  fatherName: string;
  motherName: string;
  dob: string;
  email: string;
  mobile: string;
  // Address
  state: string;
  district: string;
  address: string;
  // Academic
  examPass: 'Yes' | 'No'; // Previous exam
  marksPercentage: string;
  board: string;
  year: string;
  // Course Info
  courseId: string;
  sessionStart: string;
  sessionEnd: string;
  enrollmentNo: string;
  // Login
  username: string;
  status: 'active' | 'completed' | 'dropout';
  photo: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  description: string;
  fees: number;
  type: 'Long Term' | 'Short Term' | 'Certificate';
  code: string;
}

export interface Subject {
  id: string;
  courseId: string;
  name: string;
  maxMarks: number;
  minMarks: number;
}

export interface InstituteMember {
  id: string;
  name: string;
  designation: string;
  photo: string;
}

export interface GalleryItem {
  id: string;
  name: string;
  category: string; // 'Affiliations Component', 'Gallery Page'
  photo: string;
}

export interface Result {
  id: string;
  enrollmentNo: string;
  rollNo: string;
  courseId: string;
  marks: any; // Simplified for now
}

export interface AdmitCard {
  id: string;
  enrollmentNo: string;
  rollNo: string;
  courseId: string;
  examCenter: string;
  examDate: string;
  examTime: string;
}

export interface Certificate {
  id: string;
  enrollmentNo: string;
  issueDate: string;
  certificatePath: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  linkUrl?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
}

export interface SiteSettings {
  headerText: string;
  footerText: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  logoUrl: string;
}

export interface DashboardStats {
  totalFranchises: number;
  totalStudents: number;
  totalCourses: number;
  pendingApplications: number;
}
