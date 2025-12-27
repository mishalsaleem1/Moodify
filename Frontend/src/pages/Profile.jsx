import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Calendar, Music, Heart, TrendingUp, Edit, LogOut, Trash2, Settings, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { getSpotifyConnectUrl, checkSpotifyConnected } from '../services/spotify'
import { useEffect, useState } from 'react'
import { favoritesService, playlistService, emotionService } from '../services'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    songsPlayed: 0,
    favorites: 0,
    moodsTracked: 0,
    playlists: 0
  })

  useEffect(() => {
    let mounted = true
    
    // Check if user has a stored Spotify token
    const spotifyToken = localStorage.getItem('spotify_access_token')
    if (mounted) {
      setSpotifyConnected(!!spotifyToken)
    }

    return () => {
      mounted = false
    }
  }, [])

  // Fetch profile stats
  useEffect(() => {
    const fetchProfileStats = async () => {
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

        // Fetch all data in parallel
        const [favoritesData, playlistsData, emotionData] = await Promise.all([
          favoritesService.getFavorites({ limit: 1 }).catch(() => ({ total: 0 })),
          playlistService.getPlaylists({ limit: 1 }).catch(() => ({ total: 0 })),
          emotionService.getEmotionHistory({ limit: 1, userId }).catch(() => ({ total: 0 }))
        ])

        console.log('Profile stats:', {
          favorites: favoritesData.total,
          playlists: playlistsData.total,
          moods: emotionData.total
        })

        // Update stats
        setStats({
          songsPlayed: favoritesData.total || 0, // Use favorites count as songs played
          favorites: favoritesData.total || 0,
          moodsTracked: emotionData.total || 0,
          playlists: playlistsData.total || 0
        })

      } catch (error) {
        console.error('Error fetching profile stats:', error)
        toast.error('Failed to load profile statistics')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfileStats()
    }
  }, [user])

  const statsConfig = [
    { label: 'Songs Played', value: stats.songsPlayed.toString(), icon: Music, color: 'from-purple-500 to-purple-600' },
    { label: 'Favorites', value: stats.favorites.toString(), icon: Heart, color: 'from-pink-500 to-pink-600' },
    { label: 'Moods Tracked', value: stats.moodsTracked.toString(), icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { label: 'Playlists', value: stats.playlists.toString(), icon: Music, color: 'from-emerald-500 to-emerald-600' },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleDeleteAccount = () => {
    toast.error('Account deletion feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#0f051d] to-[#1a0033] dark:from-[#1a0033] dark:via-[#0f051d] dark:to-[#1a0033] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-4">Profile</h1>
          <p className="dark:text-[#e0dfff]/70 text-gray-600 text-xl">Manage your account and view your music journey</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <User className="w-16 h-16 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Edit className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">
                {user?.username || user?.name || 'Music Lover'}
              </h2>
              <p className="dark:text-[#e0dfff]/70 text-gray-600 flex items-center justify-center md:justify-start gap-2 mb-4">
                <Mail className="w-5 h-5" />
                {user?.email || 'user@moodify.com'}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 dark:text-[#e0dfff]/60 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  toast.info('Edit profile feature coming soon!')
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] transition-all"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 dark:text-[#f8f8ff] text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-white/10 hover:scale-[1.02] transition-all"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={async () => {
                  try {
                    const url = await getSpotifyConnectUrl()
                    // redirect the browser to Spotify auth
                    window.location.href = url
                  } catch (err) {
                    toast.error('Unable to connect to Spotify')
                  }
                }}
                className="flex items-center gap-2 btn-spotify text-white font-semibold px-6 py-3 rounded-xl hover:scale-[1.02] transition-all"
              >
                <Music className="w-5 h-5" />
                {spotifyConnected ? 'Spotify Connected' : 'Connect Spotify'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeletons
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-8 bg-white/10 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse"></div>
              </div>
            ))
          ) : (
            statsConfig.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/6 hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-1">{stat.value}</h3>
                  <p className="dark:text-[#e0dfff]/70 text-gray-600">{stat.label}</p>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Detected mood', detail: 'Happy', time: '2 hours ago', color: 'text-yellow-400' },
              { action: 'Added to favorites', detail: 'Blinding Lights', time: '5 hours ago', color: 'text-pink-400' },
              { action: 'Created playlist', detail: 'Chill Vibes', time: '1 day ago', color: 'text-purple-400' },
              { action: 'Detected mood', detail: 'Calm', time: '2 days ago', color: 'text-emerald-400' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="dark:text-[#f8f8ff] text-gray-900 font-medium">{activity.action}</p>
                  <p className={`text-sm ${activity.color}`}>{activity.detail}</p>
                </div>
                <span className="dark:text-[#e0dfff]/60 text-gray-500 text-sm">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-red-900/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h3>
          <p className="dark:text-[#e0dfff]/70 text-gray-600 mb-6">These actions are irreversible. Please proceed with caution.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 dark:text-[#f8f8ff] text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-white/10 hover:scale-[1.02] transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-6 py-3 rounded-xl hover:bg-red-500/30 hover:scale-[1.02] transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile

