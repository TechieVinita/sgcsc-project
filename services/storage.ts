
import { Franchise, Student, Course, Subject, InstituteMember, GalleryItem, Result, AdmitCard, Certificate, StudyMaterial, Assignment, SiteSettings } from '../types';
import { getAuthHeaders } from './auth';

const API_URL = 'http://localhost:5000/api';

// --- HELPER: File Upload ---
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
      const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData // No headers needed, browser sets multipart
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return `${API_URL}${data.filePath}`; // Return full URL
  } catch (error) {
      console.error("Upload error", error);
      return '';
  }
};

// --- API WRAPPERS ---

// --- Franchises ---
export const getFranchises = async (): Promise<Franchise[]> => {
  const res = await fetch(`${API_URL}/franchises`, { headers: getAuthHeaders() });
  return await res.json();
};

export const createFranchise = async (data: any): Promise<Franchise> => {
  const res = await fetch(`${API_URL}/franchises`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create franchise");
  return await res.json();
};

// --- Students ---
export const getStudents = async (): Promise<Student[]> => {
  const res = await fetch(`${API_URL}/students`, { headers: getAuthHeaders() });
  return await res.json();
};

export const createStudent = async (data: any): Promise<Student> => {
  const res = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create student");
  return await res.json();
};

// --- Courses ---
export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_URL}/courses`);
  return await res.json();
};

export const createCourse = async (data: any): Promise<Course> => {
   const res = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return await res.json();
};

// --- ASYNC HELPERS (Added to fix component errors) ---
export const verifyStudent = async (searchId: string): Promise<Student | undefined> => {
    const students = await getStudents();
    return students.find(s => s.enrollmentNo === searchId);
};

export const getStudentById = async (userId: string): Promise<Student | undefined> => {
    const students = await getStudents();
    return students.find(s => s.id === userId || (s as any).userId === userId);
};

export const getFranchiseById = async (userId: string): Promise<Franchise | undefined> => {
    const franchises = await getFranchises();
    return franchises.find(f => f.id === userId || (f as any).userId === userId);
};

// --- MOCK FALLBACKS (For modules we haven't built backend routes for yet) ---
// These still use LocalStorage until you add routes in server/routes.js for them

const getList = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const saveList = <T>(key: string, list: T[]) => localStorage.setItem(key, JSON.stringify(list));

export const getSubjects = (courseId?: string): Subject[] => {
  const list = getList<Subject>('sgc_subjects');
  return courseId ? list.filter(s => s.courseId === courseId) : list;
};
export const createSubject = (data: any) => {
  const list = getSubjects();
  list.push({ ...data, id: `sub${Date.now()}` });
  saveList('sgc_subjects', list);
};

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

export const getDashboardStats = () => {
    // Mock stats for dashboard to prevent crash, ideally fetch from API
    return {
        totalFranchises: 0,
        totalStudents: 0,
        totalCourses: 0,
        pendingApplications: 0
    };
};
