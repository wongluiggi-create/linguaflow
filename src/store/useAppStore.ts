import { create } from 'zustand'
import type { LevelId } from '../types'
import type { UserDoc } from '../lib/userService'

interface AppState {
  screen: 'placement' | 'app'
  currentLevel: LevelId
  activeTab: string
  xp: number
  wordsLearned: number
  streak: number
  completedCourses: Record<string, boolean>
  lastActiveDate: string
  isAuthenticated: boolean
  uid: string | null
  launchCourseId: string | null

  setScreen: (screen: 'placement' | 'app') => void
  setLevel: (level: LevelId) => void
  setTab: (tab: string) => void
  addXP: (amount: number) => void
  markCourseComplete: (courseId: string, xp: number) => void
  setAuth: (uid: string | null) => void
  loadFromFirestore: (data: UserDoc) => void
  resetStore: () => void
  setLaunchCourse: (id: string | null) => void
}

const INITIAL_STATE = {
  screen: 'placement' as const,
  currentLevel: 'A1' as LevelId,
  activeTab: 'dashboard',
  xp: 0,
  wordsLearned: 0,
  streak: 1,
  completedCourses: {} as Record<string, boolean>,
  lastActiveDate: new Date().toISOString().split('T')[0],
  isAuthenticated: false,
  uid: null as string | null,
  launchCourseId: null as string | null,
}

export const useAppStore = create<AppState>((set) => ({
  ...INITIAL_STATE,

  setScreen: (screen) => set({ screen }),
  setLevel: (level) => set({ currentLevel: level }),
  setTab: (tab) => set({ activeTab: tab }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  markCourseComplete: (courseId, xp) =>
    set((state) => ({
      completedCourses: { ...state.completedCourses, [courseId]: true },
      xp: state.xp + xp,
    })),
  setAuth: (uid) => set({ uid, isAuthenticated: uid !== null }),
  setLaunchCourse: (id) => set({ launchCourseId: id }),

  loadFromFirestore: (data) =>
    set({
      currentLevel: data.currentLevel,
      xp: data.xp,
      wordsLearned: data.wordsLearned,
      streak: data.streak,
      completedCourses: data.completedCourses,
      lastActiveDate: data.lastActiveDate,
      screen: 'app',
      isAuthenticated: true,
      uid: data.uid,
    }),

  resetStore: () => set({ ...INITIAL_STATE }),
}))
