
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, Building, BookOpen, LogOut, ChevronDown, UserCog, Image, Award, FileText, ClipboardList, Settings, StickyNote, LogIn, User } from 'lucide-react';
import { checkAuth, logout } from '../services/auth';
import { UserRole } from '../types';

// --- Shared Components ---
const UserProfileDropdown = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    if (!user) return null;

    // Determine profile link based on role
    let profileLink = '/admin/profile';
    if (user.role === UserRole.STUDENT) profileLink = '/student/profile';
    if (user.role === UserRole.FRANCHISE) profileLink = '/franchise/profile';

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button className="flex items-center gap-2 focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                    <User size={20} />
                </div>
            </button>
            
            {isOpen && (
                <div className="absolute right-0 top-full pt-2 w-48 z-50">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user.role.toLowerCase()}</p>
                        </div>
                        <Link to={profileLink} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                            My Profile
                        </Link>
                        {user.role !== UserRole.STUDENT && (
                            <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                                Dashboard
                            </Link>
                        )}
                        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Public Layout ---
export const PublicLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const location = useLocation();
  const user = checkAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Company', path: '/about' },
    { name: 'Our Courses', path: '/courses' }, // Direct link, no dropdown
    {
      name: 'Franchise',
      children: [
        { name: 'Franchise Verification', path: '/verification?tab=franchise' },
        { name: 'Franchise List', path: '/franchise/list' },
      ]
    },
    {
      name: 'Student',
      children: [
        { name: 'Enrollment Verification', path: '/verification?tab=enrollment' },
        { name: 'Result Verification', path: '/verification?tab=result' },
        { name: 'Certificate Verification', path: '/verification?tab=certificate' },
        { name: 'Admit Card', path: '/student/admit-card' },
      ]
    },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleMobileDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  
  // Mobile menu profile link logic
  let mobileProfileLink = '/admin/profile';
  if (user?.role === UserRole.STUDENT) mobileProfileLink = '/student/profile';
  if (user?.role === UserRole.FRANCHISE) mobileProfileLink = '/franchise/profile';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo Section */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/logo.png" 
                alt="SGCSC" 
                className="h-20 w-auto object-contain"
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
                    <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
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

            {/* Desktop Auth Buttons / Profile */}
            <div className="hidden lg:flex items-center gap-3">
               {user ? (
                   <UserProfileDropdown user={user} onLogout={logout} />
               ) : (
                   /* Login Dropdown */
                   <div className="relative" onMouseEnter={() => setIsLoginDropdownOpen(true)} onMouseLeave={() => setIsLoginDropdownOpen(false)}>
                      <button className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                        <LogIn size={16} />
                        Login
                        <ChevronDown size={14} />
                      </button>
                      
                      {isLoginDropdownOpen && (
                        <div className="absolute right-0 top-full pt-2 w-48 z-50">
                          <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-2">
                             <Link to="/login?role=student" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                <Users size={16} /> Student Login
                             </Link>
                             <Link to="/login?role=franchise" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                <Building size={16} /> Franchise Login
                             </Link>
                             <div className="border-t border-gray-100 my-1"></div>
                             <Link to="/login?role=admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                <UserCog size={16} /> Admin Login
                             </Link>
                          </div>
                        </div>
                      )}
                   </div>
               )}
            </div>

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
              
              <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
                 <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Access</p>
                 {user ? (
                     <>
                        <Link to={mobileProfileLink} className="block px-4 py-3 text-base font-bold text-blue-600 bg-blue-50 rounded-lg">My Profile</Link>
                        <button onClick={logout} className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
                     </>
                 ) : (
                     <>
                        <Link to="/login?role=student" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Student Login</Link>
                        <Link to="/login?role=franchise" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Franchise Login</Link>
                        <Link to="/login?role=admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Admin Login</Link>
                     </>
                 )}
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 font-sans border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Column 1: Important Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                Important Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="/courses" className="hover:text-blue-400 transition-colors">Long Term Courses</Link></li>
                <li><Link to="/courses" className="hover:text-blue-400 transition-colors">Short Term Courses</Link></li>
                <li><Link to="/courses" className="hover:text-blue-400 transition-colors">Basic Courses</Link></li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/franchise/register" className="hover:text-blue-400 transition-colors">Franchise Registration</Link></li>
                <li><Link to="/verification?tab=result" className="hover:text-blue-400 transition-colors">Result Verification</Link></li>
                <li><Link to="/verification?tab=certificate" className="hover:text-blue-400 transition-colors">Certificate Verification</Link></li>
                <li><Link to="/login?role=franchise" className="hover:text-blue-400 transition-colors">Franchise Login</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Us */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex flex-col gap-1">
                   <span className="text-white font-medium">Address:</span>
                   <span className="text-slate-400">Raipur (Chiraiyakot), Mau, Uttar Pradesh, India</span>
                </li>
                <li className="flex flex-col gap-1">
                   <span className="text-white font-medium">Phone:</span>
                   <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">+91 9889624850</span>
                </li>
                <li className="flex flex-col gap-1">
                   <span className="text-white font-medium">Email:</span>
                   <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">ajayamaurya@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
            <p>© 2025 S.G.C.S.C™ All Rights Reserved</p>
            <div className="flex gap-6">
              <span className="cursor-pointer hover:text-white transition-colors">Disclaimer</span>
              <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
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
        // Add Profile link in sidebar for easy access - this still points to Admin layout view which is fine for admin panel
        { name: 'My Profile', path: '/admin/profile', icon: UserCog },
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
          {/* Add Profile Dropdown to Admin Header as well */}
          <div className="flex items-center gap-4">
              {user && <UserProfileDropdown user={user} onLogout={logout} />}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
