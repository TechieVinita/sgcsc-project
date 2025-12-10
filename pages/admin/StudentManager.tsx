import React, { useState } from 'react';
import { getStudents, createStudent } from '../../services/storage';
import { Student } from '../../types';
import { Plus, Search, Filter } from 'lucide-react';

export const StudentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(getStudents());
  
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
          <p className="text-sm text-gray-500">Manage student enrollments and records.</p>
        </div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} /> New Admission
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
           <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name or enrollment no..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-gray-600 text-sm">
                <Filter size={16} /> Filters
            </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Enrollment No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Center</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{s.enrollmentNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {s.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{s.name}</div>
                            <div className="text-xs text-gray-400">{s.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{s.courseId}</td>
                  <td className="px-6 py-4 text-xs">{s.franchiseName}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                         s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                     }`}>
                         {s.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};