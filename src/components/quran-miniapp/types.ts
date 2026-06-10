export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  translation?: string;
  transliteration?: string;
}

export type MistakeType = 'forgot' | 'tajwid';

export interface Mistake {
  ayahIndex: number;
  wordIndex: number;
  type: MistakeType;
}

export interface DisplaySettings {
  theme: 'light' | 'dark';
  fontSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  language: 'en' | 'id' | 'es';
}

export interface MemorizationStats {
  accuracy: number;
  totalWords: number;
  mistakes: Mistake[];
  startTime: number;
  endTime: number;
}

export type ViewState = 'LIST_VIEW' | 'READING_VIEW' | 'MEMORIZATION_VIEW' | 'ANALYSIS_VIEW';
