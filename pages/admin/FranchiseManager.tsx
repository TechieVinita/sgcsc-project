
import React, { useState } from 'react';
import { getFranchises, createFranchise, updateFranchiseStatus } from '../../services/storage';
import { Franchise } from '../../types';
import { Plus, Search, Edit, ShieldCheck, ShieldAlert, X, Upload } from 'lucide-react';

export const FranchiseManager: React.FC = () => {
  const [franchises, setFranchises] = useState<Franchise[]>(getFranchises());
  const [view, setView] = useState<'list' | 'create'>('list');
  
  // Comprehensive Initial State
  const initialForm: Partial<Franchise> = {
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
    status: 'pending'
  };

  const [formData, setFormData] = useState<Partial<Franchise>>(initialForm);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createFranchise(formData as any);
    setFranchises(getFranchises());
    setView('list');
    setFormData(initialForm);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateFranchiseStatus(id, newStatus);
    setFranchises(getFranchises());
  };

  const renderFileUpload = (label: string, field: string) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">Upload a file</span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 300KB</p>
            </div>
        </div>
    </div>
  );

  if (view === 'create') {
      return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Register New Franchise</h2>
                <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-8">
                {/* Section 1: Basic Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Institute Details</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institute ID</label>
                            <input required className="w-full border p-2 rounded-lg bg-gray-50" value={formData.instituteId} onChange={e => setFormData({...formData, instituteId: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.instituteName} onChange={e => setFormData({...formData, instituteName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.instituteOwnerName} onChange={e => setFormData({...formData, instituteOwnerName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" required className="w-full border p-2 rounded-lg" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Head Qualification</label>
                            <input className="w-full border p-2 rounded-lg" value={formData.headQualification} onChange={e => setFormData({...formData, headQualification: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Section 2: Identity & Docs */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Identity & Documents</h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.aadharNumber} onChange={e => setFormData({...formData, aadharNumber: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                        {renderFileUpload('Aadhar Front', 'aadharFront')}
                        {renderFileUpload('Aadhar Back', 'aadharBack')}
                        {renderFileUpload('PAN Image', 'panImage')}
                        {renderFileUpload('Institute Photo', 'institutePhoto')}
                    </div>
                </div>

                {/* Section 3: Location & Contact */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Location & Contact</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input className="w-full border p-2 rounded-lg" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                            <input type="email" required className="w-full border p-2 rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                            <input className="w-full border p-2 rounded-lg" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Section 4: Infrastructure */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Infrastructure</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Computers</label>
                            <input type="number" className="w-full border p-2 rounded-lg" value={formData.totalComputers} onChange={e => setFormData({...formData, totalComputers: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Operators</label>
                            <input type="number" className="w-full border p-2 rounded-lg" value={formData.numComputerOperators} onChange={e => setFormData({...formData, numComputerOperators: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Classrooms</label>
                            <input type="number" className="w-full border p-2 rounded-lg" value={formData.numClassRooms} onChange={e => setFormData({...formData, numClassRooms: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Center Space (Sq Ft)</label>
                            <input className="w-full border p-2 rounded-lg" value={formData.centerSpace} onChange={e => setFormData({...formData, centerSpace: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {['Reception', 'Staff Room', 'Water Supply', 'Toilet'].map(facility => (
                            <div key={facility} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{facility}</span>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1 text-xs">
                                        <input type="radio" name={facility} value="Yes" onChange={e => setFormData({...formData, [`has${facility.replace(' ', '')}`]: 'Yes'})} /> Yes
                                    </label>
                                    <label className="flex items-center gap-1 text-xs">
                                        <input type="radio" name={facility} value="No" defaultChecked onChange={e => setFormData({...formData, [`has${facility.replace(' ', '')}`]: 'No'})} /> No
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 5: Login Credentials */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Login Credentials</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input required className="w-full border p-2 rounded-lg" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" required className="w-full border p-2 rounded-lg" placeholder="Set initial password" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-100">
                    <button type="button" onClick={() => setView('list')} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Cancel</button>
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm flex-1">Create Franchise</button>
                </div>
            </form>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Franchise Management</h1>
          <p className="text-sm text-gray-500">View and manage all authorized training centers.</p>
        </div>
        <button 
          onClick={() => setView('create')}
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
                    placeholder="Search institutes..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Institute</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {franchises.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-xs">{f.instituteId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{f.instituteName}</td>
                  <td className="px-6 py-4">{f.instituteOwnerName}</td>
                  <td className="px-6 py-4">{f.district}, {f.state}</td>
                  <td className="px-6 py-4 text-xs">{f.contactNumber}</td>
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
                        <button onClick={() => toggleStatus(f.id, f.status)} className="p-1 hover:text-blue-600" title="Toggle Status">
                            {f.status === 'active' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                        </button>
                        <button className="p-1 hover:text-blue-600"><Edit size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {franchises.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8">No franchises found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
