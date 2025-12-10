
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Award, CheckCircle, Users, Building } from 'lucide-react';
import { getCourses } from '../services/storage';

export const Home: React.FC = () => {
  const featuredCourses = getCourses().slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-10 pattern-dots"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
            {/* CLEANED UP HERO: Only Title and Gov Reg info */}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-8">
            SHREE GANPATI COMPUTER AND STUDY CENTRE
            </h1>
            <div className="text-lg text-slate-300 space-y-4 max-w-2xl mx-auto">
            <p className="font-medium text-white text-xl">
                An Autonomous Regd. Under the Public Trust Act 1882 Govt. of India.
            </p>
            <p className="text-base text-slate-400 py-2 border-y border-white/10">
                Registered Under NITI Aayog & Ministry of MSME Govt. of India.<br/>
                An ISO 9001:2015 Certified Organization.
            </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-10">
            <Link to="/courses" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-900/50 transition flex items-center gap-2">
                Explore Courses <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold rounded-lg border border-white/10 transition">
                Contact Us
            </Link>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Students Trained', value: '10,000+', icon: Users },
              { label: 'Certified Courses', value: '50+', icon: BookOpen },
              { label: 'Franchise Centers', value: '120+', icon: Building },
              { label: 'Years Experience', value: '15+', icon: Award },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900">{stat.value}</h4>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Popular Courses</h2>
          <p className="text-gray-600">
            Choose from a wide range of certificate and diploma courses designed to boost your career prospects.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-48 bg-slate-100 relative">
                <img src={`https://picsum.photos/400/200?random=${course.id}`} alt={course.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm">
                  {course.type}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{course.name}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1">{course.description}</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1 text-gray-600"><CheckCircle size={14} className="text-green-500"/> {course.duration}</span>
                    <span className="font-semibold text-blue-600">₹{course.fees.toLocaleString()}</span>
                  </div>
                  <Link to="/courses" className="block w-full text-center py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
            View All Courses <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      
      {/* Franchise CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/30">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Start Your Own Education Center</h2>
            <p className="text-blue-100 text-lg">Join the SGC network. Low investment, high returns, and full technical support provided.</p>
          </div>
          <Link to="/franchise/register" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg whitespace-nowrap">
            Apply for Franchise
          </Link>
        </div>
      </section>
    </div>
  );
};
