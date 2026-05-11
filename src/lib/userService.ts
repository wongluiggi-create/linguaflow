import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { LevelId } from '../types'

export interface UserDoc {
  uid: string
  email: string
  displayName: string
  currentLevel: LevelId
  xp: number
  wordsLearned: number
  streak: number
  completedCourses: Record<string, boolean>
  lastActiveDate: string
  createdAt: string
  updatedAt: string
}

const TODAY = () => new Date().toISOString().split('T')[0]
const YESTERDAY = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function requireDb() {
  if (!db) throw new Error('Firestore not initialized — check your Firebase credentials in .env.local')
  return db
}

export async function createOrUpdateUser(
  uid: string,
  data: Partial<Omit<UserDoc, 'uid' | 'updatedAt'>>,
): Promise<void> {
  const ref = doc(requireDb(), 'users', uid)
  const now = new Date().toISOString()
  await setDoc(ref, { uid, ...data, updatedAt: now }, { merge: true })
}

export async function getUserData(uid: string): Promise<UserDoc | null> {
  const ref = doc(requireDb(), 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as UserDoc
}

export async function updateProgress(
  uid: string,
  changes: Partial<Pick<UserDoc, 'xp' | 'wordsLearned' | 'completedCourses'>>,
): Promise<void> {
  const ref = doc(requireDb(), 'users', uid)
  await updateDoc(ref, { ...changes, updatedAt: new Date().toISOString() })
}

export async function updateStreak(uid: string): Promise<number> {
  const data = await getUserData(uid)
  if (!data) return 1

  const today = TODAY()
  const yesterday = YESTERDAY()
  let streak = data.streak

  if (data.lastActiveDate === today) {
    return streak
  } else if (data.lastActiveDate === yesterday) {
    streak += 1
  } else {
    streak = 1
  }

  const ref = doc(requireDb(), 'users', uid)
  await updateDoc(ref, { streak, lastActiveDate: today, updatedAt: new Date().toISOString() })
  return streak
}

export async function updateLevel(uid: string, level: LevelId): Promise<void> {
  const ref = doc(requireDb(), 'users', uid)
  await updateDoc(ref, { currentLevel: level, updatedAt: new Date().toISOString() })
}
