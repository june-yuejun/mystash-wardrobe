
import { WardrobeItem, Outfit } from './types';

export const MOCK_ITEMS: WardrobeItem[] = [
  {
    id: '1',
    name: 'Basic Tee',
    category: 'T-Shirts',
    colorway: 'Classic White',
    season: ['Summer', 'Spring'],
    tags: ['Cotton', 'Essential'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyUhPdEneQ9oW-E_IzbwKBBgSgHASgtSM6N2iAgMnS3fbsPW5AP0QYxPRXoK0767yiG0jNSCxCSSxry0j5VcukKeNq-P9Lz0eApaH60VuzGYgDHs30CU7jhD0op1WlggZtv3gr6taiXlwXweqCzA63ii1QfBY3sivgyw1BYNAoVNTFIqH2Y-6lHJtG9l3P3VXGf1U3v0CK5qGKn2b5ohb9lpRGd2iVwf4nTIFE4fxOckP3G5_Tpz_EySSloDRMUj2XGqJdjxtJcKYE',
    createdAt: 'Today'
  },
  {
    id: '2',
    name: 'Slim Jeans',
    category: 'Jeans',
    colorway: 'Deep Indigo',
    season: ['Autumn', 'Winter'],
    tags: ['Denim', 'Stretch'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCONyh1Mr9CwRCLvLeJK3Q-iLG6OmmRPskqTi_edTbW5hEfnxzifB6xcVjty5KKKkxXJPb1Q4SFAg0kSU2s9FWVQJ4ledDLBMQE32a5zZT--KCAoarK8Mla-BK1OP83_yK-eHxTbAJp63oO7-G1_OBivXnouhd9exSZF8g5gEsEG-6UfN2RizRhkIBtmWgj_8q9712IWVph5sWwDoaTeZhynpyiMp7SMJ4OwjlX-8RtIzcy4gEp1-gK72-LuW_s1MDHBsOf_C645k6j',
    createdAt: 'Yesterday'
  },
  {
    id: '3',
    name: 'Biker Jacket',
    category: 'Jackets',
    colorway: 'Midnight Black',
    season: ['Winter'],
    tags: ['Leather', 'Edgy'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALMl3GmHtK-rBnJRtRkz-_DZYvpOTZnzsssl1mij5cYQ6zCBs0LAUm5LTsM_7UdjS0yQIIyHnHbTbz3mxA3v_ceL8BkQdhWTbqYoMHUFVMUdC_ErQUqwY8RnOZbmwfkBl70_NOsyiM8p22ZEPgOavjTJk0wf5FqddH0B6qlVO8DZbqS3WoUmkfwLRJfqP4OfJsqKP8qZmrBZlrd7lloqMOyO8SMoVqPHdiwta7ocXYMPg2SMbkE1aUSy3JN0XQ0SI6hstAcPidO-mV',
    createdAt: '2d ago'
  },
  {
    id: '4',
    name: 'Retro Logo Tee',
    category: 'T-Shirts',
    colorway: 'Sun Yellow',
    season: ['Summer'],
    tags: ['Graphic', 'Vintage'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyUhPdEneQ9oW-E_IzbwKBBgSgHASgtSM6N2iAgMnS3fbsPW5AP0QYxPRXoK0767yiG0jNSCxCSSxry0j5VcukKeNq-P9Lz0eApaH60VuzGYgDHs30CU7jhD0op1WlggZtv3gr6taiXlwXweqCzA63ii1QfBY3sivgyw1BYNAoVNTFIqH2Y-6lHJtG9l3P3VXGf1U3v0CK5qGKn2b5ohb9lpRGd2iVwf4nTIFE4fxOckP3G5_Tpz_EySSloDRMUj2XGqJdjxtJcKYE',
    createdAt: '3d ago'
  },
  {
    id: '5',
    name: 'Mom Jeans',
    category: 'Jeans',
    colorway: 'Light Wash',
    season: ['Spring', 'Autumn'],
    tags: ['Relaxed', '90s'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCONyh1Mr9CwRCLvLeJK3Q-iLG6OmmRPskqTi_edTbW5hEfnxzifB6xcVjty5KKKkxXJPb1Q4SFAg0kSU2s9FWVQJ4ledDLBMQE32a5zZT--KCAoarK8Mla-BK1OP83_yK-eHxTbAJp63oO7-G1_OBivXnouhd9exSZF8g5gEsEG-6UfN2RizRhkIBtmWgj_8q9712IWVph5sWwDoaTeZhynpyiMp7SMJ4OwjlX-8RtIzcy4gEp1-gK72-LuW_s1MDHBsOf_C645k6j',
    createdAt: '4d ago'
  },
  {
    id: '6',
    name: 'Summer Sundress',
    category: 'Dresses',
    colorway: 'Pink Floral',
    season: ['Summer'],
    tags: ['Flowy', 'Cute'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ok1rEG0NSq6XZr20otYzOGiV8z_-Olu0_F5s9MkkUkHZa5HmpKeXcQnaeUZMFYsq__nWU209qu8MgLnj1cA5pKCJVasuKm2NAQavDx2fph94i6WpXSqwR-ZQiNMueRmxXw2Q0QiWRvzzyaFiTmFZAb8M6wnGV9s7oB9S4Lx5Wqcik7De9p63Wzjhl_8dHRsc915KTEfEVtMZcY-PV5DsxrzdkMDWOKVmZHsdxPbC39WE4C6OUKmScVX7fN2x4mOCHOJh6qJQ-rBu',
    createdAt: '5d ago'
  },
  {
    id: '7',
    name: 'Denim Jacket',
    category: 'Jackets',
    colorway: 'Acid Wash',
    season: ['Spring', 'Autumn'],
    tags: ['Layering', 'Rugged'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALMl3GmHtK-rBnJRtRkz-_DZYvpOTZnzsssl1mij5cYQ6zCBs0LAUm5LTsM_7UdjS0yQIIyHnHbTbz3mxA3v_ceL8BkQdhWTbqYoMHUFVMUdC_ErQUqwY8RnOZbmwfkBl70_NOsyiM8p22ZEPgOavjTJk0wf5FqddH0B6qlVO8DZbqS3WoUmkfwLRJfqP4OfJsqKP8qZmrBZlrd7lloqMOyO8SMoVqPHdiwta7ocXYMPg2SMbkE1aUSy3JN0XQ0SI6hstAcPidO-mV',
    createdAt: '6d ago'
  }
];

export const MOCK_OUTFITS: Outfit[] = [
  {
    id: 'o1',
    name: 'Monday Minimalist',
    items: [MOCK_ITEMS[0], MOCK_ITEMS[1]],
    tags: ['Work', 'Essential'],
    season: 'Spring',
    year: 2024,
    isFavorite: true
  },
  {
    id: 'o2',
    name: 'Weekend Chill',
    items: [MOCK_ITEMS[0]],
    tags: ['Casual'],
    season: 'Summer',
    year: 2024,
    isFavorite: false
  }
];
