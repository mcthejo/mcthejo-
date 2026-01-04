
import { Category, PortfolioItem, AboutContent, SiteConfig } from './types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    images: ['https://images.unsplash.com/photo-1590615370581-265ae19a053b?q=80&w=1200&auto=format&fit=crop'],
    category: Category.LANDSCAPE,
    title: '은평의 오후',
    location: '은평 한옥마을',
    year: '2024'
  },
  {
    id: '2',
    images: ['https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1200&auto=format&fit=crop'],
    category: Category.FOOD,
    title: '정갈한 한 상',
    location: '전주',
    year: '2024'
  },
  {
    id: '3',
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop'],
    category: Category.PEOPLE,
    title: '도시의 시선',
    location: '서울',
    year: '2024'
  }
];

export const INITIAL_ABOUT: AboutContent = {
  profileImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
  name: 'mcthejo',
  philosophyTitle: '기록하는 마음으로 오늘을 담습니다.',
  philosophyDescription: '카메라로 기록하는 것을 좋아합니다.\n\n특별한 연출보다는 그 순간의 공기와 표정을 담는 촬영을 지향합니다. 누군가에게 보여주기 위한 사진보다는, 나중에 다시 보았을 때 그날의 감정이 고스란히 떠오르는 사진을 찍고 싶습니다.\n\n취미로 시작했지만, 누군가에게는 오래 남을 기록이 되길 바랍니다. 한국의 골목길, 시장의 시끄러움, 그리고 그 속에 살아가는 사람들의 진솔한 미소를 사랑합니다.',
  keywords: ['자연광', '일상', '기록', '과하지 않은 보정', '골목길']
};

export const INITIAL_SITE_CONFIG: SiteConfig = {
  heroImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=2400&auto=format&fit=crop',
  heroTitle: '한국의 풍경과\n사람을 기록합니다.',
  heroSubtitle: '지역의 공기, 음식의 온기, 그리고 사람의 표정을 담는\n취미 사진가입니다.'
};
