
import React, { useState } from 'react';
import { Plus, Search, Trash2, Download } from 'lucide-react';

// --- Generic List Component ---
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

export const MemberManager = () => (
    <ModuleLayout title="Institute Members" sub="Manage staff and faculty members" onAdd={() => alert('Add Member Modal')}>
        <div className="text-center text-gray-500 mt-20">Member List Implementation</div>
    </ModuleLayout>
);

export const GalleryManager = () => (
    <ModuleLayout title="Gallery Manager" sub="Upload photos and manage categories" onAdd={() => alert('Add Image Modal')}>
        <div className="grid grid-cols-4 gap-4">
            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-dashed border-gray-300">Image 1</div>
            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-dashed border-gray-300">Image 2</div>
        </div>
    </ModuleLayout>
);

export const ResultManager = () => (
    <ModuleLayout title="Results" sub="Manage student results" onAdd={() => alert('Add Result Modal')}>
        <div className="text-center text-gray-500 mt-20">Result Table Implementation</div>
    </ModuleLayout>
);

export const AdmitCardManager = () => (
    <ModuleLayout title="Admit Cards" sub="Generate and view admit cards" onAdd={() => alert('Generate Admit Card')}>
        <div className="text-center text-gray-500 mt-20">Admit Card List Implementation</div>
    </ModuleLayout>
);

export const CertificateManager = () => (
    <ModuleLayout title="Certificates" sub="Issue certificates to students" onAdd={() => alert('Create Certificate')}>
        <div className="text-center text-gray-500 mt-20">Certificate List Implementation</div>
    </ModuleLayout>
);

export const StudyMaterialManager = () => (
    <ModuleLayout title="Study Material" sub="Upload notes and documents" onAdd={() => alert('Upload Material')}>
        <div className="text-center text-gray-500 mt-20">File List Implementation</div>
    </ModuleLayout>
);

export const AssignmentManager = () => (
    <ModuleLayout title="Assignments" sub="Manage student assignments" onAdd={() => alert('Upload Assignment')}>
        <div className="text-center text-gray-500 mt-20">Assignment List Implementation</div>
    </ModuleLayout>
);

export const SettingsManager = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Site Settings</h1><p className="text-sm text-gray-500">Manage global website configuration.</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div><label className="block text-sm font-medium mb-1">Header Text</label><input className="w-full border p-2 rounded" defaultValue="SGC Skills & Computer Centre" /></div>
            <div><label className="block text-sm font-medium mb-1">Footer Text</label><input className="w-full border p-2 rounded" defaultValue="© 2024 SGCSC. All rights reserved." /></div>
            <div><label className="block text-sm font-medium mb-1">Facebook URL</label><input className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm font-medium mb-1">Instagram URL</label><input className="w-full border p-2 rounded" /></div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Changes</button>
        </div>
    </div>
);
