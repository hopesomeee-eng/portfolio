import { create } from 'zustand'

interface PortfolioStore {
  activeProjectId: number | null
  setActiveProjectId: (id: number | null) => void
  isDriveMode: boolean
  setDriveMode: (v: boolean) => void
  bloomIntensity: number
  setBloomIntensity: (v: number) => void
  isLoaded: boolean
  setIsLoaded: (v: boolean) => void
  isResumeOpen: boolean
  setResumeOpen: (v: boolean) => void
  performanceMode: 'auto' | 'eco' | 'cinematic'
  setPerformanceMode: (mode: 'auto' | 'eco' | 'cinematic') => void
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  activeProjectId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  isDriveMode: false,
  setDriveMode: (v) => set({ isDriveMode: v }),
  bloomIntensity: 1.5,
  setBloomIntensity: (v) => set({ bloomIntensity: v }),
  isLoaded: false,
  setIsLoaded: (v) => set({ isLoaded: v }),
  isResumeOpen: false,
  setResumeOpen: (v) => set({ isResumeOpen: v }),
  performanceMode: 'auto',
  setPerformanceMode: (mode) => set({ performanceMode: mode }),
}))
