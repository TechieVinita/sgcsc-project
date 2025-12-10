import React, { useState } from 'react';

export const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Events', 'Classrooms', 'Convocations', 'Awards'];
  
  // Mock Images
  const images = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
    url: `https://picsum.photos/600/400?random=${i + 10}`
  }));

  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-slate-400">Glimpses of life at SGC Skills & Computer Centre.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === cat 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-xl shadow-sm bg-white aspect-[4/3] cursor-pointer">
                    <img 
                        src={img.url} 
                        alt="Gallery" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium px-3 py-1 bg-blue-600/80 rounded-full text-xs backdrop-blur-sm">
                            {img.category}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};