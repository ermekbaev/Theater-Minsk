export type Emotion = 'joy' | 'melancholy' | 'tension' | 'passion' | 'wonder' | 'sadness';

export interface EmotionScore {
  emotion: Emotion;
  score: number; // 0-100
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number; // 1-5
  text: string;
  emotionScores: EmotionScore[];
}

export interface Performance {
  id: string;
  title: string;
  theater: string;
  genre: string;
  duration: string;
  director: string;
  synopsis: string;
  imageUrl: string;
  heroImageUrl?: string;
  rating: number;
  reviewCount: number;
  emotionProfile: EmotionScore[];
  targetAudience: string[];
  reviews: Review[];
  premiere: string;
  cast: string[];
}

export const EMOTIONS_MAP: Record<Emotion, { label: string; color: string }> = {
  joy: { label: 'Радость', color: 'hsl(45, 96%, 56%)' },
  melancholy: { label: 'Меланхолия', color: 'hsl(213, 94%, 68%)' },
  tension: { label: 'Напряжение', color: 'hsl(263, 70%, 71%)' },
  passion: { label: 'Страсть', color: 'hsl(0, 94%, 71%)' },
  wonder: { label: 'Восторг', color: 'hsl(160, 60%, 50%)' },
  sadness: { label: 'Грусть', color: 'hsl(220, 50%, 55%)' },
};

export const THEATERS = [
  'Национальный академический театр имени Янки Купалы',
  'Национальный академический драматический театр имени М. Горького',
  'Белорусский государственный молодёжный театр',
  'Республиканский театр белорусской драматургии',
  'Минский областной драматический театр',
  'Театр-студия киноактёра',
];

export const THEATER_SHORT: Record<string, string> = {
  'Национальный академический театр имени Янки Купалы': 'Купаловский',
  'Национальный академический драматический театр имени М. Горького': 'Горьковский',
  'Белорусский государственный молодёжный театр': 'Молодёжный',
  'Республиканский театр белорусской драматургии': 'РТБД',
  'Минский областной драматический театр': 'Областной',
  'Театр-студия киноактёра': 'Киноактёр',
};

export const GENRES = ['Драма', 'Комедия', 'Трагедия', 'Мюзикл', 'Трагикомедия', 'Классика'];

export const MOODS = [
  { id: 'uplifting', label: 'Хочу поднять настроение', emotions: ['joy', 'wonder'] as Emotion[] },
  { id: 'deep', label: 'Хочу задуматься', emotions: ['melancholy', 'sadness'] as Emotion[] },
  { id: 'thrilling', label: 'Хочу острых ощущений', emotions: ['tension', 'passion'] as Emotion[] },
  { id: 'romantic', label: 'Романтическое настроение', emotions: ['passion', 'wonder'] as Emotion[] },
];
