
import React, { useState } from 'react';
import { getCourses, createCourse, getSubjects, createSubject } from '../../services/storage';
import { Course, Subject } from '../../types';
import { Plus, ChevronDown, ChevronRight, Book } from 'lucide-react';

export const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(getCourses());
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // Forms
  const [courseForm, setCourseForm] = useState<Partial<Course>>({ name: '', duration: '', code: '', fees: 0, description: '', type: 'Long Term' });
  const [subjectForm, setSubjectForm] = useState<Partial<Subject>>({ name: '', maxMarks: 100, minMarks: 33 });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    createCourse(courseForm);
    setCourses(getCourses());
    setShowCourseModal(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    createSubject({ ...subjectForm, courseId: selectedCourseId });
    setExpandedCourse(selectedCourseId); // Force update visually if needed
    setShowSubjectModal(false);
    setSubjectForm({ name: '', maxMarks: 100, minMarks: 33 });
  };

  const SubjectsList = ({ courseId }: { courseId: string }) => {
    const subjects = getSubjects(courseId);
    return (
        <div className="pl-12 pr-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subjects</h5>
                <button onClick={() => { setSelectedCourseId(courseId); setShowSubjectModal(true); }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Subject</button>
            </div>
            {subjects.length > 0 ? (
                <ul className="space-y-2">
                    {subjects.map(sub => (
                        <li key={sub.id} className="flex justify-between text-sm bg-white p-2 rounded border border-gray-200">
                            <span>{sub.name}</span>
                            <span className="text-gray-500 text-xs">Max: {sub.maxMarks} / Min: {sub.minMarks}</span>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-xs text-gray-400 italic">No subjects added yet.</p>}
        </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Courses & Subjects</h1><p className="text-sm text-gray-500">Manage curriculum structure.</p></div>
        <button onClick={() => setShowCourseModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"><Plus size={18} /> Create Course</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {courses.map(course => (
            <div key={course.id} className="border-b border-gray-100 last:border-0">
                <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                >
                    <div className="flex items-center gap-3">
                        {expandedCourse === course.id ? <ChevronDown size={18} className="text-gray-400"/> : <ChevronRight size={18} className="text-gray-400"/>}
                        <div className="bg-blue-100 p-2 rounded text-blue-600"><Book size={18} /></div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{course.name}</h4>
                            <p className="text-xs text-gray-500">{course.duration} • {course.type}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-mono">₹{course.fees}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{course.code}</span>
                    </div>
                </div>
                {expandedCourse === course.id && <SubjectsList courseId={course.id} />}
            </div>
        ))}
      </div>

      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Create New Course</h2>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                    <input required className="w-full border p-2 rounded" placeholder="Course Name" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input required className="w-full border p-2 rounded" placeholder="Code (e.g. ADCA)" value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value})} />
                        <input required className="w-full border p-2 rounded" placeholder="Duration (e.g. 1 Year)" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} />
                    </div>
                    <select className="w-full border p-2 rounded" value={courseForm.type} onChange={e => setCourseForm({...courseForm, type: e.target.value as any})}><option>Long Term</option><option>Short Term</option><option>Certificate</option></select>
                    <input type="number" required className="w-full border p-2 rounded" placeholder="Fees" value={courseForm.fees || ''} onChange={e => setCourseForm({...courseForm, fees: parseInt(e.target.value)})} />
                    <textarea className="w-full border p-2 rounded" placeholder="Description" rows={3} value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})}></textarea>
                    <div className="flex gap-2 pt-2"><button type="button" onClick={() => setShowCourseModal(false)} className="flex-1 border p-2 rounded">Cancel</button><button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Create</button></div>
                </form>
            </div>
        </div>
      )}

      {showSubjectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Add Subject</h2>
                <form onSubmit={handleCreateSubject} className="space-y-4">
                    <input required className="w-full border p-2 rounded" placeholder="Subject Name" value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs">Max Marks</label><input type="number" className="w-full border p-2 rounded" value={subjectForm.maxMarks} onChange={e => setSubjectForm({...subjectForm, maxMarks: parseInt(e.target.value)})} /></div>
                        <div><label className="text-xs">Min Marks</label><input type="number" className="w-full border p-2 rounded" value={subjectForm.minMarks} onChange={e => setSubjectForm({...subjectForm, minMarks: parseInt(e.target.value)})} /></div>
                    </div>
                     <div className="flex gap-2 pt-2"><button type="button" onClick={() => setShowSubjectModal(false)} className="flex-1 border p-2 rounded">Cancel</button><button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Add</button></div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};
