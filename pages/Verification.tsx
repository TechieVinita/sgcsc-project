
import React, { useState } from 'react';
import { Search, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { verifyStudent } from '../services/storage';
import { Student } from '../types';

export const Verification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'certificate' | 'franchise'>('student');
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setSearched(true);

    if (activeTab === 'student' || activeTab === 'certificate') {
      const student = verifyStudent(searchId);
      if (student) {
        setResult(student);
      } else {
        setError('No record found with the provided details.');
      }
    } else {
      setError('Franchise verification requires live backend.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Online Verification</h1>
          <p className="text-gray-600 mt-2">Verify enrollments, results, and certificates instantly.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'student', label: 'Student Enrollment' },
              { id: 'certificate', label: 'Certificate' },
              { id: 'franchise', label: 'Franchise' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearched(false); setSearchId(''); }}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab === 'student' ? 'Enter Enrollment Number' : 
                   activeTab === 'certificate' ? 'Certificate Number / Enrollment No' : 
                   'Franchise Code'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder={activeTab === 'student' ? 'e.g., SGC2023001' : 'Search ID...'}
                    required
                  />
                  <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>

            {searched && (
              <div className="mt-8 animate-fade-in">
                {error ? (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                ) : result ? (
                  <div className="border border-gray-200 rounded-lg p-6 bg-slate-50">
                    <div className="flex items-center gap-3 mb-6 text-green-700 bg-green-50 w-fit px-3 py-1 rounded-full text-sm font-medium border border-green-100">
                      <CheckCircle size={16} />
                      Record Verified
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Student Name</p>
                        <p className="font-semibold text-gray-900 text-lg">{result.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Enrollment No</p>
                        <p className="font-semibold text-gray-900">{result.enrollmentNo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Father's Name</p>
                        <p className="font-medium text-gray-800">{result.fatherName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Center Name</p>
                        <p className="font-medium text-gray-800">{result.centerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                        <p className="font-medium text-gray-800 capitalize">{result.status}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
