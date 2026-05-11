import { z } from 'zod';

export interface EmissionFactor {
  id?: string;
  category: string;
  activity: string;
  factor: number;
  unit: string;
  source: string;
}

export interface GlossaryTerm {
  id?: string;
  term: string;
  definition: string;
  category: string;
  source?: string;
}

export interface Reference {
  id?: string;
  title: string;
  authors: string;
  year: number;
  journal?: string;
  doi?: string;
  url?: string;
  type: 'article' | 'book' | 'report' | 'thesis' | 'website';
  abntCitation?: string;
}

export interface CarbonCalculation {
  id?: string;
  userId: string;
  date: string;
  transport: number;
  energy: number;
  food: number;
  waste: number;
  total: number;
  breakdown: Record<string, number>;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UsefulLink {
  id?: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
}

export interface MediaContent {
  id?: string;
  title: string;
  type: 'video' | 'image' | 'document' | 'audio';
  url: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
}

export interface UserProgress {
  userId: string;
  quizScores: Record<string, number>;
  completedActivities: string[];
  carbonFootprint?: number;
  lastUpdated: string;
}

export interface Activity {
  id?: string;
  title: string;
  description: string;
  type: 'quiz' | 'simulation' | 'calculation' | 'research';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  objectives: string[];
}

export const carbonFormSchema = z.object({
  transport: z.number().min(0),
  energy: z.number().min(0),
  food: z.number().min(0),
  waste: z.number().min(0),
});

export const referenceSchema = z.object({
  title: z.string().min(1),
  authors: z.string().min(1),
  year: z.number().min(1900).max(2100),
  journal: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().optional(),
  type: z.enum(['article', 'book', 'report', 'thesis', 'website']),
});

export type CarbonFormData = z.infer<typeof carbonFormSchema>;
export type ReferenceFormData = z.infer<typeof referenceSchema>;
