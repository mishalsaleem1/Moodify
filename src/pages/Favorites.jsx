import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Play, X, Search } from 'lucide-react'
import { toast } from 'sonner'

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock favorite songs data
  const favoriteSongs = [
    { 
      id: 1, 
      title: 'Blinding Lights', 
      artist: 'The Weeknd', 
      album: 'After Hours',
      mood: 'energetic',
      image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&h=500&fit=crop',
      duration: '3:20',
      addedAt: '2 days ago'
    },
    { 
      id: 2, 
      title: 'Someone Like You', 
      artist: 'Adele', 
      album: '21',
      mood: 'sad',
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&h=500&fit=crop',
      duration: '4:45',
      addedAt: '5 days ago'
    },
    { 
      id: 3, 
      title: 'Weightless', 
      artist: 'Marconi Union', 
      album: 'Weightless',
      mood: 'calm',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
      duration: '8:09',
      addedAt: '1 week ago'
    },
    { 
      id: 4, 
      title: 'Happy', 
      artist: 'Pharrell Williams', 
      album: 'G I R L',
      mood: 'happy',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
      duration: '3:52',
      addedAt: '2 weeks ago'
    },
    { 
      id: 5, 
      title: 'Shape of You', 
      artist: 'Ed Sheeran', 
      album: '÷',
      mood: 'energetic',
      image: 'https://images.unsplash.com/photo-1511671786103-20c3e8e4e66f?w=500&h=500&fit=crop',
      addedAt: '3 weeks ago'
    },
    { 
      id: 6, 
      title: 'Perfect', 
      artist: 'Ed Sheeran', 
      album: '÷',
      mood: 'romantic',
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop',
      addedAt: '1 month ago'
    },
  ]

  const handleRemoveFavorite = () => {
    toast.success('Removed from favorites')
  }

  const handlePlay = (song) => {
    toast.info(`Playing: ${song.title} by ${song.artist}`)
  }

  const filteredSongs = favoriteSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#0f051d] to-[#1a0033] dark:from-[#1a0033] dark:via-[#0f051d] dark:to-[#1a0033] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-[#f8f8ff] mb-4 flex items-center gap-3">
                <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                Your Favorites
              </h1>
              <p className="text-[#e0dfff]/70 text-xl">
                {favoriteSongs.length} songs you loved
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50" />
            <input
              type="text"
              placeholder="Search in favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-[#f8f8ff] placeholder-[#e0dfff]/50 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Favorites Grid */}
        {filteredSongs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Heart className="w-24 h-24 text-[#e0dfff]/20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#f8f8ff] mb-4">
              {searchQuery ? 'No songs found' : 'No favorites yet'}
            </h2>
            <p className="text-[#e0dfff]/70 text-lg">
              {searchQuery ? 'Try a different search term' : 'Start adding songs to your favorites!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/6 hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex gap-4">
                  {/* Album Art */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl overflow-hidden">
                      <img 
                        src={song.image} 
                        alt={song.album}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handlePlay(song)}
                      className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-8 h-8 text-white fill-white" />
                    </button>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#f8f8ff] mb-1 truncate">
                      {song.title}
                    </h3>
                    <p className="text-[#e0dfff]/70 text-sm mb-2 truncate">
                      {song.artist}
                    </p>
                    <p className="text-[#e0dfff]/50 text-xs mb-3">
                      Added {song.addedAt}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveFavorite(song.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove
                      </button>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        song.mood === 'happy' ? 'bg-yellow-500/20 text-yellow-400' :
                        song.mood === 'sad' ? 'bg-blue-500/20 text-blue-400' :
                        song.mood === 'calm' ? 'bg-emerald-500/20 text-emerald-400' :
                        song.mood === 'energetic' ? 'bg-pink-500/20 text-pink-400' :
                        song.mood === 'romantic' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {song.mood}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
