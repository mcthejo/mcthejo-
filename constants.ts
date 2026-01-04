
import { Category, PortfolioItem } from './types';

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
  },
  {
    id: '4',
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop'],
    category: Category.PERFORMANCE,
    title: '조명 아래의 열기',
    location: '홍대 공연장',
    year: '2023'
  },
  {
    id: '5',
    images: ['https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1200&auto=format&fit=crop'],
    category: Category.FILM,
    title: '오래된 기억의 입자',
    location: '강릉 바다',
    year: '2022'
  }
];
