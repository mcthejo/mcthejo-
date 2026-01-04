
export enum Category {
  LANDSCAPE = '풍경',
  FOOD = '음식',
  PEOPLE = '인물스냅',
  PERFORMANCE = '공연',
  FILM = '필름'
}

export interface PortfolioItem {
  id: string;
  images: string[]; // 다중 이미지를 위한 배열로 변경
  category: Category;
  title: string;
  location: string;
  year: string;
}

export interface InquiryFormData {
  name: string;
  type: string;
  schedule: string;
  contact: string;
  message: string;
}
