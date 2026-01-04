
export enum Category {
  LANDSCAPE = '풍경',
  FOOD = '음식',
  PEOPLE = '인물스냅',
  PERFORMANCE = '공연',
  FILM = '필름'
}

export interface PortfolioItem {
  id: string;
  images: string[];
  category: Category;
  title: string;
  location: string;
  year: string;
}

export interface AboutContent {
  profileImage: string;
  name: string;
  philosophyTitle: string;
  philosophyDescription: string;
  keywords: string[];
}

export interface SiteConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface InquiryFormData {
  name: string;
  type: string;
  schedule: string;
  contact: string;
  message: string;
}
