import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS, THEMES } from '../utils/constants'

const ThemeContext = createContext(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    return savedTheme || THEMES.LIGHT
  })

  const [currentEmotion, setCurrentEmotion] = useState(null)

  useEffect(() => {
    const root = window.document.documentElement
    
    // Apply theme
    if (theme === THEMES.DARK) {
      root.classList.add('dark')
    } else if (theme === THEMES.LIGHT) {
      root.classList.remove('dark')
    } else if (theme === THEMES.AUTO) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === THEMES.LIGHT) return THEMES.DARK
      if (prevTheme === THEMES.DARK) return THEMES.AUTO
      return THEMES.LIGHT
    })
  }

  const setThemeMode = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme)
    }
  }

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    currentEmotion,
    setCurrentEmotion,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
