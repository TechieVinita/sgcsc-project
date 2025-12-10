
import React, { useState, useRef } from 'react';
import { getFranchises, createFranchise, updateFranchise, updateFranchiseStatus, deleteFranchise } from '../../services/storage';
import { Franchise } from '../../types';
import { Plus, Search, Edit, ShieldCheck, ShieldAlert, X, Upload, Save, Trash2, Eye } from 'lucide-react';

export const FranchiseManager: React.FC = () => {
  const [franchises, setFranchises] = useState<Franchise[]>(getFranchises());
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Comprehensive Initial State
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

  // Helper to handle file selection and convert to Base64 for display/storage
  const handleFileChange = (field: keyof Franchise, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNumberChange = (field: string, value: string) => {
    const num = value === '' ? 0 : parseInt(value);
    setFormData((prev: any) => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateFranchise(editingId, formData);
    } else {
      createFranchise(formData as any);
    }
    // Refresh list from storage
    setFranchises(getFranchises());
    resetForm();
  };

  const handleEdit = (franchise: Franchise) => {
    setFormData({ ...franchise, password: '' }); // Don't show existing password
    setEditingId(franchise.id);
    setView('form');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this franchise? This action cannot be undone.")) {
      deleteFranchise(id);
      // Update local state immediately to reflect change
      setFranchises(prev => prev.filter(f => f.id !== id));
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setView('list');
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateFranchiseStatus(id, newStatus);
    setFranchises(prev => prev.map(f => f.id === id ? { ...f, status: newStatus as any } : f));
  };

  // Render file upload with Preview
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
                    <img src={formData[field] as string} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center text-blue-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                         <Edit size={24} />
                         <span className="text-xs mt-1">Change Image</span>
                    </div>
                </>
            ) : (
                <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                        <span className="text-blue-600 font-medium hover:underline">Upload</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Max 300KB</p>
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
                    <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Franchise' : 'Register New Franchise'}</h2>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details below. All fields are required.</p>
                </div>
                <button onClick={resetForm} className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-600 hover:shadow-sm transition">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-10">
                {/* Section 1: Basic Info */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                        <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Institute Details</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institute ID</label>
                            <input required className={`${inputClass} bg-gray-50`} value={formData.instituteId} onChange={e => setFormData({...formData, instituteId: e.target.value})} readOnly />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                            <input required className={inputClass} value={formData.instituteName} onChange={e => setFormData({...formData, instituteName: e.target.value})} placeholder="e.g. SGC Computer Academy" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                            <input required className={inputClass} value={formData.instituteOwnerName} onChange={e => setFormData({...formData, instituteOwnerName: e.target.value})} placeholder="Full Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" required className={inputClass} value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Head Qualification</label>
                            <input className={inputClass} value={formData.headQualification} onChange={e => setFormData({...formData, headQualification: e.target.value})} placeholder="e.g. MCA, B.Tech" />
                        </div>
                    </div>
                </section>

                {/* Section 2: Identity & Docs */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                         <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Identity & Documents</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                            <input required className={inputClass} value={formData.aadharNumber} onChange={e => setFormData({...formData, aadharNumber: e.target.value})} placeholder="12 Digit Aadhar No" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                            <input required className={inputClass} value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value})} placeholder="10 Digit PAN No" />
                        </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Upload Documents (Click boxes to upload)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FileUploadField label="Aadhar Front" field="aadharFront" />
                        <FileUploadField label="Aadhar Back" field="aadharBack" />
                        <FileUploadField label="PAN Card" field="panImage" />
                        <FileUploadField label="Institute Photo" field="institutePhoto" />
                        <FileUploadField label="Owner Photo" field="ownerPhoto" />
                        <FileUploadField label="Owner Sign" field="ownerSign" />
                        <FileUploadField label="Certificate" field="certificateCopy" />
                    </div>
                </section>

                {/* Section 3: Location & Contact */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                         <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Location & Contact</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <input required className={inputClass} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Building, Street, Landmark" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input required className={inputClass} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input required className={inputClass} value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input className={inputClass} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                            <input type="email" required className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@gmail.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <input required className={inputClass} value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} placeholder="+91..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                            <input className={inputClass} value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} placeholder="+91..." />
                        </div>
                    </div>
                </section>

                {/* Section 4: Infrastructure */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                         <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Infrastructure</h3>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Computers</label>
                            <input type="number" className={inputClass} value={formData.totalComputers || ''} onChange={e => handleNumberChange('totalComputers', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Operators</label>
                            <input type="number" className={inputClass} value={formData.numComputerOperators || ''} onChange={e => handleNumberChange('numComputerOperators', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Classrooms</label>
                            <input type="number" className={inputClass} value={formData.numClassRooms || ''} onChange={e => handleNumberChange('numClassRooms', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Center Space (Sq Ft)</label>
                            <input className={inputClass} value={formData.centerSpace} onChange={e => setFormData({...formData, centerSpace: e.target.value})} placeholder="e.g. 1200" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {['Reception', 'Staff Room', 'Water Supply', 'Toilet'].map(facility => {
                            const key = `has${facility.replace(' ', '')}` as keyof Franchise;
                            return (
                                <div key={facility} className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between shadow-sm">
                                    <span className="text-sm font-medium text-gray-700">{facility}</span>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer bg-white px-2 py-1 rounded border border-gray-100">
                                            <input 
                                                type="radio" 
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 bg-white" 
                                                name={facility} 
                                                value="Yes" 
                                                checked={formData[key] === 'Yes'}
                                                onChange={() => setFormData({...formData, [key]: 'Yes'})} 
                                            /> Yes
                                        </label>
                                        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer bg-white px-2 py-1 rounded border border-gray-100">
                                            <input 
                                                type="radio" 
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 bg-white" 
                                                name={facility} 
                                                value="No" 
                                                checked={formData[key] === 'No'}
                                                onChange={() => setFormData({...formData, [key]: 'No'})} 
                                            /> No
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 5: Login Credentials */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                         <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Login Credentials</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input required className={inputClass} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="Create unique username" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                className={inputClass} 
                                value={formData.password || ''}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                placeholder={editingId ? "Leave blank to keep current" : "Set initial password"} 
                            />
                        </div>
                    </div>
                </section>

                <div className="flex gap-4 pt-6 border-t border-gray-100 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transition flex items-center gap-2 flex-1 justify-center">
                        <Save size={20} />
                        {editingId ? 'Update Franchise' : 'Register Franchise'}
                    </button>
                </div>
            </form>
        </div>
      );
  }

  // Helper for Table cells with thumbnails
  const Thumbnail = ({ src }: { src: string }) => {
      if (!src) return <span className="text-xs text-gray-300">-</span>;
      return (
          <div className="h-8 w-8 rounded bg-gray-100 border border-gray-200 overflow-hidden relative group shrink-0">
              <img src={src} className="w-full h-full object-cover" alt="Thumb" />
              <div className="hidden group-hover:flex absolute inset-0 bg-black/50 items-center justify-center">
                  <Eye size={12} className="text-white"/>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Franchise Management</h1>
          <p className="text-sm text-gray-500">View and manage all authorized training centers.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setView('form'); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} /> Add Franchise
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name, ID or owner..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Institute</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Infra (Comp/Ops)</th>
                <th className="px-6 py-4">Photos</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFranchises.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-blue-600">{f.instituteId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{f.instituteName}</td>
                   <td className="px-6 py-4 font-mono text-xs">{f.username}</td>
                  <td className="px-6 py-4">{f.instituteOwnerName}</td>
                  <td className="px-6 py-4">
                      <div className="text-xs">
                          <div>{f.contactNumber}</div>
                          <div className="text-gray-400">{f.email}</div>
                      </div>
                  </td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate" title={`${f.address}, ${f.district}, ${f.state}`}>
                      {f.district}, {f.state}
                  </td>
                  <td className="px-6 py-4 text-xs text-center">
                      <span className="bg-gray-100 px-2 py-1 rounded">{f.totalComputers || 0} / {f.numComputerOperators || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex gap-1">
                          <Thumbnail src={f.institutePhoto} />
                          <Thumbnail src={f.ownerPhoto} />
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        f.status === 'active' ? 'bg-green-100 text-green-800' :
                        f.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => toggleStatus(f.id, f.status)} className="p-1 hover:text-blue-600 text-gray-400 transition" title="Toggle Status">
                            {f.status === 'active' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                        </button>
                        <button type="button" onClick={() => handleEdit(f)} className="p-1 hover:text-blue-600 text-gray-400 transition" title="Edit">
                            <Edit size={18} />
                        </button>
                        <button type="button" onClick={(e) => handleDelete(e, f.id)} className="p-1 hover:text-red-600 text-gray-400 transition" title="Delete">
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFranchises.length === 0 && (
                <tr><td colSpan={10} className="text-center py-8 text-gray-400">No franchises found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
