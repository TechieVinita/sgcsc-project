
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, LayoutDashboard, Users, Building, BookOpen, FileCheck, LogOut, ChevronDown, UserCog, Image, Award, FileText, ClipboardList, Settings, StickyNote } from 'lucide-react';
import { checkAuth, logout } from '../services/auth';
import { UserRole } from '../types';

// --- Public Layout ---
export const PublicLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Verification', path: '/verification' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">SGCSC</h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">Skills & Computer Centre</p>
              </div>
            </Link>
            <nav className="hidden md:flex gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/login" className="ml-4 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm">
                Login
              </Link>
            </nav>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" className="block w-full text-center mt-4 px-5 py-3 text-base font-medium text-white bg-blue-600 rounded-md">
              Login
            </Link>
          </div>
        )}
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} SGCSC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// --- Admin Layout ---
export const AdminLayout: React.FC = () => {
  const user = checkAuth();
  const location = useLocation();
  const isAdmin = user?.role === UserRole.ADMIN;

  const sidebarGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ]
    },
    ...(isAdmin ? [
      {
        title: 'Management',
        items: [
          { name: 'Franchise', path: '/admin/franchises', icon: Building },
          { name: 'Students', path: '/admin/students', icon: Users },
          { name: 'Courses', path: '/admin/courses', icon: BookOpen },
          { name: 'Members', path: '/admin/members', icon: UserCog },
        ]
      },
      {
        title: 'Academics & Content',
        items: [
          { name: 'Gallery', path: '/admin/gallery', icon: Image },
          { name: 'Results', path: '/admin/results', icon: FileText },
          { name: 'Admit Cards', path: '/admin/admit-cards', icon: ClipboardList },
          { name: 'Certificates', path: '/admin/certificates', icon: Award },
          { name: 'Study Material', path: '/admin/materials', icon: BookOpen },
          { name: 'Assignments', path: '/admin/assignments', icon: StickyNote },
        ]
      },
      {
        title: 'System',
        items: [
          { name: 'Settings', path: '/admin/settings', icon: Settings },
        ]
      }
    ] : [
        // Franchise View
        {
            title: 'Management',
            items: [
              { name: 'Students', path: '/admin/students', icon: Users },
            ]
        }
    ]),
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col overflow-y-auto">
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800 sticky top-0 z-10">
          <span className="text-white font-bold text-lg tracking-wide">SGC Admin</span>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-8">
            {sidebarGroups.map((group, idx) => (
                <div key={idx}>
                    <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{group.title}</h3>
                    <div className="space-y-1">
                        {group.items.map((link) => {
                            const Icon = link.icon;
                            const active = location.pathname.startsWith(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    active ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <Icon size={18} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-red-600 rounded-md transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {location.pathname.split('/')[2]?.replace('-', ' ')}
          </h2>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
