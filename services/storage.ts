import { Franchise, Student, Course, UserRole } from '../types';

// Initial Mock Data
const MOCK_COURSES: Course[] = [
  { id: '1', name: 'ADCA (Advance Diploma in Computer Application)', code: 'ADCA', duration: '12 Months', type: 'Long Term', fees: 12000, description: 'Complete computer mastery course.' },
  { id: '2', name: 'DCA (Diploma in Computer Application)', code: 'DCA', duration: '6 Months', type: 'Short Term', fees: 6000, description: 'Fundamental computer usage course.' },
  { id: '3', name: 'CCC (Course on Computer Concepts)', code: 'CCC', duration: '3 Months', type: 'Certificate', fees: 3000, description: 'Basic computer literacy.' },
];

const MOCK_FRANCHISES: Franchise[] = [
  { id: 'f1', instituteName: 'SGC Main Center', ownerName: 'Rajesh Kumar', email: 'rajesh@sgc.com', phone: '9876543210', city: 'Lucknow', state: 'Uttar Pradesh', address: '123 Main St', status: 'active', createdAt: '2023-01-01' },
  { id: 'f2', instituteName: 'Tech Skills Hub', ownerName: 'Amit Singh', email: 'amit@tech.com', phone: '9876543211', city: 'Kanpur', state: 'Uttar Pradesh', address: '456 Market Rd', status: 'pending', createdAt: '2023-06-15' },
];

const MOCK_STUDENTS: Student[] = [
  { id: 's1', enrollmentNo: 'SGC2023001', name: 'Rahul Sharma', fatherName: 'Mohan Sharma', courseId: '1', franchiseId: 'f1', dob: '2000-05-15', mobile: '9998887776', email: 'rahul@gmail.com', gender: 'Male', sessionStart: '2023', sessionEnd: '2024', status: 'active' },
  { id: 's2', enrollmentNo: 'SGC2023002', name: 'Priya Verma', fatherName: 'Suresh Verma', courseId: '2', franchiseId: 'f1', dob: '2001-08-20', mobile: '9998887775', email: 'priya@gmail.com', gender: 'Female', sessionStart: '2023', sessionEnd: '2023', status: 'completed' },
];

// Helper to initialize storage
const initStorage = () => {
  if (!localStorage.getItem('sgc_courses')) localStorage.setItem('sgc_courses', JSON.stringify(MOCK_COURSES));
  if (!localStorage.getItem('sgc_franchises')) localStorage.setItem('sgc_franchises', JSON.stringify(MOCK_FRANCHISES));
  if (!localStorage.getItem('sgc_students')) localStorage.setItem('sgc_students', JSON.stringify(MOCK_STUDENTS));
};

initStorage();

// --- API Service Methods (Simulating Backend) ---

export const getCourses = (): Course[] => {
  return JSON.parse(localStorage.getItem('sgc_courses') || '[]');
};

export const getFranchises = (): Franchise[] => {
  return JSON.parse(localStorage.getItem('sgc_franchises') || '[]');
};

export const createFranchise = (data: Omit<Franchise, 'id' | 'createdAt'>): Franchise => {
  const franchises = getFranchises();
  const newFranchise: Franchise = {
    ...data,
    id: `f${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  franchises.push(newFranchise);
  localStorage.setItem('sgc_franchises', JSON.stringify(franchises));
  return newFranchise;
};

export const updateFranchiseStatus = (id: string, status: Franchise['status']) => {
  const franchises = getFranchises();
  const index = franchises.findIndex(f => f.id === id);
  if (index !== -1) {
    franchises[index].status = status;
    localStorage.setItem('sgc_franchises', JSON.stringify(franchises));
  }
};

export const getStudents = (franchiseId?: string): Student[] => {
  const students = JSON.parse(localStorage.getItem('sgc_students') || '[]');
  const franchises = getFranchises();
  
  const enriched = students.map((s: Student) => ({
    ...s,
    franchiseName: franchises.find(f => f.id === s.franchiseId)?.instituteName || 'Unknown'
  }));

  if (franchiseId) {
    return enriched.filter((s: Student) => s.franchiseId === franchiseId);
  }
  return enriched;
};

export const createStudent = (data: Omit<Student, 'id'>): Student => {
  const students = JSON.parse(localStorage.getItem('sgc_students') || '[]');
  const newStudent: Student = {
    ...data,
    id: `s${Date.now()}`,
  };
  students.push(newStudent);
  localStorage.setItem('sgc_students', JSON.stringify(students));
  return newStudent;
};

export const verifyStudent = (enrollmentNo: string) => {
  const students = getStudents();
  return students.find(s => s.enrollmentNo === enrollmentNo);
};

export const getDashboardStats = () => {
  const franchises = getFranchises();
  const students = getStudents();
  const courses = getCourses();
  
  return {
    totalFranchises: franchises.length,
    totalStudents: students.length,
    totalCourses: courses.length,
    pendingApplications: franchises.filter(f => f.status === 'pending').length
  };
};