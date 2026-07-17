import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'gu';
export type TestMode = 'standard' | 'child';
export type TestType = 'quick' | 'full' | null;

interface AppConfigState {
  language: Language;
  testMode: TestMode;
  testType: TestType;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;

  setLanguage: (lang: Language) => void;
  setTestMode: (mode: TestMode) => void;
  setTestType: (type: TestType) => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
}

export const useAppConfig = create<AppConfigState>()(
  persist(
    (set) => ({
      language: 'en',
      testMode: 'standard',
      testType: null,
      highContrast: false,
      largeText: false,
      reducedMotion: false,

      setLanguage: (lang) => set({ language: lang }),
      setTestMode: (mode) => set({ testMode: mode }),
      setTestType: (type) => set({ testType: type }),
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      toggleLargeText: () => set((state) => ({ largeText: !state.largeText })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: 'vision-app-config',
    }
  )
);
