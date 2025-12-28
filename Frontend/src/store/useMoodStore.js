import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useMoodStore = create(
  persist(
    (set, get) => ({
      currentMood: null,
      mood: null, // Alias for compatibility
      moodColor: '#7c3aed', // default cosmic purple
      moodConfidence: 0,
      
      setMood: (mood, confidence = 0) => {
        const moodColors = {
          happy: '#f59e0b',
          sad: '#3b82f6',
          calm: '#10b981',
          angry: '#ef4444',
          energetic: '#ec4899',
          romantic: '#f43f5e',
        }
        
        console.log('🎭 useMoodStore.setMood() called with:', mood, 'confidence:', confidence);
        
        set({ 
          currentMood: mood,
          mood: mood, // Set both for compatibility
          moodColor: moodColors[mood?.toLowerCase()] || '#7c3aed',
          moodConfidence: confidence
        })
        
        console.log('✅ Mood state updated:', get());
      },
  
      resetMood: () => set({ 
        currentMood: null,
        mood: null,
        moodColor: '#7c3aed',
        moodConfidence: 0
      }),
    }),
    {
      name: 'mood-storage',
      getStorage: () => localStorage,
    }
  )
)

export { useMoodStore }
export default useMoodStore

