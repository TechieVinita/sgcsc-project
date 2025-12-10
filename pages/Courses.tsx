
import React, { useState, useEffect } from 'react';
import { getCourses } from '../services/storage';
import { Clock, Award } from 'lucide-react';
import { Course } from '../types';

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h1>
        </div>

        <div className="space-y-12">
          {['Long Term', 'Short Term', 'Certificate'].map((type) => {
            const typeCourses = courses.filter(c => c.type === type);
            if (typeCourses.length === 0) return null;

            return (
              <div key={type}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">{type} Courses</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold">
                          {course.code}
                        </div>
                        <span className="text-lg font-bold text-gray-900">₹{course.fees}</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h4>
                      <p className="text-gray-600 text-sm mb-6 h-20 overflow-hidden">{course.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award size={16} />
                          Certified
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
