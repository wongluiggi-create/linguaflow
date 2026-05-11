import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { updateProgress } from '../lib/userService'

const DEBOUNCE_MS = 2000

export function useProgressSync() {
  const uid = useAppStore((s) => s.uid)
  const xp = useAppStore((s) => s.xp)
  const wordsLearned = useAppStore((s) => s.wordsLearned)
  const completedCourses = useAppStore((s) => s.completedCourses)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!uid) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      updateProgress(uid, { xp, wordsLearned, completedCourses }).catch((err) => {
        console.error('Progress sync failed:', err)
      })
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [uid, xp, wordsLearned, completedCourses])
}
