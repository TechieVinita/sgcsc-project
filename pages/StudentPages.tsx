
import React, { useState } from 'react';
import { getAdmitCards } from '../services/storage';
import { AdmitCard } from '../types';
import { Search, Download, Calendar, MapPin, AlertCircle } from 'lucide-react';

export const AdmitCardDownload: React.FC = () => {
    const [enrollment, setEnrollment] = useState('');
    const [card, setCard] = useState<AdmitCard | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        const found = getAdmitCards().find(c => c.enrollmentNo === enrollment);
        setCard(found || null);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Download Admit Card</h1>
                    <p className="text-gray-600 mt-2">Enter your enrollment number to access your exam hall ticket.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input 
                            required
                            type="text" 
                            value={enrollment}
                            onChange={e => setEnrollment(e.target.value)}
                            placeholder="Enrollment No (e.g. SGC2024...)" 
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                            <Search size={20} /> Search
                        </button>
                    </form>
                </div>

                {searched && (
                    <div className="animate-fade-in">
                        {card ? (
                            <div className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden shadow-lg relative">
                                <div className="bg-blue-600 text-white p-4 text-center">
                                    <h3 className="font-bold text-lg">Admit Card</h3>
                                    <p className="text-blue-100 text-sm">Session 2024-2025</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Enrollment No</p>
                                            <p className="font-mono font-bold text-lg text-gray-900">{card.enrollmentNo}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Roll Number</p>
                                            <p className="font-mono font-bold text-lg text-gray-900">{card.rollNo}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex gap-3">
                                            <div className="bg-blue-50 p-2 rounded text-blue-600 h-fit"><Calendar size={20} /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Date & Time</p>
                                                <p className="text-sm text-gray-600">{card.examDate} | {card.examTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="bg-blue-50 p-2 rounded text-blue-600 h-fit"><MapPin size={20} /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Exam Center</p>
                                                <p className="text-sm text-gray-600">{card.examCenter}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded-lg text-xs text-yellow-800 border border-yellow-100">
                                        <strong>Instructions:</strong> Please bring a valid ID proof along with this admit card. Reporting time is 30 mins before the exam.
                                    </div>

                                    <button onClick={() => window.print()} className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition flex items-center justify-center gap-2">
                                        <Download size={18} /> Print / Download
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-100 justify-center">
                                <AlertCircle size={20} />
                                Admit card not generated or invalid enrollment number.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
