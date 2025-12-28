import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, Heart, Clock, Plus, Play, Pause, Search, ListMusic, TrendingUp, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { playlistService, favoritesService } from '../services'
import { useAuth } from '../context/AuthContext'

const Playlists = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('saved') // 'saved', 'playlists', 'favorites', 'history'
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [playlists, setPlaylists] = useState([])
  const [favorites, setFavorites] = useState([])
  const audioRef = useRef(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { user } = useAuth()

  // Fetch playlists and favorites on mount
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      if (activeTab === 'playlists') {
        const response = await playlistService.getPlaylists({ page: 1, limit: 20 })
        console.log('Playlists response:', response)
        setPlaylists(response.data || [])
      } else if (activeTab === 'favorites' || activeTab === 'saved') {
        const response = await favoritesService.getFavorites({ page: 1, limit: 50 })
        console.log('Favorites response:', response)
        setFavorites(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Handle audio playback
  const handlePlay = async (song) => {
    try {
      // Check for preview URL in different possible property names
      const previewUrl = song.previewUrl || song.preview_url
      
      if (!previewUrl) {
        console.log('No preview available. Checking for Spotify URL...')
        // Try to construct Spotify URL from spotifyId
        const spotifyId = song.spotifyId || song.spotify_id
        if (spotifyId) {
          const spotifyUrl = `https://open.spotify.com/track/${spotifyId}`
          toast.info('No preview available - Opening in Spotify! 🎵', { duration: 3000 })
          setTimeout(() => {
            window.open(spotifyUrl, '_blank')
          }, 500)
        } else {
          toast.error('No preview or Spotify link available for this song')
        }
        return
      }

      if (currentlyPlaying?.id === song.id) {
        if (isPlaying) {
          audioRef.current?.pause()
          setIsPlaying(false)
        } else {
          await audioRef.current?.play()
          setIsPlaying(true)
        }
      } else {
        if (audioRef.current) {
          audioRef.current.src = previewUrl
          
          audioRef.current.onloadstart = () => {
            toast.loading('Loading preview...', { id: 'audio-loading' })
          }
          
          audioRef.current.oncanplay = () => {
            toast.dismiss('audio-loading')
          }
          
          audioRef.current.onerror = (e) => {
            console.error('❌ Audio error:', e)
            toast.dismiss('audio-loading')
            toast.error('Failed to load preview. Opening in Spotify...')
            const spotifyId = song.spotifyId || song.spotify_id
            if (spotifyId) {
              setTimeout(() => window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank'), 500)
            }
          }
          
          await audioRef.current.play()
          setCurrentlyPlaying(song)
          setIsPlaying(true)
          toast.success(`🎵 Playing 30s preview: ${song.title}`)
        }
      }
    } catch (error) {
      console.error('Error playing song:', error)
      toast.error('Failed to play preview')
      
      // Fallback to Spotify
      const spotifyId = song.spotifyId || song.spotify_id
      if (spotifyId) {
        toast.info('Opening in Spotify instead...')
        setTimeout(() => window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank'), 500)
      }
    }
  }

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentlyPlaying(null)
      }
      audio.addEventListener('ended', handleEnded)
      return () => audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Mock data - replace with actual API calls
  const savedSongs = [
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
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
      duration: '3:53',
      addedAt: '3 weeks ago'
    },
    { 
      id: 6, 
      title: 'Levitating', 
      artist: 'Dua Lipa', 
      album: 'Future Nostalgia',
      mood: 'energetic',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
      duration: '3:23',
      addedAt: '1 month ago'
    },
  ]

  const myPlaylists = [
    { id: 1, name: 'Chill Vibes', songCount: 24, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop', mood: 'calm' },
    { id: 2, name: 'Workout Mix', songCount: 42, image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=500&fit=crop', mood: 'energetic' },
    { id: 3, name: 'Late Night Sad', songCount: 18, image: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=500&h=500&fit=crop', mood: 'sad' },
    { id: 4, name: 'Party Anthems', songCount: 36, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=500&fit=crop', mood: 'happy' },
  ]

  
  
  
  
  
  const tabs = [
    { id: 'saved', label: 'Your Songs', icon: Music, count: favorites.length },
    { id: 'playlists', label: 'Playlists', icon: ListMusic, count: playlists.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
  ]

  // Filter data based on search query
  const filteredFavorites = favorites.filter(fav => 
    fav.song?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.song?.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.song?.album?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#0f051d] to-[#1a0033] dark:from-[#1a0033] dark:via-[#0f051d] dark:to-[#1a0033] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Hidden audio element */}
      <audio ref={audioRef} />
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white/4 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
          <h2 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-6">Library</h2>
          
          {/* Navigation Tabs */}
          <nav className="space-y-2 flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-lg shadow-purple-500/30' 
                      : 'dark:text-[#e0dfff]/70 text-gray-700 hover:bg-white/5 dark:hover:text-[#f8f8ff] hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Header with Search */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h1>
                <p className="dark:text-[#e0dfff]/70 text-gray-600">
                  {activeTab === 'saved' && 'All your saved tracks in one place'}
                  {activeTab === 'playlists' && 'Your custom playlists'}
                  {activeTab === 'favorites' && 'Songs you loved'}
                  {activeTab === 'history' && 'Recently played tracks'}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50" />
              <input
                type="text"
                placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 pl-12 dark:text-[#f8f8ff] text-gray-900 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Content based on active tab */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
          ) : activeTab === 'saved' && (
            <div className="space-y-2">
              {filteredFavorites.length === 0 ? (
                <div className="text-center py-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
                  >
                    <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">No Saved Songs</h3>
                    <p className="dark:text-[#e0dfff]/70 text-gray-600">
                      Start adding songs to your favorites to see them here
                    </p>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 dark:text-[#e0dfff]/50 text-gray-500 text-sm font-medium border-b border-white/5">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-3">Album</div>
                    <div className="col-span-2">Added</div>
                    <div className="col-span-1 text-right">Duration</div>
                  </div>

                  {/* Songs List for Saved Tab */}
                  {filteredFavorites.map((favorite, index) => {
                    const song = favorite.song
                    if (!song) return null
                    const isThisSongPlaying = currentlyPlaying?.id === song.id && isPlaying
                    
                    return (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handlePlay(song)}
                        className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer"
                      >
                        {/* Index / Play Button */}
                        <div className="col-span-1 flex items-center dark:text-[#e0dfff]/70 text-gray-500">
                          {isThisSongPlaying ? (
                            <Pause className="w-4 h-4 text-purple-400 fill-purple-400" />
                          ) : (
                            <>
                              <span className="group-hover:hidden">{index + 1}</span>
                              <Play className="w-4 h-4 hidden group-hover:block text-purple-400" />
                            </>
                          )}
                        </div>

                        {/* Title & Artist */}
                        <div className="col-span-5 flex items-center gap-3">
                          <img 
                            src={song.albumArt || song.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop'} 
                            alt={song.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="dark:text-[#f8f8ff] text-gray-900 font-medium group-hover:text-purple-400 transition-colors">
                              {song.title}
                            </h3>
                            <p className="dark:text-[#e0dfff]/60 text-gray-600 text-sm">{song.artist}</p>
                          </div>
                        </div>

                        {/* Album */}
                        <div className="col-span-3 flex items-center dark:text-[#e0dfff]/70 text-gray-600 text-sm">
                          {song.album || 'Unknown Album'}
                        </div>

                        {/* Added Date */}
                        <div className="col-span-2 flex items-center dark:text-[#e0dfff]/60 text-gray-500 text-sm">
                          {new Date(favorite.createdAt).toLocaleDateString()}
                        </div>

                        {/* Duration */}
                        <div className="col-span-1 flex items-center justify-end dark:text-[#e0dfff]/60 text-gray-700 text-sm font-medium">
                          {song.duration || '--:--'}
                        </div>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </div>
          )}

          {activeTab === 'playlists' && !loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPlaylists.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
                  >
                    <ListMusic className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">No Playlists Yet</h3>
                    <p className="dark:text-[#e0dfff]/70 text-gray-600">
                      Create your first playlist to get started
                    </p>
                  </motion.div>
                </div>
              ) : (
                filteredPlaylists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/playlists/${playlist.id}`)}
                  >
                    <div className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/6 hover:scale-105 transition-all duration-300">
                      <div className="relative mb-4 overflow-hidden rounded-xl">
                        <img 
                          src={playlist.coverImage || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop'} 
                          alt={playlist.name}
                          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </button>
                        </div>
                      </div>
                      <h3 className="dark:text-[#f8f8ff] text-gray-900 font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                        {playlist.name}
                      </h3>
                      <p className="dark:text-[#e0dfff]/60 text-gray-600 text-sm">
                        {playlist._count?.songs || playlist.songs?.length || 0} songs
                      </p>
                      {playlist.description && (
                        <p className="dark:text-[#e0dfff]/40 text-gray-500 text-xs mt-2 line-clamp-2">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {(activeTab === 'favorites') && !loading && (
            <div className="space-y-2">
              {filteredFavorites.length === 0 ? (
                <div className="text-center py-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
                  >
                    <Heart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">No Favorites Yet</h3>
                    <p className="dark:text-[#e0dfff]/70 text-gray-600">
                      Songs you favorite will appear here
                    </p>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 dark:text-[#e0dfff]/50 text-gray-500 text-sm font-medium border-b border-white/5">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-3">Album</div>
                    <div className="col-span-2">Added</div>
                    <div className="col-span-1 text-right">Duration</div>
                  </div>

                  {/* Songs List for Favorites Tab */}
                  {filteredFavorites.map((favorite, index) => {
                    const song = favorite.song
                    if (!song) return null
                    const isThisSongPlaying = currentlyPlaying?.id === song.id && isPlaying
                    
                    return (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handlePlay(song)}
                        className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer"
                      >
                        {/* Index / Play Button */}
                        <div className="col-span-1 flex items-center dark:text-[#e0dfff]/70 text-gray-500">
                          {isThisSongPlaying ? (
                            <Pause className="w-4 h-4 text-purple-400 fill-purple-400" />
                          ) : (
                            <>
                              <span className="group-hover:hidden">{index + 1}</span>
                              <Play className="w-4 h-4 hidden group-hover:block text-purple-400" />
                            </>
                          )}
                        </div>

                        {/* Title & Artist */}
                        <div className="col-span-5 flex items-center gap-3">
                          <img 
                            src={song.albumArt || song.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop'} 
                            alt={song.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="dark:text-[#f8f8ff] text-gray-900 font-medium group-hover:text-purple-400 transition-colors">
                              {song.title}
                            </h3>
                            <p className="dark:text-[#e0dfff]/60 text-gray-600 text-sm">{song.artist}</p>
                          </div>
                        </div>

                        {/* Album */}
                        <div className="col-span-3 flex items-center dark:text-[#e0dfff]/70 text-gray-600 text-sm">
                          {song.album || 'Unknown Album'}
                        </div>

                        {/* Added Date */}
                        <div className="col-span-2 flex items-center dark:text-[#e0dfff]/60 text-gray-500 text-sm">
                          {new Date(favorite.createdAt).toLocaleDateString()}
                        </div>

                        {/* Duration */}
                        <div className="col-span-1 flex items-center justify-end dark:text-[#e0dfff]/60 text-gray-700 text-sm font-medium">
                          {song.duration || '--:--'}
                        </div>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && !loading && (
            <div className="text-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
              >
                <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">Coming Soon</h3>
                <p className="dark:text-[#e0dfff]/70 text-gray-600">
                  {activeTab === 'favorites' ? 'Your favorite tracks' : 'Your listening history'} will appear here
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Playlists

