
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
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 fade-in">
      <div className="flex flex-wrap justify-center gap-4 mb-20">
        {['All', ...Object.values(Category)].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-8 py-3 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-theme border-2 ${
              filter === cat 
                ? 'bg-nature-green text-white border-nature-green shadow-xl scale-105' 
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
            className="group cursor-pointer overflow-hidden bg-stone-100 aspect-[3/4] relative shadow-md hover:shadow-2xl transition-theme rounded-lg"
            onClick={() => openLightbox(item)}
          >
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Multi-image indicator badge */}
            {item.images.length > 1 && (
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-stone-800 shadow-xl z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.images.length} PHOTOS
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10 text-white">
              <span className="text-[10px] font-black tracking-[0.4em] uppercase mb-3 text-sky-blue">{item.category}</span>
              <h3 className="text-2xl font-bold tracking-tight mb-3">{item.title}</h3>
              <div className="flex items-center gap-4 text-xs font-bold text-stone-300">
                <span className="tracking-wide">{item.location}</span>
                <span className="w-1 h-1 bg-stone-500 rounded-full"></span>
                <span className="tracking-widest">{item.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          <button className="absolute top-8 right-8 text-stone-900 hover:text-red-500 transition-theme p-4 z-50 bg-stone-50 rounded-full shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-16 max-w-7xl mx-auto">
            {/* Image Slider Section */}
            <div className="flex-1 w-full h-[55vh] lg:h-[80vh] flex items-center justify-center relative group">
              {/* Prev Button */}
              {selectedItem.images.length > 1 && (
                <button 
                  onClick={prevImage}
                  className="absolute left-0 p-6 text-stone-900 hover:text-sea-blue transition-theme z-20 bg-white/20 hover:bg-white rounded-full shadow-lg -translate-x-1/2 md:translate-x-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                <img 
                  src={selectedItem.images[currentImageIndex]} 
                  alt={selectedItem.title} 
                  className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-700 animate-in zoom-in-95"
                />
              </div>

              {/* Next Button */}
              {selectedItem.images.length > 1 && (
                <button 
                  onClick={nextImage}
                  className="absolute right-0 p-6 text-stone-900 hover:text-sea-blue transition-theme z-20 bg-white/20 hover:bg-white rounded-full shadow-lg translate-x-1/2 md:translate-x-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image counter for multiple images */}
              {selectedItem.images.length > 1 && (
                <div className="absolute bottom-6 bg-stone-900 text-white text-[10px] font-black px-5 py-2 rounded-full tracking-[0.3em] uppercase shadow-2xl">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </div>
              )}
            </div>
            
            {/* Info Section */}
            <div className="w-full lg:w-[400px] text-center lg:text-left bg-stone-50 p-10 rounded-3xl border border-stone-100">
              <span className="text-[10px] font-black tracking-[0.5em] text-sea-blue uppercase mb-6 block">PROJECT DETAILS</span>
              <h2 className="text-4xl font-black tracking-tight mb-8 text-stone-900 leading-[1.1]">{selectedItem.title}</h2>
              <div className="space-y-6 mb-12 text-stone-500 font-bold tracking-wide">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase text-stone-300 tracking-[0.3em] font-black">Location</span>
                  <p className="text-stone-800">{selectedItem.location}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase text-stone-300 tracking-[0.3em] font-black">Captured Date</span>
                  <p className="text-stone-800">{selectedItem.year} Archive</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase text-stone-300 tracking-[0.3em] font-black">Collection Category</span>
                  <p className="text-stone-800">{selectedItem.category}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={closeLightbox}
                  className="w-full py-5 bg-stone-900 text-white font-black uppercase tracking-[0.4em] hover:bg-nature-green transition-theme text-[11px] rounded-xl shadow-lg"
                >
                  Close Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;
