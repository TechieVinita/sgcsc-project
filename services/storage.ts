
import { Franchise, Student, Course, Subject, InstituteMember, GalleryItem, Result, AdmitCard, Certificate, StudyMaterial, Assignment, SiteSettings } from '../types';

// --- Initial Mock Data Wrappers ---

const getList = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const saveList = <T>(key: string, list: T[]) => localStorage.setItem(key, JSON.stringify(list));

// --- Franchise ---
export const getFranchises = (): Franchise[] => getList<Franchise>('sgc_franchises');

export const getFranchiseById = (id: string): Franchise | undefined => {
  return getFranchises().find(f => f.id === id);
};

export const createFranchise = (data: any): Franchise => {
  const list = getFranchises();
  const newItem = { ...data, id: `f${Date.now()}`, createdAt: new Date().toISOString() };
  list.push(newItem);
  saveList('sgc_franchises', list);
  return newItem;
};

export const updateFranchise = (id: string, data: Partial<Franchise>) => {
  const list = getFranchises();
  const index = list.findIndex(f => f.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    saveList('sgc_franchises', list);
  }
};

export const deleteFranchise = (id: string) => {
  const list = getFranchises();
  const filtered = list.filter(f => f.id !== id);
  saveList('sgc_franchises', filtered);
};

export const updateFranchiseStatus = (id: string, status: any) => {
  const list = getFranchises();
  const item = list.find(x => x.id === id);
  if (item) {
    item.status = status;
    saveList('sgc_franchises', list);
  }
};

// --- Students ---
export const getStudents = (franchiseId?: string): Student[] => {
  const students = getList<Student>('sgc_students');
  const franchises = getFranchises();
  const enriched = students.map(s => ({
    ...s,
    centerName: franchises.find(f => f.id === s.franchiseId)?.instituteName || 'Unknown'
  }));
  return franchiseId ? enriched.filter(s => s.franchiseId === franchiseId) : enriched;
};

export const getStudentById = (id: string): Student | undefined => {
  return getStudents().find(s => s.id === id);
};

export const createStudent = (data: any): Student => {
  const list = getList<Student>('sgc_students');
  const newItem = { ...data, id: `s${Date.now()}` };
  list.push(newItem);
  saveList('sgc_students', list);
  return newItem;
};
export const verifyStudent = (enrollmentNo: string) => {
  return getStudents().find(s => s.enrollmentNo === enrollmentNo);
};

// --- Courses & Subjects ---
export const getCourses = (): Course[] => getList<Course>('sgc_courses');
export const createCourse = (data: any) => {
  const list = getCourses();
  list.push({ ...data, id: `c${Date.now()}` });
  saveList('sgc_courses', list);
};
export const getSubjects = (courseId?: string): Subject[] => {
  const list = getList<Subject>('sgc_subjects');
  return courseId ? list.filter(s => s.courseId === courseId) : list;
};
export const createSubject = (data: any) => {
  const list = getSubjects();
  list.push({ ...data, id: `sub${Date.now()}` });
  saveList('sgc_subjects', list);
};

// --- Generic Helpers for other modules ---
export const getMembers = () => getList<InstituteMember>('sgc_members');
export const createMember = (data: any) => { const l = getMembers(); l.push({...data, id: `m${Date.now()}`}); saveList('sgc_members', l); };

export const getGallery = () => getList<GalleryItem>('sgc_gallery');
export const createGalleryItem = (data: any) => { const l = getGallery(); l.push({...data, id: `g${Date.now()}`}); saveList('sgc_gallery', l); };

export const getResults = () => getList<Result>('sgc_results');
export const createResult = (data: any) => { const l = getResults(); l.push({...data, id: `r${Date.now()}`}); saveList('sgc_results', l); };

export const getAdmitCards = () => getList<AdmitCard>('sgc_admitcards');
export const createAdmitCard = (data: any) => { const l = getAdmitCards(); l.push({...data, id: `ac${Date.now()}`}); saveList('sgc_admitcards', l); };

export const getCertificates = () => getList<Certificate>('sgc_certificates');
export const createCertificate = (data: any) => { const l = getCertificates(); l.push({...data, id: `cert${Date.now()}`}); saveList('sgc_certificates', l); };

export const getMaterials = () => getList<StudyMaterial>('sgc_materials');
export const createMaterial = (data: any) => { const l = getMaterials(); l.push({...data, id: `mat${Date.now()}`}); saveList('sgc_materials', l); };

export const getAssignments = () => getList<Assignment>('sgc_assignments');
export const createAssignment = (data: any) => { const l = getAssignments(); l.push({...data, id: `ass${Date.now()}`}); saveList('sgc_assignments', l); };

export const getSettings = (): SiteSettings => {
  const defaults: SiteSettings = {
    headerText: 'SGC Skills & Computer Centre',
    footerText: '© 2024 SGCSC. All rights reserved.',
    facebookUrl: '#', instagramUrl: '#', youtubeUrl: '#', logoUrl: ''
  };
  return JSON.parse(localStorage.getItem('sgc_settings') || JSON.stringify(defaults));
};
export const saveSettings = (data: SiteSettings) => localStorage.setItem('sgc_settings', JSON.stringify(data));


// --- Stats ---
export const getDashboardStats = () => {
  return {
    totalFranchises: getFranchises().length,
    totalStudents: getStudents().length,
    totalCourses: getCourses().length,
    pendingApplications: getFranchises().filter(f => f.status === 'pending').length
  };
};

// --- Initialization ---
const initStorage = () => {
    if (!localStorage.getItem('sgc_courses')) {
        const initialCourses = [
            { id: '1', name: 'ADCA (Advance Diploma in Computer Application)', code: 'ADCA', duration: '12 Months', type: 'Long Term', fees: 12000, description: 'Complete computer mastery course.' },
            { id: '2', name: 'CCC (Course on Computer Concepts)', code: 'CCC', duration: '3 Months', type: 'Certificate', fees: 3000, description: 'Basic computer literacy.' },
        ];
        saveList('sgc_courses', initialCourses);
    }
    if (!localStorage.getItem('sgc_franchises')) {
        saveList('sgc_franchises', [{ 
            id: 'f1', instituteId: 'SGC001', instituteName: 'SGC Main Center', instituteOwnerName: 'Rajesh Kumar', 
            email: 'rajesh@sgc.com', contactNumber: '9876543210', city: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', 
            status: 'active', createdAt: '2023-01-01', username: 'franchise', address: '123 Main St'
        }]);
    }
    // Mock Student for the 'student' login
    if (!localStorage.getItem('sgc_students')) {
         saveList('sgc_students', [{
             id: 's1',
             centerName: 'SGC Main Center',
             franchiseId: 'f1',
             name: 'Rahul Singh',
             gender: 'Male',
             fatherName: 'Vikram Singh',
             motherName: 'Sunita Devi',
             dob: '2002-05-15',
             email: 'rahul@example.com',
             mobile: '9876543210',
             state: 'Uttar Pradesh',
             district: 'Lucknow',
             address: '45, Gomti Nagar',
             examPass: 'Yes',
             marksPercentage: '75',
             board: 'UP Board',
             year: '2020',
             courseId: '1',
             sessionStart: '2023',
             sessionEnd: '2024',
             enrollmentNo: 'SGC2023001',
             username: 'student',
             status: 'active',
             photo: ''
         }]);
    }
};
initStorage();
