import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Play, Trash2, Search, Music } from 'lucide-react'
import { toast } from 'sonner'

const History = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock recently played songs
  const recentlyPlayed = [
    { 
      id: 1, 
      title: 'Blinding Lights', 
      artist: 'The Weeknd', 
      album: 'After Hours',
      playedAt: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&h=500&fit=crop',
      duration: '3:20'
    },
    { 
      id: 2, 
      title: 'Someone Like You', 
      artist: 'Adele', 
      album: '21',
      playedAt: '4 hours ago',
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&h=500&fit=crop',
      duration: '4:45'
    },
    { 
      id: 3, 
      title: 'Weightless', 
      artist: 'Marconi Union', 
      album: 'Weightless',
      playedAt: 'Yesterday',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
      duration: '8:09'
    },
    { 
      id: 4, 
      title: 'Happy', 
      artist: 'Pharrell Williams', 
      album: 'G I R L',
      playedAt: 'Yesterday',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
      duration: '3:52'
    },
    { 
      id: 5, 
      title: 'Shape of You', 
      artist: 'Ed Sheeran', 
      album: '÷',
      playedAt: '2 days ago',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
      duration: '3:53'
    },
    { 
      id: 6, 
      title: 'Levitating', 
      artist: 'Dua Lipa', 
      album: 'Future Nostalgia',
      playedAt: '3 days ago',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
      duration: '3:23'
    },
  ]

  const handleRemove = () => {
    toast.success('Removed from history')
  }

  const handlePlay = (song) => {
    toast.info(`Playing: ${song.title} by ${song.artist}`)
  }

  const handleClearAll = () => {
    toast.success('History cleared!')
  }

  const filteredSongs = recentlyPlayed.filter(song =>
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
              <h1 className="text-5xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-4 flex items-center gap-3">
                <Clock className="w-12 h-12 text-purple-400" />
                Listening History
              </h1>
              <p className="dark:text-[#e0dfff]/70 text-gray-600 text-xl">
                {recentlyPlayed.length} recently played tracks
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-6 py-3 rounded-xl hover:bg-red-500/30 hover:scale-[1.02] transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50" />
            <input
              type="text"
              placeholder="Search in history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 pl-12 dark:text-[#f8f8ff] text-gray-900 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* History List */}
        {filteredSongs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Music className="w-24 h-24 text-[#e0dfff]/20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-4">
              {searchQuery ? 'No songs found' : 'No history yet'}
            </h2>
            <p className="dark:text-[#e0dfff]/70 text-gray-600 text-lg">
              {searchQuery ? 'Try a different search term' : 'Start listening to build your history!'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/6 transition-all duration-300 group"
              >
                <div className="flex items-center gap-6">
                  {/* Play Button */}
                  <button
                    onClick={() => handlePlay(song)}
                    className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0 group-hover:shadow-lg group-hover:shadow-purple-500/50"
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                  </button>

                  {/* Album Art */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={song.image} 
                      alt={song.album}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold dark:text-[#f8f8ff] text-gray-900 mb-1 truncate">
                      {song.title}
                    </h3>
                    <p className="dark:text-[#e0dfff]/70 text-gray-600 text-sm truncate">
                      {song.artist} • {song.album}
                    </p>
                  </div>

                  {/* Played Time */}
                  <div className="text-right flex-shrink-0">
                    <p className="dark:text-[#e0dfff]/50 text-gray-500 text-sm mb-2">
                      {song.playedAt}
                    </p>
                    <p className="dark:text-[#e0dfff]/70 text-gray-600 text-sm">
                      {song.duration}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(song.id)}
                    className="w-10 h-10 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
