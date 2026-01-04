
import React, { useState, useRef, useEffect } from 'react';
import { Category, PortfolioItem, AboutContent, SiteConfig } from '../types';

interface AdminPanelProps {
  items: PortfolioItem[];
  onAddItem: (item: PortfolioItem) => void;
  onUpdateItem: (item: PortfolioItem) => void;
  onDeleteItem: (id: string) => void;
  aboutContent: AboutContent;
  onUpdateAbout: (content: AboutContent) => void;
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  items, onAddItem, onUpdateItem, onDeleteItem, 
  aboutContent, onUpdateAbout, 
  siteConfig, onUpdateConfig 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'settings'>('portfolio');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  
  const [portfolioForm, setPortfolioForm] = useState({
    images: [] as string[],
    category: Category.LANDSCAPE,
    title: '',
    location: '',
    year: new Date().getFullYear().toString()
  });

  const [aboutForm, setAboutForm] = useState<AboutContent>(aboutContent);
  const [configForm, setConfigForm] = useState<SiteConfig>(siteConfig);

  useEffect(() => {
    setAboutForm(aboutContent);
    setConfigForm(siteConfig);
  }, [aboutContent, siteConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 이미지 최적화 함수: 화질을 유지하면서 용량 효율화
  const resizeImage = (file: File, maxWidth = 1600, maxHeight = 1600): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
          }
          resolve(canvas.toDataURL('image/jpeg', 0.85)); // 0.85 퀄리티로 상향
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePortfolioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    if (portfolioForm.images.length + fileArray.length > 50) {
      alert("포트폴리오당 최대 50장까지만 업로드 가능합니다.");
      return;
    }

    setIsProcessing(true);
    try {
      const resizedPromises = fileArray.map(file => resizeImage(file));
      const resizedImages = await Promise.all(resizedPromises);
      setPortfolioForm(prev => ({ ...prev, images: [...prev.images, ...resizedImages] }));
    } catch (err) {
      console.error(err);
      alert("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImage(file, 2000, 1200);
      setConfigForm(prev => ({ ...prev, heroImage: resized }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfileFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImage(file, 1000, 1200);
      setAboutForm(prev => ({ ...prev, profileImage: resized }));
    } finally {
      setIsProcessing(false);
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handlePortfolioEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setPortfolioForm({
      images: [...item.images],
      category: item.category,
      title: item.title,
      location: item.location,
      year: item.year
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPortfolioForm = () => {
    setEditingItem(null);
    setPortfolioForm({
      images: [],
      category: Category.LANDSCAPE,
      title: '',
      location: '',
      year: new Date().getFullYear().toString()
    });
  };

  const handlePortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (portfolioForm.images.length === 0 || !portfolioForm.title) {
      alert('사진과 제목은 필수입니다.');
      return;
    }
    if (editingItem) onUpdateItem({ ...portfolioForm, id: editingItem.id });
    else onAddItem({ ...portfolioForm, id: Math.random().toString(36).substr(2, 9) });
    resetPortfolioForm();
    alert('저장되었습니다.');
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAbout(aboutForm);
    onUpdateConfig(configForm);
    alert('사이트 설정이 업데이트되었습니다.');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-40 px-6 fade-in">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-2xl shadow-2xl border border-stone-100">
          <div className="flex justify-center mb-8">
            <span className="w-4 h-4 rounded-full bg-nature-green animate-pulse"></span>
          </div>
          <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-widest">Admin Access</h2>
          <div className="mb-8">
            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">Password</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-stone-50 border-transparent border-2 focus:border-nature-green focus:bg-white outline-none transition-theme font-bold text-center tracking-[1em]"
              placeholder="••••"
            />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-lg hover:bg-nature-green transition-theme font-black uppercase tracking-[0.4em] text-xs">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-24 px-6 fade-in">
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-nature-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-stone-600 animate-pulse">Large Data Syncing...</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-stone-900 pb-8 gap-8">
        <div>
          <span className="text-xs font-black tracking-[0.4em] text-sea-blue uppercase mb-4 block">Control Center</span>
          <h1 className="text-5xl font-black tracking-tighter">사이트 관리</h1>
        </div>
        <div className="flex bg-stone-100 p-1.5 rounded-xl gap-2">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-theme rounded-lg ${activeTab === 'portfolio' ? 'bg-white text-nature-green shadow-sm' : 'text-stone-400'}`}
          >
            Portfolio
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-theme rounded-lg ${activeTab === 'settings' ? 'bg-white text-nature-green shadow-sm' : 'text-stone-400'}`}
          >
            Site Settings
          </button>
        </div>
      </div>

      {activeTab === 'portfolio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <form onSubmit={handlePortfolioSubmit} className="bg-white p-10 rounded-2xl shadow-2xl border border-stone-50 sticky top-28">
              <h3 className="text-xl font-bold uppercase mb-8">{editingItem ? '수정' : '추가'}</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400">사진 (최대 50장)</label>
                    <span className="text-[10px] font-bold text-nature-green">{portfolioForm.images.length}/50</span>
                  </div>
                  <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handlePortfolioFileChange} className="hidden" id="p-upload" />
                  <label htmlFor="p-upload" className="block w-full py-10 bg-stone-50 border-2 border-dashed rounded-xl text-center cursor-pointer hover:border-nature-green transition-theme">
                    <span className="text-stone-400 text-xs font-bold">이미지 선택 (여러 장 가능)</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2 mt-4 max-h-[300px] overflow-y-auto p-1">
                    {portfolioForm.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePortfolioImage(idx)} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 text-[10px] font-bold flex items-center justify-center">삭제</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">분류</label>
                    <select value={portfolioForm.category} onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value as Category })} className="w-full px-4 py-3 bg-stone-50 rounded-xl text-sm font-bold">
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">연도</label>
                    <input type="text" value={portfolioForm.year} onChange={(e) => setPortfolioForm({ ...portfolioForm, year: e.target.value })} className="w-full px-4 py-3 bg-stone-50 rounded-xl text-sm font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">제목</label>
                  <input type="text" required value={portfolioForm.title} onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })} className="w-full px-4 py-3 bg-stone-50 rounded-xl text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">위치</label>
                  <input type="text" value={portfolioForm.location} onChange={(e) => setPortfolioForm({ ...portfolioForm, location: e.target.value })} className="w-full px-4 py-3 bg-stone-50 rounded-xl text-sm font-bold" />
                </div>
              </div>
              <button type="submit" className="w-full mt-10 bg-nature-green text-white py-4 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg">저장하기</button>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-stone-400 text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-6">이미지</th>
                    <th className="px-8 py-6">정보</th>
                    <th className="px-8 py-6 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50 group transition-theme">
                      <td className="px-8 py-6">
                        <div className="w-24 h-16 rounded overflow-hidden">
                          <img src={item.images[0]} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold">{item.title}</div>
                        <div className="text-[11px] text-stone-400 font-bold uppercase">{item.category} / {item.location}</div>
                      </td>
                      <td className="px-8 py-6 text-right space-x-4">
                        <button onClick={() => handlePortfolioEdit(item)} className="text-sea-blue font-black uppercase text-[10px] underline">Edit</button>
                        <button onClick={() => {if(window.confirm('삭제하시겠습니까?')) onDeleteItem(item.id)}} className="text-red-400 font-black uppercase text-[10px] underline">Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-12">
          <form onSubmit={handleSettingsSubmit} className="bg-white p-16 rounded-3xl shadow-2xl border space-y-16">
            <div>
              <h3 className="text-xl font-black mb-8 border-b-2 border-stone-100 pb-4">1. 홈페이지 메인(Hero) 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">메인 배경 사진 (권장 2000px 이상)</label>
                  <div 
                    className="aspect-video bg-stone-50 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-stone-200 group"
                    onClick={() => heroInputRef.current?.click()}
                  >
                    <img src={configForm.heroImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <input type="file" ref={heroInputRef} className="hidden" accept="image/*" onChange={handleHeroFileChange} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">메인 타이틀 (줄바꿈 가능)</label>
                    <textarea value={configForm.heroTitle} onChange={e => setConfigForm({...configForm, heroTitle: e.target.value})} className="w-full p-4 bg-stone-50 rounded-xl font-bold h-24 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">서브 타이틀</label>
                    <textarea value={configForm.heroSubtitle} onChange={e => setConfigForm({...configForm, heroSubtitle: e.target.value})} className="w-full p-4 bg-stone-50 rounded-xl font-medium text-sm h-24 resize-none" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black mb-8 border-b-2 border-stone-100 pb-4">2. 작가 프로필(About) 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">프로필 사진</label>
                  <div 
                    className="aspect-[4/5] bg-stone-50 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-stone-200 group"
                    onClick={() => profileInputRef.current?.click()}
                  >
                    <img src={aboutForm.profileImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleProfileFileChange} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">활동명</label>
                    <input type="text" value={aboutForm.name} onChange={e => setAboutForm({...aboutForm, name: e.target.value})} className="w-full p-4 bg-stone-50 rounded-xl font-black text-2xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">철학 타이틀</label>
                    <textarea value={aboutForm.philosophyTitle} onChange={e => setAboutForm({...aboutForm, philosophyTitle: e.target.value})} className="w-full p-4 bg-stone-50 rounded-xl font-bold h-24 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">키워드 (쉼표로 구분)</label>
                    <input type="text" value={aboutForm.keywords.join(', ')} onChange={e => setAboutForm({...aboutForm, keywords: e.target.value.split(',').map(s => s.trim())})} className="w-full p-4 bg-stone-50 rounded-xl font-bold" />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">작가 상세 소개</label>
                <textarea value={aboutForm.philosophyDescription} onChange={e => setAboutForm({...aboutForm, philosophyDescription: e.target.value})} className="w-full p-6 bg-stone-50 rounded-2xl font-medium text-stone-600 h-64 leading-relaxed" />
              </div>
            </div>

            <button type="submit" className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-2xl hover:bg-nature-green transition-theme">
              사이트 및 프로필 설정 전체 업데이트
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
