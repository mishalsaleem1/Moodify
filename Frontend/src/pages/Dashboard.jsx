import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, Search, User, Heart, Clock, Smile, Play, Sun, Moon, List } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'sonner'
import { favoritesService, emotionService, playlistService } from '../services'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [likedSongs, setLikedSongs] = useState([])
  const [stats, setStats] = useState({
    playlists: 0,
    favorites: 0,
    hours: 0
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Get userId from localStorage
        const userStr = localStorage.getItem('user')
        let userId = user?.id
        if (!userId && userStr) {
          try {
            const userData = JSON.parse(userStr)
            userId = userData.id
          } catch (e) {
            console.error('Error parsing user:', e)
          }
        }

        if (!userId) {
          console.warn('No userId found')
          setLoading(false)
          return
        }

        // Fetch favorites
        const favoritesData = await favoritesService.getFavorites({ limit: 7 })
        console.log('Favorites data:', favoritesData)
        setLikedSongs(favoritesData.favorites || favoritesData.data || [])

        // Fetch playlists count
        try {
          const playlistsData = await playlistService.getPlaylists()
          console.log('Playlists data:', playlistsData)
          
          // Calculate stats with random hours between 2-3
          const randomHours = Math.floor(Math.random() * 2) + 2 // Random number between 2-3
          
          setStats({
            playlists: playlistsData.total || 0,
            favorites: favoritesData.total || (favoritesData.favorites || favoritesData.data || []).length,
            hours: randomHours
          })
        } catch (error) {
          console.error('Error fetching playlists:', error)
          // Set stats with at least favorites count and random hours
          const randomHours = Math.floor(Math.random() * 2) + 2 // Random number between 2-3
          
          setStats({
            playlists: 0,
            favorites: favoritesData.total || (favoritesData.favorites || favoritesData.data || []).length,
            hours: randomHours
          })
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  // Filter songs based on search query
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return likedSongs
    
    const query = searchQuery.toLowerCase()
    return likedSongs.filter(song => 
      song.song?.title?.toLowerCase().includes(query) ||
      song.song?.artist?.toLowerCase().includes(query)
    )
  }, [searchQuery, likedSongs])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLikeSong = async (songId) => {
    try {
      const isLiked = likedSongs.some(fav => fav.songId === songId)
      
      if (isLiked) {
        await favoritesService.removeFavorite(songId)
        setLikedSongs(prev => prev.filter(fav => fav.songId !== songId))
        toast.success('Removed from favorites')
      } else {
        await favoritesService.addFavorite(songId)
        // Refetch favorites
        const favoritesData = await favoritesService.getFavorites({ limit: 7 })
        setLikedSongs(favoritesData.favorites || [])
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const handlePlaySong = (song) => {
    toast.info(`Playing: ${song.title} by ${song.artist}`)
  }

  const statsConfig = [
    { label: 'My Playlists', value: stats.playlists.toString(), icon: List, color: 'from-purple-500 to-pink-500' },
    { label: 'Favorites', value: stats.favorites.toString(), icon: Heart, color: 'from-pink-500 to-rose-500' },
    { label: 'Hours', value: stats.hours.toString(), icon: Clock, color: 'from-blue-500 to-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] via-[#1a0033] to-[#0f051d] dark:from-[#0f051d] dark:via-[#1a0033] dark:to-[#0f051d] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Sticky Navbar */}
      <motion.nav 
        className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f051d]/80 dark:bg-[#0f051d]/80 bg-white/80 border-b border-white/5 dark:border-white/5 border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] via-purple-400 to-[#ec4899] bg-clip-text text-transparent">
                Moodify
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8 ml-12">
              <Link 
                to="/profile" 
                className={`text-[#e0dfff] dark:text-[#e0dfff] text-gray-700 hover:text-[#f8f8ff] dark:hover:text-[#f8f8ff] hover:text-gray-900 font-medium transition-all relative ${location.pathname === '/profile' ? 'text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900' : ''}`}
              >
                Profile
                {location.pathname === '/profile' && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] shadow-lg shadow-purple-500/50" />
                )}
              </Link>
              <Link 
                to="/playlists" 
                className={`text-[#e0dfff] dark:text-[#e0dfff] text-gray-700 hover:text-[#f8f8ff] dark:hover:text-[#f8f8ff] hover:text-gray-900 font-medium transition-all relative ${location.pathname === '/playlists' ? 'text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900' : ''}`}
              >
                Library
                {location.pathname === '/playlists' && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] shadow-lg shadow-purple-500/50" />
                )}
              </Link>
              <Link 
                to="/emotion-detection" 
                className={`text-[#e0dfff] dark:text-[#e0dfff] text-gray-700 hover:text-[#f8f8ff] dark:hover:text-[#f8f8ff] hover:text-gray-900 font-medium transition-all relative ${location.pathname === '/emotion-detection' ? 'text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900' : ''}`}
              >
                Emotion Detect
                {location.pathname === '/emotion-detection' && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] shadow-lg shadow-purple-500/50" />
                )}
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50 dark:text-[#e0dfff]/50 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search songs, artists, moods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 dark:bg-white/5 bg-white backdrop-blur-md border border-white/10 dark:border-white/10 border-gray-300 rounded-full px-4 py-2.5 pl-12 text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900 placeholder-[#e0dfff]/50 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-purple-100 rounded-full transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-purple-600" />
                )}
              </motion.button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-full transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white/10 dark:bg-white/10 bg-white backdrop-blur-xl border border-white/10 dark:border-white/10 border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-800 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-purple-50 rounded-t-xl transition-colors">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-800 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-purple-50 transition-colors">
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 dark:text-red-400 text-red-600 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-red-50 rounded-b-xl transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <motion.div
          className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-blue-500/20 from-purple-100 via-pink-100 to-blue-100 backdrop-blur-xl border border-white/10 dark:border-white/10 border-purple-200 rounded-3xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900 mb-2">
                Welcome back, {user?.username || 'User'}! 👋
              </h1>
              <p className="text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-700 text-lg">
                Explore new music tailored to your emotions
              </p>
            </div>
            <motion.button
              onClick={() => navigate('/emotion-detection')}
              className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Detect Mood
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/5 dark:bg-white/5 bg-white backdrop-blur-xl border border-white/10 dark:border-white/10 border-gray-200 rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Liked Songs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">
              {searchQuery ? 'Search Results' : 'Your Favorite Songs'}
            </h2>
            <Link to="/favorites" className="text-purple-400 dark:text-purple-400 text-purple-600 hover:text-purple-300 dark:hover:text-purple-300 hover:text-purple-700 transition-colors">
              See All
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-white/10 rounded-lg mb-3"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredSongs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {filteredSongs.map((favorite, index) => {
                const song = favorite.song || {}
                return (
                  <motion.div
                    key={favorite.id}
                    className="group bg-white/5 dark:bg-white/5 bg-white backdrop-blur-xl border border-white/10 dark:border-white/10 border-gray-200 rounded-xl p-4 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-50 transition-all cursor-pointer relative overflow-hidden shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Album Art */}
                    <div className="relative mb-3 overflow-hidden rounded-lg">
                      <img
                        src={song.albumArt || song.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop'}
                        alt={song.title || 'Song'}
                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop'
                        }}
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <motion.button
                          onClick={() => handlePlaySong(song)}
                          className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleLikeSong(song.id)}
                          className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart className="w-5 h-5 text-white fill-current" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Song Info */}
                    <h3 className="text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900 font-semibold text-sm mb-1 truncate">
                      {song.title || 'Unknown Song'}
                    </h3>
                    <p className="text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 text-xs truncate mb-2">
                      {song.artist || 'Unknown Artist'}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#e0dfff]/50 dark:text-[#e0dfff]/50 text-gray-500">
                        {song.duration || '0:00'}
                      </span>
                      {song.mood && (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                          song.mood === 'happy' ? 'bg-yellow-500/20 text-yellow-400' :
                          song.mood === 'sad' ? 'bg-blue-500/20 text-blue-400' :
                          song.mood === 'energetic' ? 'bg-pink-500/20 text-pink-400' :
                          song.mood === 'calm' ? 'bg-emerald-500/20 text-emerald-400' :
                          song.mood === 'romantic' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {song.mood}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-[#e0dfff]/30 mx-auto mb-4" />
              <p className="text-[#e0dfff]/70 text-lg">
                {searchQuery ? 'No songs found matching your search' : 'No favorite songs yet'}
              </p>
              {!searchQuery && (
                <p className="text-[#e0dfff]/50 text-sm mt-2">
                  Start exploring and add songs to your favorites!
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
