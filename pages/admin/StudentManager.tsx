
import React, { useState, useRef, useEffect } from 'react';
import { getStudents, createStudent, getCourses, getFranchises, uploadFile } from '../../services/storage';
import { checkAuth } from '../../services/auth';
import { Student, UserRole, Course, Franchise } from '../../types';
import { Plus, Search, X, Upload, Loader2 } from 'lucide-react';

export const StudentManager: React.FC = () => {
  const user = checkAuth();
  const isFranchise = user?.role === UserRole.FRANCHISE;
  
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      loadData();
  }, []);

  const loadData = async () => {
      setLoading(true);
      try {
          // Fetch all dependencies concurrently
          const [sData, cData, fData] = await Promise.all([
              getStudents(),
              getCourses(),
              getFranchises()
          ]);
          setStudents(sData);
          setCourses(cData);
          setFranchises(fData);
      } catch (err) {
          console.error("Error loading student data", err);
      } finally {
          setLoading(false);
      }
  };

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (!formData.franchiseId || !formData.courseId) {
        alert("Please select a franchise and a course.");
        setSaving(false);
        return;
    }
    
    try {
        await createStudent(formData);
        await loadData(); // Reload list
        setShowModal(false);
        // Reset form...
    } catch(err) {
        alert("Failed to save student.");
    } finally {
        setSaving(false);
    }
  };

  // REAL FILE UPLOAD FOR STUDENT PHOTO
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Upload immediately
        const url = await uploadFile(file);
        setFormData(prev => ({ ...prev, photo: url }));
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
        {loading ? <div className="p-8 text-center text-gray-500">Loading students...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Enrollment</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Center</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((s) => (
                <tr key={s.id || Math.random()} className="hover:bg-gray-50 transition">
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
                  <td className="px-6 py-4">{courses.find(c => c.id === s.courseId)?.code || '...'}</td>
                  <td className="px-6 py-4 text-xs">{s.franchiseId ? franchises.find(f => f.id === s.franchiseId)?.instituteName : s.centerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">Add Student (Live Database)</h2>
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
                        <div><label className="block text-sm text-gray-700 mb-1">Mobile</label><input required className="w-full border p-2 rounded-lg bg-white" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Username</label><input className="w-full border p-2 rounded-lg bg-white" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} /></div>
                        <div><label className="block text-sm text-gray-700 mb-1">Password</label><input type="password" className="w-full border p-2 rounded-lg bg-white" placeholder="Set Password" /></div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 bg-white">Cancel</button>
                        <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                             {saving && <Loader2 className="animate-spin" size={16} />} Save Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
