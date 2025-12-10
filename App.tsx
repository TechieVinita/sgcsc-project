
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { Verification } from './pages/Verification';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Gallery } from './pages/Gallery';
import { Profile } from './pages/Profile';
// New Public Pages
import { FranchiseRegister, FranchiseList, FranchiseDetails } from './pages/FranchisePages';
import { AdmitCardDownload } from './pages/StudentPages';

import { AdminDashboard } from './pages/admin/Dashboard';
import { FranchiseManager } from './pages/admin/FranchiseManager';
import { StudentManager } from './pages/admin/StudentManager';
import { CourseManager } from './pages/admin/CourseManager';
import { 
  MemberManager, GalleryManager, ResultManager, AdmitCardManager, 
  CertificateManager, StudyMaterialManager, AssignmentManager, SettingsManager 
} from './pages/admin/Modules';
import { PublicLayout, AdminLayout } from './components/Layouts';
import { UserRole } from './types';
import { checkAuth } from './services/auth';

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles: UserRole[] }) => {
  const user = checkAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* Franchise Public Routes */}
          <Route path="/franchise/register" element={<FranchiseRegister />} />
          <Route path="/franchise/list" element={<FranchiseList />} />
          <Route path="/franchise/details" element={<FranchiseDetails />} />

          {/* Student Public Routes */}
          <Route path="/student/admit-card" element={<AdmitCardDownload />} />
          
          {/* Student Profile (Protected) */}
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><Profile /></ProtectedRoute>} />
          
          {/* Franchise Profile (Protected) - Rendered in Public Layout */}
          <Route path="/franchise/profile" element={<ProtectedRoute allowedRoles={[UserRole.FRANCHISE]}><Profile /></ProtectedRoute>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.FRANCHISE]}><AdminDashboard /></ProtectedRoute>} />
          
          {/* Shared Admin/Franchise Profile (Admin Layout context) */}
          <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><Profile /></ProtectedRoute>} />
          
          {/* Admin Only */}
          <Route path="/admin/franchises" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><FranchiseManager /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><CourseManager /></ProtectedRoute>} />
          <Route path="/admin/members" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><MemberManager /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><GalleryManager /></ProtectedRoute>} />
          <Route path="/admin/results" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><ResultManager /></ProtectedRoute>} />
          <Route path="/admin/admit-cards" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdmitCardManager /></ProtectedRoute>} />
          <Route path="/admin/certificates" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><CertificateManager /></ProtectedRoute>} />
          <Route path="/admin/materials" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><StudyMaterialManager /></ProtectedRoute>} />
          <Route path="/admin/assignments" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AssignmentManager /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><SettingsManager /></ProtectedRoute>} />

          {/* Shared Admin/Franchise */}
          <Route path="/admin/students" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.FRANCHISE]}><StudentManager /></ProtectedRoute>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
