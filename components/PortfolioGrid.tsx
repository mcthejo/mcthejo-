
import React, { useState, useEffect } from 'react';
import { Category, PortfolioItem } from '../types';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  const openLightbox = (item: PortfolioItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedItem) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedItem) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-wrap justify-center gap-4 mb-20">
        {['All', ...Object.values(Category)].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-8 py-3 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-theme border-2 ${
              filter === cat 
                ? 'bg-nature-green text-white border-nature-green shadow-lg' 
                : 'bg-white text-stone-400 border-stone-100 hover:border-sky-blue hover:text-sky-blue'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="group cursor-pointer overflow-hidden bg-stone-100 aspect-[3/4] relative shadow-md hover:shadow-2xl transition-theme"
            onClick={() => openLightbox(item)}
          >
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Multi-image indicator */}
            {item.images.length > 1 && (
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded-sm text-[10px] font-bold text-stone-600 shadow-sm z-10">
                1 / {item.images.length}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 text-white">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase mb-2 text-sky-blue">{item.category}</span>
              <h3 className="text-2xl font-bold tracking-tight mb-2">{item.title}</h3>
              <div className="flex items-center gap-3 text-xs font-bold text-stone-300">
                <span>{item.location}</span>
                <span className="w-1 h-1 bg-stone-500 rounded-full"></span>
                <span>{item.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-12"
          onClick={() => setSelectedItem(null)}
        >
          <button className="absolute top-10 right-10 text-stone-900 hover:text-sea-blue transition-theme p-4 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
            {/* Image Slider Section */}
            <div className="flex-1 w-full h-[60vh] lg:h-[80vh] flex items-center justify-center relative group">
              {/* Prev Button */}
              {selectedItem.images.length > 1 && (
                <button 
                  onClick={prevImage}
                  className="absolute left-4 p-4 text-stone-900 hover:text-sea-blue opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <img 
                src={selectedItem.images[currentImageIndex]} 
                alt={selectedItem.title} 
                className="max-w-full max-h-full object-contain shadow-2xl ring-8 ring-stone-50 transition-all duration-500"
              />

              {/* Next Button */}
              {selectedItem.images.length > 1 && (
                <button 
                  onClick={nextImage}
                  className="absolute right-4 p-4 text-stone-900 hover:text-sea-blue opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image counter for multiple images */}
              {selectedItem.images.length > 1 && (
                <div className="absolute bottom-4 bg-stone-900 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </div>
              )}
            </div>
            
            {/* Info Section */}
            <div className="w-full lg:w-96 text-center lg:text-left">
              <span className="text-xs font-black tracking-[0.4em] text-sea-blue uppercase mb-4 block">Selected Project</span>
              <h2 className="text-4xl font-bold tracking-tight mb-6">{selectedItem.title}</h2>
              <div className="space-y-4 mb-10 text-stone-500 font-bold tracking-wide">
                <p className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-[10px] uppercase text-stone-300 tracking-widest">Location</span>
                  {selectedItem.location}
                </p>
                <p className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-[10px] uppercase text-stone-300 tracking-widest">Year</span>
                  {selectedItem.year}
                </p>
                <p className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-[10px] uppercase text-stone-300 tracking-widest">Category</span>
                  {selectedItem.category}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(null);
                }}
                className="w-full py-4 border-2 border-stone-900 text-stone-900 font-black uppercase tracking-[0.4em] hover:bg-stone-900 hover:text-white transition-theme text-xs"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;
