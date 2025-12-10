
import React, { useState, useRef } from 'react';
import { getStudents, createStudent, getCourses, getFranchises } from '../../services/storage';
import { checkAuth } from '../../services/auth';
import { Student, UserRole } from '../../types';
import { Plus, Search, Filter, X, Upload } from 'lucide-react';

export const StudentManager: React.FC = () => {
  const user = checkAuth();
  const isFranchise = user?.role === UserRole.FRANCHISE;
  const initialStudents = getStudents(isFranchise ? user?.franchiseId : undefined);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    fatherName: '',
    motherName: '',
    email: '',
    mobile: '',
    gender: 'Male',
    dob: '',
    state: '',
    district: '',
    address: '',
    examPass: 'No',
    marksPercentage: '',
    board: '',
    year: '',
    username: '',
    courseId: '',
    franchiseId: isFranchise ? user?.franchiseId : '',
    sessionStart: '',
    sessionEnd: '',
    status: 'active',
    enrollmentNo: `SGC${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`,
    photo: ''
  });

  const courses = getCourses();
  const franchises = getFranchises();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.franchiseId || !formData.courseId) {
        alert("Please select a franchise and a course.");
        return;
    }
    createStudent(formData as any);
    setStudents(getStudents(isFranchise ? user?.franchiseId : undefined));
    setShowModal(false);
    // Reset form logic would go here
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, photo: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
          <p className="text-sm text-gray-500">Manage all student enrollments.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
           <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search name or enrollment..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Enrollment</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Center</th>
                <th className="px-6 py-4">Session</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                      {s.photo ? (
                          <img src={s.photo} alt={s.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                      ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                      )}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{s.enrollmentNo}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.mobile}</div>
                  </td>
                  <td className="px-6 py-4">{courses.find(c => c.id === s.courseId)?.code}</td>
                  <td className="px-6 py-4 text-xs">{s.centerName}</td>
                  <td className="px-6 py-4 text-xs">{s.sessionStart} - {s.sessionEnd}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">Add Student</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleCreate} className="p-6 space-y-6">
                    {/* Photo Upload Section */}
                    <div className="flex justify-center mb-2">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handlePhotoChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition overflow-hidden relative bg-white group"
                        >
                            {formData.photo ? (
                                <>
                                    <img src={formData.photo} alt="Student" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-medium">Change</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload className="text-gray-400 mb-1" size={24} />
                                    <span className="text-xs text-gray-500 font-medium">Upload Photo</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                             <select required disabled={isFranchise} className="w-full border p-2 rounded-lg bg-white disabled:bg-gray-100" value={formData.franchiseId} onChange={e => setFormData({...formData, franchiseId: e.target.value})}>
                                <option value="">Select Center</option>
                                {franchises.map(f => <option key={f.id} value={f.id}>{f.instituteName}</option>)}
                            </select>
                        </div>
                         <div className="md:col-span-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                             <select required className="w-full border p-2 rounded-lg bg-white" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}>
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                         <div className="md:col-span-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                             <input required className="w-full border p-2 rounded-lg bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div><label className="block text-sm text-gray-700 mb-1">Father's Name</label><input required className="w-full border p-2 rounded-lg bg-white" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Mother's Name</label><input required className="w-full border p-2 rounded-lg bg-white" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Gender</label><select className="w-full border p-2 rounded-lg bg-white" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}><option>Male</option><option>Female</option></select></div>
                        <div><label className="block text-sm text-gray-700 mb-1">DOB</label><input type="date" required className="w-full border p-2 rounded-lg bg-white" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Mobile</label><input required className="w-full border p-2 rounded-lg bg-white" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Email</label><input type="email" required className="w-full border p-2 rounded-lg bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                         <div><label className="block text-sm text-gray-700 mb-1">State</label><input required className="w-full border p-2 rounded-lg bg-white" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} /></div>
                         <div><label className="block text-sm text-gray-700 mb-1">District</label><input required className="w-full border p-2 rounded-lg bg-white" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} /></div>
                         <div><label className="block text-sm text-gray-700 mb-1">Address</label><input required className="w-full border p-2 rounded-lg bg-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                    </div>

                    <h4 className="font-semibold text-gray-900 border-b pb-2">Previous Qualification</h4>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div><label className="block text-sm text-gray-700 mb-1">Exam Passed?</label><select className="w-full border p-2 rounded-lg bg-white" value={formData.examPass} onChange={e => setFormData({...formData, examPass: e.target.value as any})}><option>Yes</option><option>No</option></select></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Marks %</label><input className="w-full border p-2 rounded-lg bg-white" value={formData.marksPercentage} onChange={e => setFormData({...formData, marksPercentage: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Board/University</label><input className="w-full border p-2 rounded-lg bg-white" value={formData.board} onChange={e => setFormData({...formData, board: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Passing Year</label><input className="w-full border p-2 rounded-lg bg-white" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
                    </div>

                    <h4 className="font-semibold text-gray-900 border-b pb-2">Session Info</h4>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div><label className="block text-sm text-gray-700 mb-1">Session Start</label><input className="w-full border p-2 rounded-lg bg-white" value={formData.sessionStart} onChange={e => setFormData({...formData, sessionStart: e.target.value})} placeholder="e.g. 2023" /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Session End</label><input className="w-full border p-2 rounded-lg bg-white" value={formData.sessionEnd} onChange={e => setFormData({...formData, sessionEnd: e.target.value})} placeholder="e.g. 2024" /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Username</label><input className="w-full border p-2 rounded-lg bg-white" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Password</label><input type="password" className="w-full border p-2 rounded-lg bg-white" placeholder="Set Password" /></div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 bg-white">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Student</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
