
import React, { useState, useRef } from 'react';
import { Plus, Search, Trash2, Download, X, Upload, FileText, Eye, Calendar, MapPin, User, Image as ImageIcon } from 'lucide-react';
import {
  getMembers, createMember, getGallery, createGalleryItem,
  getResults, createResult, getAdmitCards, createAdmitCard,
  getCertificates, createCertificate, getMaterials, createMaterial,
  getAssignments, createAssignment, getCourses
} from '../../services/storage';
import {
  InstituteMember, GalleryItem, Result, AdmitCard,
  Certificate, StudyMaterial, Assignment
} from '../../types';

// --- Shared Components ---

const ModuleLayout = ({ title, sub, onAdd, children }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">{title}</h1><p className="text-sm text-gray-500">{sub}</p></div>
        {onAdd && <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm"><Plus size={18} /> Add New</button>}
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
        {children}
    </div>
  </div>
);

const Modal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="bg-gray-50 p-4 rounded-full mb-3">
            <Search size={24} className="opacity-50" />
        </div>
        <p>{message}</p>
    </div>
);

const FileUpload = ({ label, onFileSelect, preview }: { label: string, onFileSelect: (f: string) => void, preview?: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            const reader = new FileReader();
            reader.onloadend = () => onFileSelect(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type="file" ref={inputRef} className="hidden" onChange={handleFile} accept="image/*,.pdf,.doc,.docx" />
            <div 
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition bg-white"
            >
                {preview ? (
                    preview.startsWith('data:image') ? 
                    <img src={preview} alt="Preview" className="h-32 w-full object-contain mx-auto" /> :
                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-4"><FileText /> File Selected</div>
                ) : (
                    <div className="text-gray-500 py-4">
                        <Upload className="mx-auto mb-2" size={20} />
                        <span className="text-sm">Click to upload</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Module Implementations ---

export const MemberManager = () => {
    const [members, setMembers] = useState<InstituteMember[]>(getMembers());
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<InstituteMember>>({ name: '', designation: '', photo: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        createMember(form);
        setMembers(getMembers());
        setShowModal(false);
        setForm({ name: '', designation: '', photo: '' });
    };

    return (
        <ModuleLayout title="Institute Members" sub="Manage staff and faculty members" onAdd={() => setShowModal(true)}>
            {members.length === 0 ? <EmptyState message="No members found." /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map(m => (
                        <div key={m.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                            <img src={m.photo || 'https://via.placeholder.com/100'} alt={m.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                            <div>
                                <h4 className="font-bold text-gray-900">{m.name}</h4>
                                <p className="text-sm text-blue-600">{m.designation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {showModal && (
                <Modal title="Add Member" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <FileUpload label="Profile Photo" onFileSelect={(f) => setForm({...form, photo: f})} preview={form.photo} />
                        <div><label className="block text-sm font-medium mb-1">Name</label><input required className="w-full border p-2 rounded bg-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium mb-1">Designation</label><input required className="w-full border p-2 rounded bg-white" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} /></div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Member</button>
                    </form>
                </Modal>
            )}
        </ModuleLayout>
    );
};

export const GalleryManager = () => {
    const [items, setItems] = useState<GalleryItem[]>(getGallery());
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<GalleryItem>>({ name: '', category: 'Gallery Page', photo: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        createGalleryItem(form);
        setItems(getGallery());
        setShowModal(false);
        setForm({ name: '', category: 'Gallery Page', photo: '' });
    };

    return (
        <ModuleLayout title="Gallery Manager" sub="Upload photos and manage categories" onAdd={() => setShowModal(true)}>
            {items.length === 0 ? <EmptyState message="No images in gallery." /> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                {item.category}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title="Upload Image" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <FileUpload label="Image" onFileSelect={(f) => setForm({...form, photo: f})} preview={form.photo} />
                        <div><label className="block text-sm font-medium mb-1">Caption / Name</label><input required className="w-full border p-2 rounded bg-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select className="w-full border p-2 rounded bg-white" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                                <option>Gallery Page</option>
                                <option>Affiliations Component</option>
                                <option>Events</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Upload</button>
                    </form>
                </Modal>
            )}
        </ModuleLayout>
    );
};

export const ResultManager = () => {
    const [results, setResults] = useState<Result[]>(getResults());
    const [showModal, setShowModal] = useState(false);
    const courses = getCourses();
    const [form, setForm] = useState<Partial<Result>>({ enrollmentNo: '', rollNo: '', courseId: '', marks: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        createResult(form);
        setResults(getResults());
        setShowModal(false);
        setForm({ enrollmentNo: '', rollNo: '', courseId: '', marks: '' });
    };

    return (
        <ModuleLayout title="Results" sub="Manage student results" onAdd={() => setShowModal(true)}>
            {results.length === 0 ? <EmptyState message="No results published." /> : (
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 font-semibold text-gray-700">
                        <tr><th className="p-3">Enrollment</th><th className="p-3">Roll No</th><th className="p-3">Course</th><th className="p-3">Marks/Grade</th></tr>
                    </thead>
                    <tbody className="divide-y">
                        {results.map(r => (
                            <tr key={r.id}>
                                <td className="p-3">{r.enrollmentNo}</td>
                                <td className="p-3">{r.rollNo}</td>
                                <td className="p-3">{courses.find(c => c.id === r.courseId)?.code || '-'}</td>
                                <td className="p-3">{r.marks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <Modal title="Publish Result" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Enrollment No</label><input required className="w-full border p-2 rounded bg-white" value={form.enrollmentNo} onChange={e => setForm({...form, enrollmentNo: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium mb-1">Roll No</label><input required className="w-full border p-2 rounded bg-white" value={form.rollNo} onChange={e => setForm({...form, rollNo: e.target.value})} /></div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Course</label>
                            <select className="w-full border p-2 rounded bg-white" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})}>
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Result (Marks/Grade)</label><input required className="w-full border p-2 rounded bg-white" value={form.marks} onChange={e => setForm({...form, marks: e.target.value})} placeholder="e.g. 85% or Grade A" /></div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Result</button>
                    </form>
                </Modal>
            )}
        </ModuleLayout>
    );
};

export const AdmitCardManager = () => {
    const [cards, setCards] = useState<AdmitCard[]>(getAdmitCards());
    const [showModal, setShowModal] = useState(false);
    const courses = getCourses();
    const [form, setForm] = useState<Partial<AdmitCard>>({ enrollmentNo: '', rollNo: '', courseId: '', examCenter: '', examDate: '', examTime: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        createAdmitCard(form);
        setCards(getAdmitCards());
        setShowModal(false);
        setForm({ enrollmentNo: '', rollNo: '', courseId: '', examCenter: '', examDate: '', examTime: '' });
    };

    return (
        <ModuleLayout title="Admit Cards" sub="Generate and view admit cards" onAdd={() => setShowModal(true)}>
             {cards.length === 0 ? <EmptyState message="No admit cards generated." /> : (
                <div className="grid gap-4">
                    {cards.map(c => (
                        <div key={c.id} className="border p-4 rounded-lg flex justify-between items-center bg-gray-50">
                            <div>
                                <h4 className="font-bold">{c.enrollmentNo}</h4>
                                <p className="text-sm text-gray-600">Exam: {c.examDate} at {c.examTime}</p>
                                <p className="text-xs text-gray-500">Center: {c.examCenter}</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">{courses.find(x => x.id === c.courseId)?.code}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title="Generate Admit Card" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Enrollment No</label><input required className="w-full border p-2 rounded bg-white" value={form.enrollmentNo} onChange={e => setForm({...form, enrollmentNo: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium mb-1">Roll No</label><input required className="w-full border p-2 rounded bg-white" value={form.rollNo} onChange={e => setForm({...form, rollNo: e.target.value})} /></div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Course</label>
                            <select className="w-full border p-2 rounded bg-white" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})}>
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Exam Center</label><input required className="w-full border p-2 rounded bg-white" value={form.examCenter} onChange={e => setForm({...form, examCenter: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                             <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" required className="w-full border p-2 rounded bg-white" value={form.examDate} onChange={e => setForm({...form, examDate: e.target.value})} /></div>
                             <div><label className="block text-sm font-medium mb-1">Time</label><input type="time" required className="w-full border p-2 rounded bg-white" value={form.examTime} onChange={e => setForm({...form, examTime: e.target.value})} /></div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Generate</button>
                    </form>
                </Modal>
            )}
        </ModuleLayout>
    );
};

export const CertificateManager = () => {
    const [certs, setCerts] = useState<Certificate[]>(getCertificates());
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<Certificate>>({ enrollmentNo: '', issueDate: '', certificatePath: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        createCertificate(form);
        setCerts(getCertificates());
        setShowModal(false);
        setForm({ enrollmentNo: '', issueDate: '', certificatePath: '' });
    };

    return (
        <ModuleLayout title="Certificates" sub="Issue certificates to students" onAdd={() => setShowModal(true)}>
             {certs.length === 0 ? <EmptyState message="No certificates issued." /> : (
                <div className="grid gap-4">
                    {certs.map(c => (
                        <div key={c.id} className="border p-4 rounded-lg flex items-center gap-4 bg-gray-50">
                             <div className="bg-green-100 p-2 rounded text-green-600"><AwardIcon /></div>
                             <div className="flex-1">
                                <h4 className="font-bold">{c.enrollmentNo}</h4>
                                <p className="text-sm text-gray-500">Issued: {c.issueDate}</p>
                             </div>
                             {c.certificatePath && <button className="text-blue-600 text-sm hover:underline">View</button>}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title="Issue Certificate" onClose={() => setShowModal(false)}>
                     <form onSubmit={handleSave} className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Enrollment No</label><input required className="w-full border p-2 rounded bg-white" value={form.enrollmentNo} onChange={e => setForm({...form, enrollmentNo: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium mb-1">Issue Date</label><input type="date" required className="w-full border p-2 rounded bg-white" value={form.issueDate} onChange={e => setForm({...form, issueDate: e.target.value})} /></div>
                        <FileUpload label="Certificate File (PDF/Image)" onFileSelect={(f) => setForm({...form, certificatePath: f})} preview={form.certificatePath} />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Issue Certificate</button>
                    </form>
                </Modal>
            )}
        </ModuleLayout>
    );
};

// Simplified icon component since lucide 'Award' conflicts inside component
const AwardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> );

export const StudyMaterialManager = () => {
    const [materials, setMaterials] = useState<StudyMaterial[]>(getMaterials());
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<StudyMaterial>>({ title: '', description: '', type: 'PDF', fileUrl: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        createMaterial(form);
        setMaterials(getMaterials());
        setShowModal(false);
        setForm({ title: '', description: '', type: 'PDF', fileUrl: '' });
    };

    return (
        <ModuleLayout title="Study Material" sub="Upload notes and documents" onAdd={() => setShowModal(true)}>
             {materials.length === 0 ? <EmptyState message="No study materials uploaded." /> : (
                <div className="space-y-3">
                    {materials.map(m => (
                        <div key={m.id} className="flex justify-between items-center border p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 text-red-600 p-2 rounded"><FileText size={20}/></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{m.title}</h4>
                                    <p className="text-sm text-gray-500">{m.description}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600"><Download size={20}/></button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title="Upload Material" onClose={() => setShowModal(false)}>
                     <form onSubmit={handleSave} className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Title</label><input required className="w-full border p-2 rounded bg-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium mb-1">Description</label><textarea required className="w-full border p-2 rounded bg-white" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select className="w-full border p-2 rounded bg-white" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                <option>PDF</option>
                                <option>Word</option>
                                <option>PPT</option>
                            </select>
                        </div>
                        <FileUpload label="File" onFileSelect={(f) => setForm({...form, fileUrl: f})} />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Upload</button>
                    </form>
                </Modal>
            )}
        </ModuleLayout>
    );
};

export const AssignmentManager = () => {
    const [items, setItems] = useState<Assignment[]>(getAssignments());
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<Assignment>>({ title: '', description: '', fileUrl: '' });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        createAssignment(form);
        setItems(getAssignments());
        setShowModal(false);
        setForm({ title: '', description: '', fileUrl: '' });
    };

    return (
        <ModuleLayout title="Assignments" sub="Manage student assignments" onAdd={() => setShowModal(true)}>
            {items.length === 0 ? <EmptyState message="No assignments created." /> : (
                 <div className="space-y-3">
                    {items.map(m => (
                        <div key={m.id} className="flex justify-between items-center border p-4 rounded-lg bg-gray-50">
                            <div>
                                <h4 className="font-bold text-gray-900">{m.title}</h4>
                                <p className="text-sm text-gray-500">{m.description}</p>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600"><Download size={20}/></button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title="Create Assignment" onClose={() => setShowModal(false)}>
                     <form onSubmit={handleSave} className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Title</label><input required className="w-full border p-2 rounded bg-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium mb-1">Description</label><textarea required className="w-full border p-2 rounded bg-white" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                        <FileUpload label="Assignment File" onFileSelect={(f) => setForm({...form, fileUrl: f})} />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create</button>
                    </form>
                </Modal>
            )}
        </ModuleLayout>
    );
};

export const SettingsManager = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Site Settings</h1><p className="text-sm text-gray-500">Manage global website configuration.</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div><label className="block text-sm font-medium mb-1">Header Text</label><input className="w-full border p-2 rounded bg-white" defaultValue="SGC Skills & Computer Centre" /></div>
            <div><label className="block text-sm font-medium mb-1">Footer Text</label><input className="w-full border p-2 rounded bg-white" defaultValue="© 2024 SGCSC. All rights reserved." /></div>
            <div><label className="block text-sm font-medium mb-1">Facebook URL</label><input className="w-full border p-2 rounded bg-white" /></div>
            <div><label className="block text-sm font-medium mb-1">Instagram URL</label><input className="w-full border p-2 rounded bg-white" /></div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Changes</button>
        </div>
    </div>
);
