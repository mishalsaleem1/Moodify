import { useState, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Play, Filter, TrendingUp, Music, Sparkles, ArrowLeft, X } from 'lucide-react'
import { useMoodStore } from '../store/useMoodStore'
import { toast } from 'sonner'

// Memoized Song Card Component for performance
const SongCard = memo(({ song, index, onLike, onAdd, onPlay }) => {
  const [isLiked, setIsLiked] = useState(song.is_liked || false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(song.id)
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites! 💜')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/5 dark:bg-white/5 bg-white backdrop-blur-xl border border-white/10 dark:border-white/10 border-gray-200 rounded-2xl p-4 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-50 hover:border-white/20 dark:hover:border-white/20 hover:border-purple-200 transition-all duration-300 overflow-hidden shadow-lg">
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500 rounded-2xl" />
        
        {/* Album Art */}
        <div className="relative mb-4 overflow-hidden rounded-xl aspect-square">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
          )}
          <img
            src={song.album_art}
            alt={song.title}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Play Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.button
              onClick={() => onPlay(song)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-shadow"
            >
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </motion.button>
          </motion.div>

          {/* Match Badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <span className="text-xs font-bold text-white">{song.match}% Match</span>
          </div>
        </div>

        {/* Song Info */}
        <div className="space-y-2 relative z-10">
          <h3 className="font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900 text-lg truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
            {song.title}
          </h3>
          <p className="text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 text-sm truncate">{song.artist}</p>

          {/* Match Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-[#e0dfff]/50 dark:text-[#e0dfff]/50 text-gray-500 mb-1.5">
              <span>Match Score</span>
              <span className="font-semibold text-[#e0dfff] dark:text-[#e0dfff] text-gray-700">{song.match}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 dark:bg-white/5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${song.match}%` }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 rounded-full shadow-lg shadow-purple-500/50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3">
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isLiked
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-white/5 dark:bg-white/5 bg-gray-100 text-[#e0dfff] dark:text-[#e0dfff] text-gray-700 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-200 border border-white/10 dark:border-white/10 border-gray-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </motion.button>
            
            <motion.button
              onClick={() => onAdd(song)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all border border-purple-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

SongCard.displayName = 'SongCard'

const Recommendations = () => {
  const { mood } = useMoodStore()
  
  // Instant data - no loading delay
  const [recommendations] = useState([
    { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album_art: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&h=500&fit=crop', match: 95, is_liked: false },
    { id: 2, title: 'Levitating', artist: 'Dua Lipa', album_art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop', match: 92, is_liked: false },
    { id: 3, title: 'Watermelon Sugar', artist: 'Harry Styles', album_art: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop', match: 89, is_liked: false },
    { id: 4, title: 'Stay', artist: 'The Kid LAROI', album_art: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop', match: 87, is_liked: false },
    { id: 5, title: 'Good 4 U', artist: 'Olivia Rodrigo', album_art: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&h=500&fit=crop', match: 85, is_liked: false },
    { id: 6, title: 'Shape of You', artist: 'Ed Sheeran', album_art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop', match: 83, is_liked: false },
    { id: 7, title: 'Bad Habits', artist: 'Ed Sheeran', album_art: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=500&h=500&fit=crop', match: 81, is_liked: false },
    { id: 8, title: 'Someone Like You', artist: 'Adele', album_art: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&h=500&fit=crop', match: 79, is_liked: false },
  ])

  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('match')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)

  // Mood-based gradient colors
  const moodGradients = {
    happy: 'from-orange-500 via-yellow-500 to-amber-500',
    sad: 'from-blue-500 via-indigo-500 to-purple-500',
    calm: 'from-teal-500 via-emerald-500 to-green-500',
    angry: 'from-red-500 via-rose-500 to-pink-500',
    energetic: 'from-purple-500 via-pink-500 to-rose-500',
    romantic: 'from-pink-500 via-rose-500 to-red-500',
  }

  const currentMood = mood || 'energetic'
  const moodGradient = moodGradients[currentMood] || moodGradients.energetic

  // Memoized sorted recommendations
  const sortedRecommendations = useMemo(() => {
    const sorted = [...recommendations]
    if (sortBy === 'match') {
      return sorted.sort((a, b) => b.match - a.match)
    } else if (sortBy === 'name') {
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    }
    return sorted
  }, [recommendations, sortBy])

  const handlePlay = (song) => {
    toast.success(`Playing ${song.title} by ${song.artist} 🎵`)
  }

  const handleLike = () => {
    // Toggle like in your state management
  }

  const handleAdd = (song) => {
    setSelectedSong(song)
    setShowAddModal(true)
  }

  const playlists = [
    { id: 1, name: 'Chill Vibes', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop', count: 24 },
    { id: 2, name: 'Workout Mix', cover: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop', count: 42 },
    { id: 3, name: 'Late Night Sad', cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=200&h=200&fit=crop', count: 18 },
    { id: 4, name: 'Party Anthems', cover: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop', count: 36 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] via-[#1a0b2e] to-[#0f0f1a] dark:from-[#0f051d] dark:via-[#1a0b2e] dark:to-[#0f0f1a] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating Music Notes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Music className="text-purple-500" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 hover:text-[#f8f8ff] dark:hover:text-[#f8f8ff] hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Mood-based gradient banner */}
          <div className={`absolute inset-0 bg-gradient-to-r ${moodGradient} opacity-10 blur-3xl rounded-3xl`} />
          
          <div className="relative bg-white/5 dark:bg-white/5 bg-white backdrop-blur-2xl border border-white/10 dark:border-white/10 border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/10 bg-purple-100 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 dark:border-white/20 border-purple-200"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-[#e0dfff] dark:text-[#e0dfff] text-gray-700">
                    Powered by AI • {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Mood
                  </span>
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900 leading-tight">
                  Your <span className={`bg-gradient-to-r ${moodGradient} bg-clip-text text-transparent`}>Recommendations</span>
                </h1>
                
                <p className="text-xl text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600">
                  <span className="font-semibold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">{sortedRecommendations.length} songs</span> perfectly matched to your vibe
                </p>
              </div>

              {/* Filter Button */}
              <motion.button
                onClick={() => setFilterOpen(!filterOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-white/10 dark:bg-white/10 bg-purple-100 hover:bg-white/15 dark:hover:bg-white/15 hover:bg-purple-200 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 dark:border-white/20 border-purple-300 hover:border-white/30 dark:hover:border-white/30 hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-500/20"
              >
                <Filter className="w-5 h-5 text-purple-400 dark:text-purple-400 text-purple-600" />
                <span className="font-semibold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">Filter</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 dark:bg-white/5 bg-white backdrop-blur-xl border border-white/10 dark:border-white/10 border-gray-200 rounded-2xl p-6 space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">Sort & Filter</h3>
                <button onClick={() => setFilterOpen(false)} className="text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 hover:text-[#f8f8ff] dark:hover:text-[#f8f8ff] hover:text-gray-900">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSortBy('match')}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    sortBy === 'match'
                      ? `bg-gradient-to-r ${moodGradient} text-white shadow-lg`
                      : 'bg-white/5 text-[#e0dfff] hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Best Match
                </button>
                
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    sortBy === 'name'
                      ? `bg-gradient-to-r ${moodGradient} text-white shadow-lg`
                      : 'bg-white/5 text-[#e0dfff] hover:bg-white/10 border border-white/10'
                  }`}
                >
                  A-Z
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRecommendations.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              index={index}
              onLike={handleLike}
              onAdd={handleAdd}
              onPlay={handlePlay}
            />
          ))}
        </div>
      </div>

      {/* Add to Playlist Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-[#1a0b2e] dark:bg-[#1a0b2e] bg-white border border-white/20 dark:border-white/20 border-gray-300 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">Add to Playlist</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 hover:text-[#f8f8ff] dark:hover:text-[#f8f8ff] hover:text-gray-900 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {selectedSong && (
                  <div className="mb-6 bg-white/5 dark:bg-white/5 bg-purple-50 backdrop-blur-md rounded-xl p-4 border border-white/10 dark:border-white/10 border-purple-200">
                    <p className="text-sm text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600 mb-1">Adding</p>
                    <p className="font-bold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">{selectedSong.title}</p>
                    <p className="text-sm text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600">{selectedSong.artist}</p>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {playlists.map((playlist) => (
                    <motion.button
                      key={playlist.id}
                      onClick={() => {
                        toast.success(`Added to ${playlist.name}! 🎵`)
                        setShowAddModal(false)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-4 bg-white/5 dark:bg-white/5 bg-white hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-50 backdrop-blur-md rounded-xl p-4 border border-white/10 dark:border-white/10 border-gray-200 hover:border-white/20 dark:hover:border-white/20 hover:border-purple-300 transition-all shadow-md"
                    >
                      <img
                        src={playlist.cover}
                        alt={playlist.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">{playlist.name}</p>
                        <p className="text-sm text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600">{playlist.count} songs</p>
                      </div>
                      <Plus className="w-5 h-5 text-purple-400" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Recommendations
