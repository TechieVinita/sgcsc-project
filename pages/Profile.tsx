
import React, { useState, useEffect } from 'react';
import { checkAuth } from '../services/auth';
import { getStudentById, getFranchiseById, getCourses } from '../services/storage';
import { UserRole, Student, Franchise, Course } from '../types';
import { User, MapPin, Phone, Mail, Calendar, BookOpen, Building, Hash, Award, Loader2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const user = checkAuth();
  const [student, setStudent] = useState<Student | null | undefined>(null);
  const [franchise, setFranchise] = useState<Franchise | null | undefined>(null);
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (user?.role === UserRole.STUDENT) {
            const s = await getStudentById(user.id);
            setStudent(s);
            if (s?.courseId) {
                const courses = await getCourses();
                setCourse(courses.find(c => c.id === s.courseId));
            }
        } else if (user?.role === UserRole.FRANCHISE) {
            const f = await getFranchiseById(user.id);
            setFranchise(f);
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadProfile();
    else setLoading(false);
  }, [user]);

  if (!user) return <div className="p-8 text-center">Please log in to view profile.</div>;
  if (loading) return <div className="p-16 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  // --- STUDENT PROFILE ---
  if (user.role === UserRole.STUDENT) {
    if (!student) return <div className="p-8 text-center">Student record not found.</div>;

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                 {student.photo ? (
                     <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                 ) : (
                     <User size={64} className="text-gray-300" />
                 )}
              </div>
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                    <p className="text-blue-600 font-medium">Student • {student.enrollmentNo}</p>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold border border-green-200 uppercase tracking-wide">
                    {student.status}
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {/* Academic Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Academic Information</h3>
                    <div className="space-y-4">
                        <InfoItem icon={BookOpen} label="Course" value={course ? `${course.name} (${course.code})` : 'N/A'} />
                        <InfoItem icon={Building} label="Study Center" value={student.centerName} />
                        <InfoItem icon={Calendar} label="Session" value={`${student.sessionStart} - ${student.sessionEnd}`} />
                        <InfoItem icon={Award} label="Qualification" value={`${student.examPass === 'Yes' ? 'Passed' : 'Pursuing'} (${student.board})`} />
                    </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Personal Details</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Father's Name" value={student.fatherName} />
                            <InfoItem label="Mother's Name" value={student.motherName} />
                        </div>
                        <InfoItem icon={Calendar} label="Date of Birth" value={student.dob} />
                        <InfoItem icon={Mail} label="Email" value={student.email} />
                        <InfoItem icon={Phone} label="Mobile" value={student.mobile} />
                        <InfoItem icon={MapPin} label="Address" value={`${student.address}, ${student.district}, ${student.state}`} />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FRANCHISE PROFILE (UPDATED TO MATCH STUDENT STYLE) ---
  if (user.role === UserRole.FRANCHISE) {
      if (!franchise) return <div className="p-8 text-center">Franchise record not found.</div>;

      return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 h-32 relative">
                    <div className="absolute -bottom-16 left-8">
                         <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                            {franchise.institutePhoto ? (
                                <img src={franchise.institutePhoto} alt="Institute" className="w-full h-full object-cover" />
                            ) : (
                                <Building size={64} className="text-gray-300" />
                            )}
                         </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <div className="flex justify-between items-start mb-6">
                         <div>
                             <h1 className="text-3xl font-bold text-gray-900">{franchise.instituteName}</h1>
                             <p className="text-blue-600 font-medium">Franchise Center • {franchise.instituteId}</p>
                         </div>
                         <div className={`px-4 py-1 rounded-full text-sm font-bold border uppercase tracking-wide ${
                            franchise.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 
                            franchise.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                            'bg-red-100 text-red-700 border-red-200'
                        }`}>
                            {franchise.status}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Center Info */}
                        <div className="space-y-6">
                             <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Center Information</h3>
                             <div className="space-y-4">
                                <InfoItem icon={Hash} label="Center Code" value={franchise.instituteId} />
                                <InfoItem icon={MapPin} label="Address" value={`${franchise.address}, ${franchise.district}, ${franchise.state}`} />
                                <InfoItem icon={Phone} label="Contact" value={franchise.contactNumber} />
                                <InfoItem icon={Mail} label="Email" value={franchise.email} />
                                <InfoItem icon={Building} label="Space" value={`${franchise.centerSpace} Sq. Ft.`} />
                             </div>
                        </div>

                        {/* Owner & Infra Info */}
                        <div className="space-y-6">
                             <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Owner & Infrastructure</h3>
                             <div className="space-y-4">
                                <InfoItem icon={User} label="Owner Name" value={franchise.instituteOwnerName} />
                                <InfoItem icon={Award} label="Qualification" value={franchise.headQualification || 'N/A'} />
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                     <StatCard label="Computers" value={franchise.totalComputers} />
                                     <StatCard label="Classrooms" value={franchise.numClassRooms} />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // Fallback for Admin
  return (
    <div className="p-8">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p>Logged in as Super Admin. Access full dashboard via the sidebar.</p>
    </div>
  );
};

// Helper Components
const InfoItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3">
        {Icon && <Icon size={18} className="text-gray-400 mt-0.5" />}
        <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-gray-900 font-medium">{value || '-'}</p>
        </div>
    </div>
);

const StatCard = ({ label, value }: any) => (
    <div className="bg-white border border-gray-200 p-3 rounded-lg text-center">
        <p className="text-xl font-bold text-gray-900">{value || 0}</p>
        <p className="text-[10px] text-gray-500 uppercase">{label}</p>
    </div>
);
