
import React, { useState, useRef, useEffect } from 'react';
import { getFranchises, createFranchise, uploadFile } from '../../services/storage';
import { Franchise } from '../../types';
import { Plus, Search, Edit, ShieldCheck, ShieldAlert, X, Upload, Save, Trash2, Eye, Loader2 } from 'lucide-react';

export const FranchiseManager: React.FC = () => {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
      setLoading(true);
      try {
          const data = await getFranchises();
          setFranchises(data);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const initialForm: Partial<Franchise> & { password?: string } = {
    instituteId: `INST${Math.floor(Math.random()*1000)}`,
    instituteName: '',
    instituteOwnerName: '',
    dob: '',
    aadharNumber: '',
    panNumber: '',
    address: '',
    state: '',
    district: '',
    city: '',
    numComputerOperators: 0,
    numClassRooms: 0,
    totalComputers: 0,
    centerSpace: '',
    whatsappNumber: '',
    contactNumber: '',
    email: '',
    headQualification: '',
    hasReception: 'No',
    hasStaffRoom: 'No',
    hasWaterSupply: 'No',
    hasToilet: 'No',
    username: '',
    password: '',
    status: 'pending',
    aadharFront: '',
    aadharBack: '',
    panImage: '',
    institutePhoto: '',
    ownerPhoto: '',
    ownerSign: '',
    certificateCopy: ''
  };

  const [formData, setFormData] = useState<any>(initialForm);
  const [saving, setSaving] = useState(false);

  // REAL FILE UPLOAD
  const handleFileChange = async (field: keyof Franchise, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show loading or temp state here if needed
      const url = await uploadFile(file);
      setFormData((prev: any) => ({ ...prev, [field]: url }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        await createFranchise(formData);
        await loadData(); // Refresh list
        resetForm();
    } catch (err) {
        alert("Error saving franchise. Check console.");
    } finally {
        setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setView('list');
  };

  const FileUploadField = ({ label, field }: { label: string, field: keyof Franchise }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const hasImage = formData[field] && (formData[field] as string).length > 0;

    return (
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input 
            type="file" 
            ref={inputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleFileChange(field, e)}
          />
          <div 
            onClick={() => inputRef.current?.click()}
            className={`mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors h-32 relative overflow-hidden group bg-white ${
                hasImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {hasImage ? (
                <>
                    <img src={formData[field] as string} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white text-xs font-medium">Change</span>
                    </div>
                </>
            ) : (
                <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                        <span className="text-blue-600 font-medium hover:underline">Upload</span>
                    </div>
                </div>
            )}
          </div>
      </div>
    );
  };

  const inputClass = "w-full border border-gray-300 p-2.5 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm";

  const filteredFranchises = franchises.filter(f => 
    f.instituteName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.instituteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.instituteOwnerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'form') {
      return (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 my-6">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Register New Franchise</h2>
                    <p className="text-sm text-gray-500">All uploads will be saved to the server.</p>
                </div>
                <button onClick={resetForm} className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-10">
                {/* Simplified form for brevity - keeping core sections */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Institute Details</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institute ID</label>
                            <input required className={`${inputClass} bg-gray-50`} value={formData.instituteId} readOnly />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                            <input required className={inputClass} value={formData.instituteName} onChange={e => setFormData({...formData, instituteName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                            <input required className={inputClass} value={formData.instituteOwnerName} onChange={e => setFormData({...formData, instituteOwnerName: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <input required className={inputClass} value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input required className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Uploads</h3>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FileUploadField label="Institute Photo" field="institutePhoto" />
                        <FileUploadField label="Owner Photo" field="ownerPhoto" />
                        <FileUploadField label="Aadhar Front" field="aadharFront" />
                        <FileUploadField label="PAN Card" field="panImage" />
                    </div>
                </section>

                <section>
                     <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Login</h3>
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input required className={inputClass} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input required type="password" className={inputClass} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                        </div>
                    </div>
                </section>

                <div className="flex gap-4 pt-6 border-t border-gray-100">
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 justify-center w-full">
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {saving ? 'Saving...' : 'Register Franchise'}
                    </button>
                </div>
            </form>
        </div>
      );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Franchise Management</h1>
          <p className="text-sm text-gray-500">Manage all authorized training centers.</p>
        </div>
        <button onClick={() => setView('form')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm">
          <Plus size={18} /> Add Franchise
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading franchises from database...</div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
                <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Institute</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {filteredFranchises.map((f) => (
                    <tr key={f.id || Math.random()} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600">{f.instituteId}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{f.instituteName}</td>
                    <td className="px-6 py-4">{f.instituteOwnerName}</td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {f.status}
                        </span>
                    </td>
                    </tr>
                ))}
                {filteredFranchises.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-400">No franchises found.</td></tr>
                )}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};
