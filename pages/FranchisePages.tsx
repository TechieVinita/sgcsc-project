
import React, { useState } from 'react';
import { getFranchises, createFranchise } from '../services/storage';
import { Franchise } from '../types';
import { MapPin, Phone, Mail, CheckCircle, Building } from 'lucide-react';

export const FranchiseRegister: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState<Partial<Franchise>>({
        instituteName: '', instituteOwnerName: '', email: '', contactNumber: '', address: '',
        state: '', district: '', city: '', message: '' // message is extra for contact
    } as any);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send data to a queue. Here we create a "pending" franchise.
        createFranchise({
            ...formData,
            status: 'pending',
            username: `temp${Date.now()}`, // Temporary placeholder
            instituteId: `REQ${Math.floor(Math.random()*10000)}`
        });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600">
                        Thank you for your interest in joining SGCSC. Our team will review your application 
                        and contact you shortly at <strong>{formData.email}</strong> or <strong>{formData.contactNumber}</strong>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Franchise Application</h1>
                <p className="text-gray-600">Fill out the form below to apply for a new study center authorization.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Institute Name</label>
                        <input required className="w-full border p-3 rounded-lg" placeholder="e.g. SGC Computer Academy" value={formData.instituteName} onChange={e => setFormData({...formData, instituteName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                        <input required className="w-full border p-3 rounded-lg" placeholder="Full Name" value={formData.instituteOwnerName} onChange={e => setFormData({...formData, instituteOwnerName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" required className="w-full border p-3 rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input required className="w-full border p-3 rounded-lg" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
                    </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 pt-4 border-t border-gray-100">Location Details</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                        <input required className="w-full border p-3 rounded-lg" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input required className="w-full border p-3 rounded-lg" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                        <input required className="w-full border p-3 rounded-lg" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input required className="w-full border p-3 rounded-lg" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                </div>

                <div className="pt-6">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition">
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
};

export const FranchiseList: React.FC = () => {
    const franchises = getFranchises().filter(f => f.status === 'active');

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Study Centers</h1>
                    <p className="text-gray-600">Find an authorized SGC Skills & Computer Centre near you.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {franchises.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-200">
                            No active centers found at the moment.
                        </div>
                    ) : (
                        franchises.map(f => (
                            <div key={f.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <Building size={24} />
                                    </div>
                                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{f.instituteId}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.instituteName}</h3>
                                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Authorized Center
                                </p>
                                
                                <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                    <div className="flex gap-2">
                                        <MapPin size={16} className="shrink-0 text-gray-400" />
                                        <span>{f.address}, {f.district}, {f.state}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Phone size={16} className="shrink-0 text-gray-400" />
                                        <span>{f.contactNumber}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Mail size={16} className="shrink-0 text-gray-400" />
                                        <span>{f.email}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export const FranchiseDetails: React.FC = () => {
    return (
        <div className="py-16 px-4 max-w-4xl mx-auto">
             <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Why Partner With Us?</h1>
             <div className="prose lg:prose-xl mx-auto text-gray-600 space-y-8">
                <p>
                    SGC Skills & Computer Centre offers a unique franchise opportunity for educational entrepreneurs. 
                    By joining our network, you gain access to a proven business model, standardized curriculum, 
                    and national recognition.
                </p>
                <div className="grid md:grid-cols-2 gap-8 not-prose">
                    {[
                        { title: 'Brand Value', desc: 'Leverage our established brand reputation to attract students.' },
                        { title: 'Curriculum Support', desc: 'Access to up-to-date syllabus, study materials, and exam patterns.' },
                        { title: 'Technical Assistance', desc: 'Full support for setting up labs, software, and online portals.' },
                        { title: 'Marketing Aid', desc: 'Guidance on local marketing, admission strategies, and branding.' },
                        { title: 'Certification', desc: 'Authority to issue valid, recognized certificates to your students.' },
                        { title: 'Low Investment', desc: 'Start your center with minimal capital and maximize returns.' }
                    ].map((item, i) => (
                        <div key={i} className="bg-blue-50 p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">{item.title}</h3>
                            <p className="text-blue-800/80 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center pt-8">
                    <p className="mb-4">Ready to start your journey?</p>
                    <a href="#/franchise/register" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Apply Now</a>
                </div>
             </div>
        </div>
    );
};
