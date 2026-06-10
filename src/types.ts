/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  name: string;
  birthDate: string;
  description: string;
  currentFocus: string;
  roles: string[];
}

export interface Project {
  title: string;
  description: string;
  link: string;
  icon?: string;
  type: 'work' | 'app';
}

export interface SocialLink {
  platform: string;
  handle: string;
  link: string;
  icon: string;
}

export interface Dream {
  title: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface LifePhase {
  age: string;
  title: string;
  description: string;
  items: string[];
  status: 'planned' | 'in-progress' | 'completed';
}

export interface SkillTarget {
  name: string;
  target: string;
  plan: string;
}

export interface SkillGroup {
  category: string;
  skills: SkillTarget[];
}

export interface DeviceSpec {
  name: string;
  model: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface EducationTarget {
  title: string;
  campus: string;
  strategy: string;
  perks: string;
}

export interface CareerGoal {
  title: string;
  reason: string;
  salary: string;
}

export interface MasterPlanData {
  profile: {
    name: string;
    domisili: string;
    kelebihan: string;
    proyek: string[];
  };
  interests: string[];
  education: {
    s1: EducationTarget[];
    s2: EducationTarget[];
  };
  career: {
    targetGaji: string;
    lokasi: string;
    karakter: string;
    tujuanAkhir: string;
  };
  familyBusiness: {
    retail: string;
    properti: string;
    finansial: string;
  };
  recommendations: CareerGoal[];
  integration: { phase: string; title: string; description: string }[];
  offGrid: {
    budget: string;
    timeline: string;
    pillars: { title: string; items: string[] }[];
  };
  lifePhases: LifePhase[];
  skillTargets: SkillGroup[];
  deviceSpecs: DeviceSpec[];
  physical: { category: string; target: string; items: string[] }[];
}

export interface BlogPost {
  title: string;
  summary: string;
  date: string;
}

// Mini App: Practice Questions Types
export type Language = 'id' | 'en';

export type AppView = 'MAIN_SITE' | 'PRACTICE_APP' | 'QURAN_APP' | 'EXAM_COMPARISON_APP';

export type PracticeMode = 'FLASHCARD' | 'MCQ';

export type PracticeView = 'MENU' | 'INPUT' | 'REVIEW' | 'QUIZ';

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation?: string;
}
