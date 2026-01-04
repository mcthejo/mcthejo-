import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, setActiveSection, isAdmin, setIsAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'HOME', id: 'home' },
    { label: 'PORTFOLIO', id: 'portfolio' },
    { label: 'ABOUT', id: 'about' },
    { label: 'SNAP SHOOTING', id: 'snap' },
    { label: 'CONTACT', id: 'contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="text-xl font-bold tracking-tight cursor-pointer flex items-center gap-2 group"
            onClick={() => setActiveSection('home')}
          >
            <span className="w-3 h-3 rounded-full bg-nature-green group-hover:bg-sea-blue transition-theme"></span>
            <span>mcthejo 사진일기</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsAdmin(false);
                }}
                className={`text-[13px] font-bold tracking-wider transition-theme hover:text-nature-green ${activeSection === item.id && !isAdmin ? 'text-nature-green border-b-2 border-nature-green' : 'text-stone-400'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Admin Access & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveSection('admin')}
              className={`p-2 rounded-full transition-theme ${isAdmin ? 'bg-nature-green text-white' : 'hover:bg-stone-100 text-stone-300'}`}
              title="관리자"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 py-6 px-6 flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsAdmin(false);
                  setIsMenuOpen(false);
                }}
                className={`text-left text-lg font-bold ${activeSection === item.id ? 'text-nature-green' : 'text-stone-400'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <footer className="bg-white border-t border-stone-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-sea-blue"></span>
              mcthejo 사진일기
            </div>
            <p className="text-stone-400 text-sm font-light tracking-wide">한국의 일상과 사람을 기록하는 사진가 mcthejo</p>
          </div>
          <div className="flex space-x-10 text-sm font-bold tracking-widest text-stone-500">
            <a href="https://instagram.com/mcthejo" target="_blank" rel="noopener noreferrer" className="hover:text-nature-green transition-theme">INSTAGRAM</a>
            <a href="mailto:mchtejo89@naver.com" className="hover:text-sky-blue transition-theme">EMAIL</a>
          </div>
          <div className="text-stone-300 text-[10px] tracking-widest uppercase font-bold">
            &copy; 2024 mcthejo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;