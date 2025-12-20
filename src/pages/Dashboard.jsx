import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, Search, Bell, User, Heart, Clock, Smile, Play, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'sonner'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [likedSongs, setLikedSongs] = useState([])
  
  // Mock data - replace with actual API calls
  const recentMoods = [
    { id: 1, mood: 'happy', color: 'from-yellow-400 to-orange-500', label: 'Happy', time: '2h ago' },
    { id: 2, mood: 'calm', color: 'from-emerald-400 to-teal-500', label: 'Relaxed', time: '5h ago' },
    { id: 3, mood: 'energetic', color: 'from-pink-400 to-rose-500', label: 'Energetic', time: '1d ago' },
    { id: 4, mood: 'sad', color: 'from-blue-400 to-indigo-500', label: 'Melancholic', time: '2d ago' },
    { id: 5, mood: 'calm', color: 'from-cyan-400 to-blue-500', label: 'Focused', time: '3d ago' },
  ]

  const recommendedSongs = [
    { 
      id: 1, 
      title: 'Blinding Lights', 
      artist: 'The Weeknd', 
      mood: 'energetic',
      image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&h=500&fit=crop',
      duration: '3:20'
    },
    { 
      id: 2, 
      title: 'Levitating', 
      artist: 'Dua Lipa', 
      mood: 'happy',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
      duration: '3:24'
    },
    { 
      id: 3, 
      title: 'Watermelon Sugar', 
      artist: 'Harry Styles', 
      mood: 'happy',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop',
      duration: '2:54'
    },
    { 
      id: 4, 
      title: 'Stay', 
      artist: 'The Kid LAROI', 
      mood: 'romantic',
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop',
      duration: '2:52'
    },
    { 
      id: 5, 
      title: 'Good 4 U', 
      artist: 'Olivia Rodrigo', 
      mood: 'angry',
      image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&h=500&fit=crop',
      duration: '2:58'
    },
    { 
      id: 6, 
      title: 'Shape of You', 
      artist: 'Ed Sheeran', 
      mood: 'energetic',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
      duration: '3:53'
    },
    { 
      id: 7, 
      title: 'Bad Habits', 
      artist: 'Ed Sheeran', 
      mood: 'energetic',
      image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=500&h=500&fit=crop',
      duration: '3:51'
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLikeSong = (songId) => {
    setLikedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    )
    toast.success(likedSongs.includes(songId) ? 'Removed from favorites' : 'Added to favorites')
  }

  const handlePlaySong = (song) => {
    toast.info(`Playing: ${song.title} by ${song.artist}`)
  }

  const stats = [
    { label: 'Songs Played', value: '2,847', icon: Music, color: 'from-purple-500 to-pink-500' },
    { label: 'Favorites', value: '342', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { label: 'Hours', value: '156', icon: Clock, color: 'from-blue-500 to-purple-500' },
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
              
              <button className="p-2 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-purple-100 rounded-full transition-colors relative">
                <Bell className="w-6 h-6 text-[#e0dfff]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </button>
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
                Welcome back, {user?.name || 'Mishal'}! 👋
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
          {stats.map((stat, index) => (
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

        {/* Recent Moods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">Recent Moods</h2>
            <Link to="/history" className="text-purple-400 dark:text-purple-400 text-purple-600 hover:text-purple-300 dark:hover:text-purple-300 hover:text-purple-700 transition-colors">
              View All
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {recentMoods.map((mood, index) => (
              <motion.div
                key={mood.id}
                className={`px-6 py-3 bg-gradient-to-r ${mood.color} rounded-full flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Smile className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{mood.label}</span>
                <span className="text-white/70 text-sm">{mood.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Songs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">Recommended for You</h2>
            <Link to="/recommendations" className="text-purple-400 dark:text-purple-400 text-purple-600 hover:text-purple-300 dark:hover:text-purple-300 hover:text-purple-700 transition-colors">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {recommendedSongs.map((song, index) => (
              <motion.div
                key={song.id}
                className="group bg-white/5 dark:bg-white/5 bg-white backdrop-blur-xl border border-white/10 dark:border-white/10 border-gray-200 rounded-xl p-4 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-50 transition-all cursor-pointer relative overflow-hidden shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                {/* Album Art */}
                <div className="relative mb-3 overflow-hidden rounded-lg">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        likedSongs.includes(song.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-5 h-5 ${likedSongs.includes(song.id) ? 'text-white fill-current' : 'text-white'}`} />
                    </motion.button>
                  </div>
                </div>
                
                {/* Song Info */}
                <h3 className="text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900 font-semibold text-sm mb-1 truncate">
                  {song.title}
                </h3>
                <p className="text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 text-xs truncate mb-2">{song.artist}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e0dfff]/50 dark:text-[#e0dfff]/50 text-gray-500">{song.duration}</span>
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
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
