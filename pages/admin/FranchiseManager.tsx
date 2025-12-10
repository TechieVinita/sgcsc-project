import React, { useState } from 'react';
import { getFranchises, createFranchise, updateFranchiseStatus } from '../../services/storage';
import { Franchise } from '../../types';
import { Plus, Search, MoreVertical, Edit, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';

export const FranchiseManager: React.FC = () => {
  const [franchises, setFranchises] = useState<Franchise[]>(getFranchises());
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Franchise>>({
    instituteName: '',
    ownerName: '',
    city: '',
    phone: '',
    status: 'pending'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createFranchise(formData as any);
    setFranchises(getFranchises());
    setShowModal(false);
    setFormData({ instituteName: '', ownerName: '', city: '', phone: '', status: 'pending' });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateFranchiseStatus(id, newStatus);
    setFranchises(getFranchises());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Franchise Management</h1>
          <p className="text-sm text-gray-500">View and manage all authorized training centers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
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
            {/* Filters could go here */}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Institute Name</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {franchises.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{f.instituteName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span>{f.ownerName}</span>
                        <span className="text-xs text-gray-400">{f.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{f.city}, {f.state}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        f.status === 'active' ? 'bg-green-100 text-green-800' :
                        f.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(f.createdAt).toLocaleDateString()}</td>
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
                <tr>
                    <td colSpan={6} className="text-center py-8">No franchises found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Add New Franchise</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Institute Name</label>
                        <input required className="w-full border p-2 rounded" value={formData.instituteName} onChange={e => setFormData({...formData, instituteName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                        <input required className="w-full border p-2 rounded" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input required className="w-full border p-2 rounded" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input required className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};