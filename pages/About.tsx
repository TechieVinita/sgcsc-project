import React from 'react';
import { Award, Target, Users, BookOpen, CheckCircle } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About SGCSC</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Empowering the next generation with cutting-edge technical skills and professional certification.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                    <p>
                        Established in 2010, SGC Skills & Computer Centre (SGCSC) has grown from a single training center 
                        to a network of over 100+ franchises across the state. Our mission has always been simple: 
                        to make high-quality computer education accessible and affordable for everyone.
                    </p>
                    <p>
                        We are ISO 9001:2015 certified and recognized by various government and private bodies. 
                        Our curriculum is constantly updated to meet industry standards, ensuring our students 
                        are job-ready from day one.
                    </p>
                </div>
            </div>
            <div className="relative">
                <img 
                    src="https://picsum.photos/600/400?grayscale&blur=2" 
                    alt="About SGCSC" 
                    className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg hidden md:block">
                    <p className="text-4xl font-bold">15+</p>
                    <p className="text-sm font-medium uppercase tracking-wider">Years of Excellence</p>
                </div>
            </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
                { title: 'Our Mission', icon: Target, desc: 'To provide affordable, quality technical education to rural and urban youth, making them employable and self-reliant.' },
                { title: 'Our Vision', icon: Award, desc: 'To be the leading skill development network in the country, known for excellence in training and certification.' },
                { title: 'Our Values', icon: Users, desc: 'Integrity, Innovation, and Inclusiveness are the core pillars of our educational philosophy.' },
            ].map((item, i) => {
                const Icon = item.icon;
                return (
                    <div key={i} className="bg-slate-50 p-8 rounded-xl border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                );
            })}
        </div>

        {/* Objectives */}
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Core Objectives</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {[
                    "To promote computer literacy in every corner of society.",
                    "To provide vocational training that leads to direct employment.",
                    "To support women empowerment through special skill batches.",
                    "To assist students in placement and entrepreneurship."
                ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="text-blue-300 shrink-0 mt-1" size={20} />
                        <span className="text-blue-50 text-lg">{obj}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};