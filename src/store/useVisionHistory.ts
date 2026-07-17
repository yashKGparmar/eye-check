import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TestScores, EnvironmentData, QuestionnaireData } from './useVisionTest';
import { AnalysisResult } from '@/lib/scoringEngine';

export type HistoryEntry = {
  id: string;
  date: string;
  scores: TestScores;
  environment: EnvironmentData;
  questionnaire: QuestionnaireData;
  results: AnalysisResult;
};

interface VisionHistoryState {
  history: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'date'>) => void;
  clearHistory: () => void;
}

export const useVisionHistory = create<VisionHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addEntry: (entry) => set((state) => ({
        history: [
          {
            ...entry,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
          },
          ...state.history,
        ]
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'vision-history-storage',
    }
  )
);
