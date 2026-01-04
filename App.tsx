
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import PortfolioGrid from './components/PortfolioGrid.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { INITIAL_PORTFOLIO, INITIAL_ABOUT, INITIAL_SITE_CONFIG } from './constants.ts';
import { PortfolioItem, Category, AboutContent, SiteConfig } from './types.ts';
import { storage } from './storage.ts';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>(INITIAL_ABOUT);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);

  // 초기 데이터 로드 (IndexedDB)
  useEffect(() => {
    const initApp = async () => {
      try {
        await storage.init();
        
        const [savedPortfolio, savedAbout, savedConfig] = await Promise.all([
          storage.get('record_portfolio'),
          storage.get('record_about'),
          storage.get('record_config')
        ]);

        if (savedPortfolio) setPortfolioItems(savedPortfolio);
        else setPortfolioItems(INITIAL_PORTFOLIO);

        if (savedAbout) setAboutContent(savedAbout);
        if (savedConfig) setSiteConfig(savedConfig);
      } catch (e) {
        console.error("데이터 로드 중 오류 발생:", e);
        setPortfolioItems(INITIAL_PORTFOLIO);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (!isLoading && portfolioItems.length > 0) {
      storage.set('record_portfolio', portfolioItems);
    }
  }, [portfolioItems, isLoading]);

  useEffect(() => {
    if (!isLoading) storage.set('record_about', aboutContent);
  }, [aboutContent, isLoading]);

  useEffect(() => {
    if (!isLoading) storage.set('record_config', siteConfig);
  }, [siteConfig, isLoading]);

  const handleAddItem = (item: PortfolioItem) => {
    setPortfolioItems([item, ...portfolioItems]);
  };

  const handleUpdateItem = (updatedItem: PortfolioItem) => {
    setPortfolioItems(portfolioItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter(i => i.id !== id));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-4 border-nature-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-stone-400 text-xs font-bold tracking-widest uppercase">Archive Loading</p>
      </div>
    );
  }

  const renderSection = () => {
    if (activeSection === 'admin') {
      return (
        <AdminPanel 
          items={portfolioItems} 
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          aboutContent={aboutContent}
          onUpdateAbout={setAboutContent}
          siteConfig={siteConfig}
          onUpdateConfig={setSiteConfig}
        />
      );
    }

    switch (activeSection) {
      case 'home':
        return (
          <div className="fade-in">
            <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
              <img 
                src={siteConfig.heroImage} 
                alt="Main Hero"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = INITIAL_SITE_CONFIG.heroImage; }}
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 text-center text-white px-6">
                <h1 className="text-4xl md:text-7xl font-extrabold mb-8 leading-[1.15] tracking-tight whitespace-pre-line">
                  {siteConfig.heroTitle}
                </h1>
                <p className="text-lg md:text-xl font-medium mb-12 tracking-wide opacity-90 max-w-2xl mx-auto drop-shadow-md whitespace-pre-line">
                  {siteConfig.heroSubtitle}
                </p>
                <button 
                  onClick={() => setActiveSection('contact')}
                  className="bg-white text-black px-12 py-5 rounded-full text-sm font-bold tracking-[0.2em] hover:bg-stone-100 transition-theme shadow-lg uppercase"
                >
                  인물 스냅 촬영 문의하기
                </button>
              </div>
            </section>

            <section className="py-32 max-w-7xl mx-auto px-6">
              <div className="mb-20 text-center">
                <span className="text-xs font-black tracking-[0.3em] text-sea-blue uppercase mb-4 block">Archives</span>
                <h2 className="text-3xl font-bold tracking-tight">일상의 시선</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {Object.values(Category).map((cat) => {
                  const item = portfolioItems.find(i => i.category === cat);
                  return (
                    <div 
                      key={cat}
                      className="group cursor-pointer"
                      onClick={() => setActiveSection('portfolio')}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-stone-100 mb-6 relative rounded-sm">
                        <img 
                          src={item?.images[0] || `https://images.unsplash.com/photo-1542353436-312f0295493c?q=80&w=800&auto=format&fit=crop`} 
                          alt={cat}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 border-[0px] group-hover:border-[8px] border-white/20 transition-all duration-500"></div>
                      </div>
                      <h3 className="text-lg font-bold mb-1 group-hover:text-sea-blue transition-theme tracking-tight text-center">{cat}</h3>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        );

      case 'portfolio':
        return <PortfolioGrid items={portfolioItems} />;

      case 'about':
        return (
          <section className="py-32 max-w-5xl mx-auto px-6 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-2xl relative">
                <img src={aboutContent.profileImage} alt={aboutContent.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-6 py-4">
                  <p className="text-xs font-black tracking-widest text-nature-green uppercase">Photographer</p>
                  <p className="text-xl font-bold">{aboutContent.name}</p>
                </div>
              </div>
              <div className="space-y-10">
                <div>
                  <span className="text-xs font-black tracking-[0.3em] text-sea-blue uppercase mb-4 block">Philosophy</span>
                  <h2 className="text-4xl font-bold tracking-tight leading-tight whitespace-pre-line">{aboutContent.philosophyTitle}</h2>
                </div>
                <div className="space-y-6 text-stone-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {aboutContent.philosophyDescription}
                </div>
                <div className="pt-8 border-t border-stone-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 mb-6">Style Keywords</h4>
                  <div className="flex flex-wrap gap-3">
                    {aboutContent.keywords.map(tag => (
                      <span key={tag} className="px-5 py-2 bg-stone-50 text-stone-700 text-xs font-bold rounded-full border border-stone-100 hover:border-nature-green transition-theme">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'snap':
        return (
          <section className="py-32 bg-stone-50 fade-in">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-24">
                <span className="text-xs font-black tracking-[0.3em] text-sea-blue uppercase mb-4 block">Guide</span>
                <h2 className="text-5xl font-bold tracking-tight">Snap Shooting</h2>
              </div>
              
              <div className="space-y-32">
                <div>
                  <h3 className="text-xs font-black tracking-[0.3em] uppercase text-stone-300 mb-10 flex items-center">
                    <span className="w-12 h-[2px] bg-nature-green mr-6"></span> 대상 SERVICE
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {['개인 프로필', '커플 스냅', '일상 기록', '소규모 행사'].map(item => (
                      <div key={item} className="bg-white p-10 border border-stone-100 text-center font-bold text-xl hover:border-sky-blue transition-theme shadow-sm">{item}</div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-stone-300 mb-10 flex items-center">
                      <span className="w-12 h-[2px] bg-sky-blue mr-6"></span> 특징 FEATURE
                    </h3>
                    <div className="space-y-8 text-stone-800 font-bold text-lg leading-relaxed">
                      <p className="flex items-start gap-4"><span className="text-nature-green mt-1">•</span> 억지스러운 포즈 보다는 <br/>자연스러운 움직임을 담습니다.</p>
                      <p className="flex items-start gap-4"><span className="text-sea-blue mt-1">•</span> 편안한 산책을 하며 <br/>이야기를 나누듯 촬영합니다.</p>
                      <p className="flex items-start gap-4"><span className="text-sky-blue mt-1">•</span> 과한 보정보다는 <br/>그 사람만의 매력을 강조합니다.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-stone-300 mb-10 flex items-center">
                      <span className="w-12 h-[2px] bg-sea-blue mr-6"></span> 과정 PROCESS
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                      {[
                        { step: '01', title: '문의 및 접수', desc: '일정 및 장소 확인' },
                        { step: '02', title: '컨셉 협의', desc: '의상 및 무드 가이드' },
                        { step: '03', title: '촬영 진행', desc: '현장에서의 1-2시간' },
                        { step: '04', title: '최종 전달', desc: '보정본 이메일 전송' },
                      ].map(item => (
                        <div key={item.step} className="group">
                          <div className="text-4xl font-black text-stone-100 group-hover:text-sky-blue transition-theme mb-3">{item.step}</div>
                          <h4 className="font-bold text-stone-900 mb-2">{item.title}</h4>
                          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section className="py-32 max-w-6xl mx-auto px-6 fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              <div>
                <span className="text-xs font-black tracking-[0.3em] text-sea-blue uppercase mb-4 block">Reservation</span>
                <h2 className="text-5xl font-bold tracking-tight mb-8">Contact</h2>
                <p className="text-stone-500 font-medium text-lg leading-relaxed mb-16">
                  기록하고 싶은 순간이 있다면 함께 이야기하고 싶습니다. <br />
                  {aboutContent.name}의 시선으로 당신의 오늘을 담아드릴게요.
                </p>
                
                <div className="space-y-12">
                  <div className="flex gap-8 items-center group">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 group-hover:bg-nature-green group-hover:text-white transition-theme">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 mb-1">Email</p>
                      <p className="text-xl font-bold">mchtejo89@naver.com</p>
                    </div>
                  </div>
                  <div className="flex gap-8 items-center group">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 group-hover:bg-sea-blue group-hover:text-white transition-theme">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 mb-1">Instagram</p>
                      <p className="text-xl font-bold">@mcthejo</p>
                      <p className="text-xs font-bold text-sky-blue mt-1 uppercase tracking-widest">DM Enquiry welcome</p>
                    </div>
                  </div>
                </div>
              </div>

              <form 
                className="bg-white p-12 shadow-2xl space-y-8 rounded-xl border border-stone-50"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('문의가 접수되었습니다. 곧 연락드리겠습니다.');
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">Your Name</label>
                    <input type="text" required className="w-full px-5 py-4 bg-stone-50 border-transparent border-2 focus:border-nature-green focus:bg-white outline-none transition-theme font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">Contact</label>
                    <input type="text" required className="w-full px-5 py-4 bg-stone-50 border-transparent border-2 focus:border-sea-blue focus:bg-white outline-none transition-theme font-bold" placeholder="010-0000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">Service Type</label>
                  <select className="w-full px-5 py-4 bg-stone-50 border-transparent border-2 focus:border-sky-blue focus:bg-white outline-none transition-theme font-bold">
                    <option>개인 프로필</option>
                    <option>커플/우정 스냅</option>
                    <option>행사 및 공연 기록</option>
                    <option>기타 상업 문의</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3">Details</label>
                  <textarea rows={6} className="w-full px-5 py-4 bg-stone-50 border-transparent border-2 focus:border-sea-blue focus:bg-white outline-none transition-theme font-bold resize-none" placeholder="원하시는 촬영 날짜와 장소, 분위기를 적어주세요."></textarea>
                </div>
                <button className="w-full bg-black text-white py-6 font-black tracking-[0.4em] uppercase hover:bg-stone-800 transition-theme shadow-xl active:scale-95">
                  Send Message
                </button>
              </form>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <Layout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      isAdmin={activeSection === 'admin'}
      setIsAdmin={(val) => val && setActiveSection('admin')}
      siteName={aboutContent.name}
    >
      {renderSection()}
    </Layout>
  );
};

export default App;
