
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, Building, BookOpen, LogOut, ChevronDown, UserCog, Image, Award, FileText, ClipboardList, Settings, StickyNote } from 'lucide-react';
import { checkAuth, logout } from '../services/auth';
import { UserRole } from '../types';

// --- Public Layout ---
export const PublicLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Company', path: '/about' },
    {
      name: 'Our Courses',
      children: [
        { name: 'Long Term Courses (1 Year)', path: '/courses?type=Long Term' },
        { name: 'Short Term Courses (6 Months)', path: '/courses?type=Short Term' },
        { name: 'Certificate Courses (3 Months)', path: '/courses?type=Certificate' },
      ]
    },
    {
      name: 'Franchise',
      children: [
        { name: 'Franchise Registration Online', path: '/franchise/register' },
        { name: 'Franchise Details', path: '/franchise/details' },
        { name: 'Franchise Verification', path: '/verification?tab=franchise' },
        { name: 'Study Center List', path: '/franchise/list' },
        { name: 'Center Login', path: '/login' },
      ]
    },
    {
      name: 'Student',
      children: [
        { name: 'Enrollment Verification', path: '/verification?tab=enrollment' },
        { name: 'Result Verification', path: '/verification?tab=result' },
        { name: 'Certificate Verification', path: '/verification?tab=certificate' },
        { name: 'Admit Card', path: '/student/admit-card' },
        { name: 'Student Login', path: '/login' },
      ]
    },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleMobileDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo Section - IMAGE ONLY, NO TEXT */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/logo.png" 
                alt="SGCSC" 
                className="h-20 w-auto object-contain" // Adjusted size for better visibility
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-1 items-center">
              {navItems.map((item) => (
                <div key={item.name} className="relative group px-1">
                  {item.children ? (
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md transition-colors group-hover:bg-blue-50">
                      {item.name}
                      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                  ) : (
                    <Link
                      to={item.path!}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.path ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Desktop Dropdown Menu */}
                  {item.children && (
                    <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600 transition-all"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white absolute w-full left-0 z-40 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => handleMobileDropdown(item.name)}
                        className="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        {item.name}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="bg-gray-50 rounded-lg mt-1 space-y-1 p-2 ml-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-md"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
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
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
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
