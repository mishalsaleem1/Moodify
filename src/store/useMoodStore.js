import { create } from 'zustand'

const useMoodStore = create((set) => ({
  currentMood: null,
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
    
    set({ 
      currentMood: mood,
      moodColor: moodColors[mood?.toLowerCase()] || '#7c3aed',
      moodConfidence: confidence
    })
  },
  
  resetMood: () => set({ 
    currentMood: null, 
    moodColor: '#7c3aed',
    moodConfidence: 0
  }),
}))

export { useMoodStore }
export default useMoodStore

