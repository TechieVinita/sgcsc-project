
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { GraduationCap, Lock, User as UserIcon, Loader2, Building, UserCog, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get Role from URL, default to generic "Login"
  const roleParam = searchParams.get('role');
  const roleTitle = roleParam ? `${roleParam.charAt(0).toUpperCase() + roleParam.slice(1)}` : 'User';

  // Determine Icon based on role
  const RoleIcon = roleParam === 'admin' ? UserCog : roleParam === 'franchise' ? Building : GraduationCap;
  const showRegisterToggle = roleParam !== 'admin'; // Admin cannot register via public UI

  // Reset mode when role changes
  useEffect(() => {
    setIsRegisterMode(false);
    setError('');
    setUsername('');
    setPassword('');
  }, [roleParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(username, password);
      // Redirect based on role or previous location
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from);
      } else {
        if (user.role === 'ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'FRANCHISE') navigate('/franchise/profile'); // Redirect to Public Profile (with Header)
        else navigate('/student/profile'); // Redirect to Profile
      }
    } catch (err) {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock Registration Logic
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          alert("Registration successful! Please login.");
          setIsRegisterMode(false);
      }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition">
            <ArrowLeft size={24} />
        </Link>
        
        <div className="text-center mb-6 pt-4">
            <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                <RoleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
                {isRegisterMode ? `Sign Up as ${roleTitle}` : `${roleTitle} Login`}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
                {roleParam === 'franchise' ? 'Manage your center operations.' : 
                 roleParam === 'student' ? 'Access your academic records.' : 
                 'Secure administrative access.'}
            </p>
        </div>

        {/* Toggle Switch */}
        {showRegisterToggle && (
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button 
                    onClick={() => setIsRegisterMode(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isRegisterMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => setIsRegisterMode(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isRegisterMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Sign Up
                </button>
            </div>
        )}

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                {error}
            </div>
        )}

        {/* FRANCHISE REGISTRATION SPECIAL CASE */}
        {isRegisterMode && roleParam === 'franchise' ? (
             <div className="text-center space-y-4 py-4">
                 <p className="text-gray-600 text-sm">Franchise registration requires detailed verification details.</p>
                 <Link to="/franchise/register" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                     Go to Application Form
                 </Link>
                 <p className="text-xs text-gray-400">You will be redirected to the full registration page.</p>
             </div>
        ) : (
            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
            
            {/* Extra Fields for Student Registration */}
            {isRegisterMode && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input required type="text" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="John Doe" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input required type="email" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="john@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input required type="tel" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="+91..." />
                        </div>
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        placeholder="Enter username"
                        required
                    />
                </div>
            </div>
            <div>
                <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        placeholder="Enter password"
                        required
                    />
                </div>
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-2"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isRegisterMode ? 'Create Account' : 'Sign In')}
            </button>
            </form>
        )}

        {/* Demo Hints */}
        {!roleParam && !isRegisterMode && (
             <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                    Demo: Admin (admin/admin), Franchise (franchise/franchise), Student (student/student)
                </p>
            </div>
        )}
      </div>
    </div>
  );
};
