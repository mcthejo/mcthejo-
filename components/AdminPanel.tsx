
import React, { useState, useRef, useEffect } from 'react';
import { Category, PortfolioItem } from '../types';

interface AdminPanelProps {
  items: PortfolioItem[];
  onAddItem: (item: PortfolioItem) => void;
  onUpdateItem: (item: PortfolioItem) => void;
  onDeleteItem: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ items, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    images: [] as string[],
    category: Category.LANDSCAPE,
    title: '',
    location: '',
    year: new Date().getFullYear().toString()
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const base64Promises = fileArray.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(base64Promises);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      images: [...item.images],
      category: item.category,
      title: item.title,
      location: item.location,
      year: item.year
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      images: [],
      category: Category.LANDSCAPE,
      title: '',
      location: '',
      year: new Date().getFullYear().toString()
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0 || !formData.title) {
      alert('사진과 제목은 필수입니다.');
      return;
    }
    
    if (editingItem) {
      onUpdateItem({
        ...formData,
        id: editingItem.id
      });
    } else {
      onAddItem({
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      });
    }
    
    resetForm();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-40 px-6">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-2xl shadow-2xl border border-stone-100">
          <div className="flex justify-center mb-8">
            <span className="w-4 h-4 rounded-full bg-nature-green animate-pulse"></span>
          </div>
          <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-widest">Admin Login</h2>
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
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-24 px-6">
      <div className="flex justify-between items-end mb-16 border-b-4 border-stone-900 pb-8">
        <div>
          <span className="text-xs font-black tracking-[0.4em] text-sea-blue uppercase mb-4 block">Dashboard</span>
          <h1 className="text-5xl font-black tracking-tighter">포트폴리오 관리</h1>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-stone-300 font-black uppercase tracking-widest text-[10px] hover:text-stone-900"
        >
          Logout Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-xl border border-stone-50 sticky top-28">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold uppercase tracking-tight">
                {editingItem ? '포트폴리오 수정' : '새 포트폴리오 추가'}
              </h3>
              {editingItem && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="text-[10px] font-black text-stone-300 uppercase tracking-widest hover:text-red-500 transition-theme"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">사진 관리</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="block w-full px-4 py-8 bg-stone-50 border-2 border-dashed border-stone-200 hover:border-nature-green rounded text-center cursor-pointer transition-theme"
                >
                  <div className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                    클릭하여 사진 추가
                  </div>
                </label>
                
                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded overflow-hidden border border-stone-100 group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-4 py-3 bg-stone-50 border-2 border-transparent focus:border-sea-blue focus:bg-white rounded text-sm outline-none transition-theme font-bold"
                  >
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">연도</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border-2 border-transparent focus:border-sky-blue focus:bg-white rounded text-sm outline-none transition-theme font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">제목</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-transparent focus:border-nature-green focus:bg-white rounded text-sm outline-none transition-theme font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">촬영 장소</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-transparent focus:border-nature-green focus:bg-white rounded text-sm outline-none transition-theme font-bold"
                />
              </div>
            </div>
            <button type="submit" className={`w-full mt-10 text-white py-4 rounded font-black uppercase tracking-[0.4em] text-[11px] transition-theme shadow-lg ${editingItem ? 'bg-sea-blue hover:bg-nature-green' : 'bg-nature-green hover:bg-sea-blue'}`}>
              {editingItem ? '포트폴리오 수정하기' : '포트폴리오 저장하기'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 text-stone-400 text-[10px] uppercase tracking-[0.3em] font-black">
                <tr>
                  <th className="px-8 py-6">Image</th>
                  <th className="px-8 py-6">Information</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-stone-300 font-bold italic tracking-widest uppercase">No assets found</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className={`hover:bg-stone-50 transition-theme group ${editingItem?.id === item.id ? 'bg-stone-50' : ''}`}>
                      <td className="px-8 py-6">
                        <div className="relative w-32 h-20">
                          <img src={item.images[0]} alt="" className="w-full h-full object-cover rounded shadow-sm group-hover:shadow-md transition-theme ring-2 ring-transparent group-hover:ring-nature-green" />
                          {item.images.length > 1 && (
                            <div className="absolute -top-2 -right-2 bg-nature-green text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                              +{item.images.length - 1}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-stone-900 text-lg mb-1">
                          {item.title}
                          {editingItem?.id === item.id && <span className="ml-3 text-[10px] text-sea-blue uppercase tracking-widest font-black">(Editing)</span>}
                        </div>
                        <div className="flex gap-2 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                          <span className="text-sea-blue">{item.category}</span>
                          <span>/</span>
                          <span>{item.location}</span>
                          <span>/</span>
                          <span>{item.year}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-stone-400 hover:text-sea-blue transition-theme text-[10px] font-black uppercase tracking-[0.2em] underline decoration-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('정말 삭제하시겠습니까?')) onDeleteItem(item.id);
                            }}
                            className="text-stone-300 hover:text-red-500 transition-theme text-[10px] font-black uppercase tracking-[0.2em] underline decoration-2"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
