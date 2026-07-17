import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EnvironmentData = {
  lighting: 'good' | 'fair' | 'poor' | null;
  brightness: boolean;
  distance: string;
  wearingGlasses: boolean | null;
  contactLenses: boolean | null;
};

export type TestScores = {
  distanceLeft: number | null;
  distanceRight: number | null;
  distanceBoth: number | null;
  near: number | null;
  astigmatism: boolean | null;
  contrast: number | null;
  color: number | null;
  eyeDominance: 'left' | 'right' | null;
  depthPerception: number | null;
  amslerGridDistortion: boolean | null;
  peripheralVision: number | null;
};

export type QuestionnaireData = {
  blurVision: boolean;
  headache: boolean;
  eyeStrain: boolean;
  doubleVision: boolean;
  nightDrivingIssues: boolean;
  dryEyes: boolean;
  squinting: boolean;
  screenFatigue: boolean;
  duration: string;
  age: string;
  previousPrescription: boolean | null;
  familyHistory: string;
};

interface VisionTestState {
  // Test Progress
  currentStepIndex: number;
  
  // Data
  environment: EnvironmentData;
  scores: TestScores;
  questionnaire: QuestionnaireData;
  isTestComplete: boolean;

  // Actions
  setStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateEnvironment: (data: Partial<EnvironmentData>) => void;
  updateScore: (key: keyof TestScores, value: string | number | boolean | null) => void;
  updateQuestionnaire: (data: Partial<QuestionnaireData>) => void;
  setTestComplete: (val: boolean) => void;
  resetTest: () => void;
}

const initialEnv: EnvironmentData = {
  lighting: null,
  brightness: false,
  distance: '',
  wearingGlasses: null,
  contactLenses: null,
};

const initialScores: TestScores = {
  distanceLeft: null,
  distanceRight: null,
  distanceBoth: null,
  near: null,
  astigmatism: null,
  contrast: null,
  color: null,
  eyeDominance: null,
  depthPerception: null,
  amslerGridDistortion: null,
  peripheralVision: null,
};

const initialQuestionnaire: QuestionnaireData = {
  blurVision: false,
  headache: false,
  eyeStrain: false,
  doubleVision: false,
  nightDrivingIssues: false,
  dryEyes: false,
  squinting: false,
  screenFatigue: false,
  duration: '',
  age: '',
  previousPrescription: null,
  familyHistory: '',
};

export const useVisionTest = create<VisionTestState>()(
  persist(
    (set) => ({
      currentStepIndex: 0,
      environment: initialEnv,
      scores: initialScores,
      questionnaire: initialQuestionnaire,
      isTestComplete: false,

      setStep: (index) => set({ currentStepIndex: index }),
      nextStep: () => set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
      prevStep: () => set((state) => ({ currentStepIndex: Math.max(0, state.currentStepIndex - 1) })),
      
      updateEnvironment: (data) => set((state) => ({
        environment: { ...state.environment, ...data }
      })),
      
      updateScore: (key, value) => set((state) => ({
        scores: { ...state.scores, [key]: value }
      })),
      
      updateQuestionnaire: (data) => set((state) => ({
        questionnaire: { ...state.questionnaire, ...data }
      })),

      setTestComplete: (val) => set({ isTestComplete: val }),

      resetTest: () => set({
        currentStepIndex: 0,
        environment: initialEnv,
        scores: initialScores,
        questionnaire: initialQuestionnaire,
        isTestComplete: false,
      })
    }),
    {
      name: 'vision-test-storage', // name of item in the storage (must be unique)
      partialize: (state) => ({ 
        currentStepIndex: state.currentStepIndex, 
        environment: state.environment,
        scores: state.scores,
        questionnaire: state.questionnaire,
        isTestComplete: state.isTestComplete
      }),
    }
  )
);
