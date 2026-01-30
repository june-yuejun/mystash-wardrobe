
export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  colorway: string;
  season: string[];
  tags: string[];
  imageUrl: string;
  createdAt: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: WardrobeItem[];
  tags: string[];
  season: string;
  year: number;
  isFavorite: boolean;
}

export interface CalendarEvent {
  date: string;
  outfitId: string;
}
