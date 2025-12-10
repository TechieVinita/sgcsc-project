import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { Verification } from './pages/Verification';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { FranchiseManager } from './pages/admin/FranchiseManager';
import { StudentManager } from './pages/admin/StudentManager';
import { PublicLayout, AdminLayout } from './components/Layouts';
import { UserRole } from './types';
import { checkAuth } from './services/auth';

// Protected Route Component
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
          <Route path="/courses" element={<Courses />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<div className="p-10 text-center">Contact Page Placeholder</div>} />
          <Route path="/gallery" element={<div className="p-10 text-center">Gallery Page Placeholder</div>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/franchises" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <FranchiseManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.FRANCHISE]}>
                <StudentManager />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;