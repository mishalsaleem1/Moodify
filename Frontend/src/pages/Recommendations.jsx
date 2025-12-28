import { useState, useMemo, memo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Play, Filter, TrendingUp, Music, Sparkles, ArrowLeft, X, Loader, Pause } from 'lucide-react'
import { useMoodStore } from '../store/useMoodStore'
import { toast } from 'sonner'
import { spotifyService, playlistService, songService, favoritesService } from '../services'

// Memoized Song Card Component for performance
const SongCard = memo(({ song, index, onLike, onAdd, onPlay, currentlyPlaying, isPlaying }) => {
  const [isLiked, setIsLiked] = useState(song.is_liked || false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const isThisSongPlaying = currentlyPlaying?.id === song.id && isPlaying

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
              title={song.previewUrl ? "Play 30s preview" : "Open in Spotify"}
            >
              {isThisSongPlaying ? (
                <Pause className="w-7 h-7 text-white" fill="white" />
              ) : (
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              )}
            </motion.button>
            
            {/* Preview availability indicator */}
            {!song.previewUrl && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                <p className="text-xs text-white/90 text-center">
                  🎵 No preview - Opens Spotify
                </p>
              </div>
            )}
          </motion.div>

          {/* Match Badge */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <span className="text-xs font-bold text-white">{song.match}% Match</span>
            </div>
            {song.previewUrl && (
              <div className="bg-green-500/90 backdrop-blur-md px-2 py-1 rounded-full border border-green-400/50">
                <span className="text-xs font-bold text-white">▶ Preview</span>
              </div>
            )}
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
  const { mood, currentMood } = useMoodStore()
  
  console.log('🎵 Recommendations component rendered')
  console.log('📊 Mood from store:', mood)
  console.log('📊 CurrentMood from store:', currentMood)
  console.log('📦 Full store state:', useMoodStore.getState())
  
  // State for Spotify recommendations
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('match')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)
  
  // Audio player state
  const audioRef = useRef(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Real playlists from backend
  const [playlists, setPlaylists] = useState([])
  const [loadingPlaylists, setLoadingPlaylists] = useState(false)
  
  // Create playlist state
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [creatingPlaylist, setCreatingPlaylist] = useState(false)

  // Fetch Spotify recommendations based on detected mood
  useEffect(() => {
    const fetchSpotifyRecommendations = async () => {
      console.log('🎵 ========== FETCHING SPOTIFY RECOMMENDATIONS ==========')
      console.log('📊 Mood from store:', mood)
      console.log('📊 CurrentMood from store:', currentMood)
      
      // Use mood or currentMood, whichever is available
      const activeMood = mood || currentMood
      
      if (!activeMood) {
        console.log('⚠️  No mood detected, using default mood: happy')
      }

      const selectedMood = activeMood || 'happy'
      console.log('🎭 Using mood:', selectedMood)

      try {
        setLoading(true)
        setError(null)
        
        console.log('📡 Fetching Spotify mood recommendations (Client Credentials - No login required)...')
        
        // Use our new Spotify Client Credentials endpoint (no user login required!)
        const response = await spotifyService.getSpotifyMoodRecommendations(selectedMood, 20)
        console.log('✅ Spotify API response:', response)
        
        // Transform Spotify tracks to our format
        const tracks = response.tracks || []
        console.log('🎵 Number of tracks received:', tracks.length)
        
        const formattedRecommendations = tracks.map((track, index) => ({
          id: track.id,
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album_art: track.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
          match: Math.max(70, 95 - index * 2), // Calculate match score based on position
          is_liked: false,
          spotifyId: track.id,
          previewUrl: track.preview_url,
          externalUrl: track.external_urls?.spotify,
        }))
        
        console.log('✅ Formatted recommendations:', formattedRecommendations)
        setRecommendations(formattedRecommendations)
        toast.success(`🎵 Found ${formattedRecommendations.length} ${selectedMood} songs from Spotify!`)
        
      } catch (err) {
        console.error('❌ Error fetching Spotify recommendations:', err)
        console.error('❌ Error details:', err.response?.data)
        setError(err.message)
        toast.error('Failed to load Spotify recommendations. Using fallback...')
        
        // Fallback to mock data on error
        setRecommendations([
          { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album_art: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&h=500&fit=crop', match: 95, is_liked: false },
          { id: 2, title: 'Levitating', artist: 'Dua Lipa', album_art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop', match: 92, is_liked: false },
        ])
      } finally {
        setLoading(false)
        console.log('==========================================')
      }
    }

    fetchSpotifyRecommendations()
  }, [mood, currentMood]) // Watch both mood properties

  // Fetch user's playlists from backend
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoadingPlaylists(true)
        console.log('📂 Fetching user playlists from backend...')
        const response = await playlistService.getPlaylists()
        console.log('✅ Playlists fetched:', response)
        setPlaylists(response.data || response || [])
      } catch (error) {
        console.error('❌ Error fetching playlists:', error)
        // If error (user not logged in), show message
        if (error.response?.status === 401) {
          console.log('⚠️  User not logged in, playlists not available')
        }
      } finally {
        setLoadingPlaylists(false)
      }
    }
    
    fetchPlaylists()
  }, []) // Fetch once on mount

  // Mood-based gradient colors
  const moodGradients = {
    happy: 'from-orange-500 via-yellow-500 to-amber-500',
    sad: 'from-blue-500 via-indigo-500 to-purple-500',
    calm: 'from-teal-500 via-emerald-500 to-green-500',
    angry: 'from-red-500 via-rose-500 to-pink-500',
    energetic: 'from-purple-500 via-pink-500 to-rose-500',
    romantic: 'from-pink-500 via-rose-500 to-red-500',
  }

  const displayMood = mood || currentMood || 'energetic'
  const moodGradient = moodGradients[displayMood] || moodGradients.energetic

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

  const handlePlay = async (song) => {
    console.log('🎵 Play clicked for:', song.title, 'Preview URL:', song.previewUrl)
    
    // Check if song has preview URL
    if (!song.previewUrl) {
      // Open in Spotify as fallback
      if (song.externalUrl) {
        toast.info('No preview available - Opening in Spotify! 🎵', {
          duration: 3000,
        })
        setTimeout(() => {
          window.open(song.externalUrl, '_blank')
        }, 500)
      } else {
        toast.error('No preview available for this song 🙁')
      }
      return
    }
    
    // If same song is playing, pause it
    if (currentlyPlaying?.id === song.id && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
      toast.info('Paused ⏸️')
      return
    }
    
    // If different song, play new one
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = song.previewUrl
        
        // Add event listeners
        audioRef.current.onloadstart = () => {
          console.log('🔄 Loading preview...')
          toast.loading('Loading preview...', { id: 'audio-loading' })
        }
        
        audioRef.current.oncanplay = () => {
          console.log('✅ Preview ready to play')
          toast.dismiss('audio-loading')
        }
        
        audioRef.current.onerror = (e) => {
          console.error('❌ Audio error:', e)
          toast.dismiss('audio-loading')
          toast.error('Failed to load preview. Opening in Spotify...')
          if (song.externalUrl) {
            setTimeout(() => window.open(song.externalUrl, '_blank'), 500)
          }
        }
        
        await audioRef.current.play()
        setCurrentlyPlaying(song)
        setIsPlaying(true)
        toast.success(`🎵 Playing 30s preview: ${song.title}`)
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error)
      toast.error('Failed to play preview')
      
      // Fallback to opening in Spotify
      if (song.externalUrl) {
        toast.info('Opening in Spotify instead...')
        setTimeout(() => window.open(song.externalUrl, '_blank'), 500)
      }
    }
  }

  const handleLike = async (songId) => {
    // First ensure the song exists in database, then add to favorites
    try {
      // Find the song in recommendations
      const song = recommendations.find(s => s.id === songId)
      if (!song) return

      // Save song to database if it doesn't exist
      if (!song.dbId) {
        const songData = {
          spotifyId: song.spotifyId,
          title: song.title,
          artist: song.artist,
          album: song.album,
          albumArt: song.album_art,
          previewUrl: song.preview_url,
          duration: song.duration,
        }
        
        const savedSong = await songService.createSong(songData)
        song.dbId = savedSong.id
      }

      // Add to favorites
      await favoritesService.addFavorite(song.dbId, 'song')
    } catch (error) {
      console.error('Error liking song:', error)
      if (error.response?.status === 409) {
        // Already in favorites - that's ok
      } else {
        toast.error('Failed to add to favorites')
      }
    }
  }

  const handleAdd = async (song) => {
    console.log('🔗 Add to playlist clicked for:', song)
    
    // First, ensure song exists in database
    try {
      console.log('💾 Checking if song exists in database...')
      console.log('📝 Song details:', { spotifyId: song.spotifyId, title: song.title, artist: song.artist })
      
      let dbSong = null
      
      // Try to find existing song by spotifyId first (if available)
      if (song.spotifyId) {
        try {
          console.log('🔍 Searching by spotifyId:', song.spotifyId)
          // Use proper query parameter format
          const searchResponse = await songService.searchSongs({ spotifyId: song.spotifyId })
          console.log('📡 Search response:', searchResponse)
          
          if (searchResponse?.data && searchResponse.data.length > 0) {
            dbSong = searchResponse.data[0]
            console.log('✅ Found existing song in database:', dbSong)
          }
        } catch (err) {
          console.log('ℹ️ Song not found by spotifyId:', err.message)
        }
      }
      
      // If song doesn't exist, create it
      if (!dbSong) {
        console.log('➕ Creating new song in database...')
        
        // Match the backend CreateSongDto EXACTLY
        const songData = {
          title: song.title,
          artist: song.artist,
          album: song.album || 'Unknown Album',
          duration: song.duration_ms ? Math.floor(song.duration_ms / 1000) : 180,
          imageUrl: song.album_art || 'https://via.placeholder.com/300',
          spotifyId: song.spotifyId || undefined, // Don't send null, use undefined
          previewUrl: song.previewUrl || undefined,
        }
        
        console.log('📤 Sending song data to backend:', songData)
        
        try {
          dbSong = await songService.createSong(songData)
          console.log('✅ Song created in database:', dbSong)
        } catch (createError) {
          console.error('❌ Error creating song:', createError)
          console.error('❌ Error details:', createError.response?.data)
          
          // If creation fails due to duplicate or Prisma unique constraint violation
          if (
            createError.response?.status === 409 || 
            createError.response?.data?.message?.includes('already exists') ||
            createError.response?.data?.message?.includes('Unique constraint')
          ) {
            console.log('ℹ️ Song already exists (duplicate error), searching again...')
            
            // Try searching by title and artist
            try {
              const searchResponse = await songService.searchSongs({ 
                title: song.title, 
                artist: song.artist 
              })
              
              if (searchResponse?.data && searchResponse.data.length > 0) {
                dbSong = searchResponse.data[0]
                console.log('✅ Found existing song after duplicate error:', dbSong)
              }
            } catch (searchErr) {
              console.error('❌ Search also failed:', searchErr)
              throw new Error('Failed to find or create song')
            }
          } else {
            throw createError
          }
        }
      }
      
      if (!dbSong || !dbSong.id) {
        throw new Error('Failed to get song ID from database')
      }
      
      // Store database ID for playlist addition
      song.dbId = dbSong.id
      console.log('✅ Song ready with DB ID:', song.dbId)
      
    } catch (error) {
      console.error('❌ Error saving song to database:', error)
      console.error('❌ Full error object:', error)
      toast.error(error.response?.data?.message || 'Failed to save song. Please try again.')
      return // Don't show modal if song creation failed
    }
    
    setSelectedSong(song)
    setShowAddModal(true)
  }
  
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name')
      return
    }
    
    try {
      setCreatingPlaylist(true)
      console.log('🎵 Creating new playlist:', newPlaylistName)
      
      const newPlaylist = await playlistService.createPlaylist({
        name: newPlaylistName,
        description: `Created from recommendations`,
        isPublic: false,
      })
      
      console.log('✅ Playlist created:', newPlaylist)
      
      // Add to local playlists array
      setPlaylists([...playlists, newPlaylist])
      
      // Reset form
      setNewPlaylistName('')
      setShowCreatePlaylist(false)
      
      toast.success(`✅ Created playlist "${newPlaylistName}"!`)
      
    } catch (error) {
      console.error('❌ Error creating playlist:', error)
      toast.error(error.response?.data?.message || 'Failed to create playlist')
    } finally {
      setCreatingPlaylist(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] via-[#1a0b2e] to-[#0f0f1a] relative overflow-hidden">
      {/* Debug info - remove later */}
      <div className="fixed top-4 right-4 bg-white/10 text-white p-4 rounded-lg z-50 text-sm">
        <p>Mood: {mood || 'none'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Songs: {recommendations.length}</p>
        <p>Error: {error || 'none'}</p>
      </div>

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
            className="inline-flex items-center gap-2 text-[#e0dfff] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </motion.div>

        {/* Loading State - Show prominently */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 space-y-6"
          >
            <div className="relative">
              <Loader className="w-20 h-20 text-purple-500 animate-spin" />
              <Music className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Loading Your Music...</h2>
              <p className="text-[#e0dfff]/80 text-lg">Finding the perfect {displayMood} songs for you 🎵</p>
              <p className="text-[#e0dfff]/60 text-sm">Mood: {mood || currentMood || 'happy'}</p>
            </div>
            
            {/* Animated music notes */}
            <div className="flex gap-4 mt-8">
              {['🎵', '🎶', '🎵'].map((note, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="text-4xl"
                >
                  {note}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content - Only show when not loading */}
        {!loading && (
          <>
            {/* Hero Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Mood-based gradient banner */}
              <div className={`absolute inset-0 bg-gradient-to-r ${moodGradient} opacity-10 blur-3xl rounded-3xl`} />
              
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-[#e0dfff]">
                        Powered by AI • {displayMood.charAt(0).toUpperCase() + displayMood.slice(1)} Mood
                      </span>
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                      Your <span className={`bg-gradient-to-r ${moodGradient} bg-clip-text text-transparent`}>Recommendations</span>
                    </h1>
                    
                    <p className="text-xl text-[#e0dfff]/70">
                      <span className="font-semibold text-white">{sortedRecommendations.length} songs</span> perfectly matched to your vibe
                    </p>
                    
                    {/* Preview info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-blue-400/30"
                    >
                      <Play className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300">
                        {sortedRecommendations.filter(s => s.previewUrl).length > 0 
                          ? `${sortedRecommendations.filter(s => s.previewUrl).length} with 30s preview` 
                          : 'Click play to open in Spotify'}
                      </span>
                    </motion.div>
                  </div>

                  {/* Filter Button */}
                  <motion.button
                    onClick={() => setFilterOpen(!filterOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 hover:border-white/30 transition-all shadow-lg hover:shadow-purple-500/20"
                  >
                    <Filter className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-white">Filter</span>
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
                  currentlyPlaying={currentlyPlaying}
                  isPlaying={isPlaying}
                />
              ))}
            </div>
          </>
        )}
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
                
                {/* Create New Playlist Button */}
                {!showCreatePlaylist && (
                  <motion.button
                    onClick={() => setShowCreatePlaylist(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mb-4 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-4 font-semibold shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Playlist
                  </motion.button>
                )}
                
                {/* Create Playlist Form */}
                {showCreatePlaylist && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-[#f8f8ff]">New Playlist</h4>
                      <button
                        onClick={() => {
                          setShowCreatePlaylist(false)
                          setNewPlaylistName('')
                        }}
                        className="text-[#e0dfff]/70 hover:text-[#f8f8ff] transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                      placeholder="Enter playlist name..."
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#f8f8ff] placeholder-[#e0dfff]/50 focus:outline-none focus:border-purple-400 transition-colors mb-3"
                      autoFocus
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreatePlaylist}
                        disabled={creatingPlaylist || !newPlaylistName.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        {creatingPlaylist ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowCreatePlaylist(false)
                          setNewPlaylistName('')
                        }}
                        className="px-4 py-2 text-[#e0dfff] hover:text-[#f8f8ff] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loadingPlaylists ? (
                    <div className="text-center py-8">
                      <Loader className="w-8 h-8 animate-spin mx-auto text-purple-400" />
                      <p className="text-[#e0dfff]/70 mt-2">Loading playlists...</p>
                    </div>
                  ) : playlists.length === 0 ? (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 mx-auto text-[#e0dfff]/30 mb-3" />
                      <p className="text-[#e0dfff]/70">No playlists yet</p>
                      <p className="text-[#e0dfff]/50 text-sm mt-1">Create one from the Playlists page!</p>
                    </div>
                  ) : (
                    playlists.map((playlist) => (
                      <motion.button
                        key={playlist.id}
                        onClick={async () => {
                          try {
                            console.log('💾 Adding song to playlist:', playlist.name)
                            console.log('Song:', selectedSong)
                            console.log('Song DB ID:', selectedSong.dbId)
                            console.log('Playlist ID:', playlist.id)
                            
                            // Ensure we have a valid songId from the database
                            if (!selectedSong.dbId) {
                              toast.error('Song not found in database. Please try again.')
                              return
                            }
                            
                            // Convert to string to ensure it passes backend validation
                            const songId = String(selectedSong.dbId)
                            
                            // Add song to playlist in backend
                            await playlistService.addSongToPlaylist(playlist.id, songId)
                            
                            toast.success(`✅ Added "${selectedSong.title}" to ${playlist.name}!`)
                            setShowAddModal(false)
                          } catch (error) {
                            console.error('❌ Error adding to playlist:', error)
                            // Check if it's the duplicate song error
                            if (error.message === 'Song is already in this playlist') {
                              toast.error(`"${selectedSong.title}" is already in ${playlist.name}`)
                            } else {
                              toast.error(error.response?.data?.message || 'Failed to add to playlist')
                            }
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-4 bg-white/5 dark:bg-white/5 bg-white hover:bg-white/10 dark:hover:bg-white/10 hover:bg-purple-50 backdrop-blur-md rounded-xl p-4 border border-white/10 dark:border-white/10 border-gray-200 hover:border-white/20 dark:hover:border-white/20 hover:border-purple-300 transition-all shadow-md"
                      >
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Music className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-[#f8f8ff] dark:text-[#f8f8ff] text-gray-900">{playlist.name}</p>
                          <p className="text-sm text-[#e0dfff]/70 dark:text-[#e0dfff]/70 text-gray-600">{playlist._count?.songs || 0} songs</p>
                        </div>
                        <Plus className="w-5 h-5 text-purple-400" />
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Hidden Audio Player */}
      <audio 
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentlyPlaying(null)
          toast.info('Preview ended')
        }}
        onError={() => {
          setIsPlaying(false)
          toast.error('Failed to load audio')
        }}
      />
    </div>
  )
}

export default Recommendations
