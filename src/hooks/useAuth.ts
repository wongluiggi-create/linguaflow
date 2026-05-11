import { useEffect, useState } from 'react'
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'
import { createOrUpdateUser, getUserData, updateStreak } from '../lib/userService'
import { useAppStore } from '../store/useAppStore'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const { setAuth, loadFromFirestore, resetStore } = useAppStore()

  useEffect(() => {
    // If Firebase isn't configured, skip auth and let the user proceed as guest
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        setAuth(firebaseUser.uid)

        try {
          const existing = await getUserData(firebaseUser.uid)

          if (!existing) {
            const now = new Date().toISOString()
            await createOrUpdateUser(firebaseUser.uid, {
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? '',
              currentLevel: 'A1',
              xp: 0,
              wordsLearned: 0,
              streak: 1,
              completedCourses: {},
              lastActiveDate: now.split('T')[0],
              createdAt: now,
            })
          } else {
            loadFromFirestore(existing)
            const newStreak = await updateStreak(firebaseUser.uid)
            useAppStore.setState({ streak: newStreak })
          }
        } catch (err) {
          console.error('Firestore sync error:', err)
        }
      } else {
        setUser(null)
        resetStore()
      }

      setLoading(false)
    })

    return unsub
  }, [setAuth, loadFromFirestore, resetStore])

  async function signInWithGoogle() {
    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase not configured — sign-in unavailable')
      return
    }
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error('Google sign-in failed:', err)
    }
  }

  async function signOut() {
    if (!auth) return
    await firebaseSignOut(auth)
  }

  return { user, loading, signInWithGoogle, signOut }
}
