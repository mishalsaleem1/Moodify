import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { Play, Pause } from 'lucide-react'
import { playlistService, favoritesService } from '../services'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const fetchPlaylist = useCallback(async () => {
    try {
      setLoading(true)
      const data = await playlistService.getPlaylist(playlistId)
      setPlaylist(data)
    } catch (error) {
      console.error('Error fetching playlist:', error)
      toast.error('Failed to load playlist')
    } finally {
      setLoading(false)
    }
  }, [playlistId])

  useEffect(() => {
    fetchPlaylist()
  }, [fetchPlaylist])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this playlist?')) return

    try {
      await playlistService.deletePlaylist(playlistId)
      toast.success('Playlist deleted successfully')
      navigate('/playlists')
    } catch (error) {
      console.error('Error deleting playlist:', error)
      toast.error('Failed to delete playlist')
    }
  }

  const handleAddSong = async (songId) => {
    try {
      await playlistService.addSongToPlaylist(playlistId, songId)
      toast.success('Song added to playlist successfully')
      fetchPlaylist() // Refresh playlist
    } catch (error) {
      console.error('Error adding song:', error)
      // Check if it's the duplicate song error
      if (error.message === 'Song is already in this playlist') {
        toast.error('This song is already in the playlist')
      } else {
        toast.error(error.response?.data?.message || 'Failed to add song to playlist')
      }
    }
  }

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

  const handleRemoveSong = async (songId) => {
    if (!confirm('Are you sure you want to remove this song from the playlist?')) return

    try {
      await playlistService.removeSongFromPlaylist(playlistId, songId)
      toast.success('Song removed from playlist')
      fetchPlaylist() // Refresh playlist
    } catch (error) {
      console.error('Error removing song:', error)
      toast.error('Failed to remove song from playlist')
    }
  }

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

  if (loading) {
    return <Loading fullScreen text="Loading playlist..." />
  }

  if (!playlist) {
    return (
      <EmptyState
        title="Playlist Not Found"
        description="The playlist you're looking for doesn't exist."
        action={
          <Button onClick={() => navigate('/playlists')}>
            Back to Playlists
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/playlists')}
          className="mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Back to Playlists
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <img 
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop" 
            alt={playlist.name}
            className="w-full md:w-64 h-64 object-cover rounded-xl shadow-xl"
          />
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{playlist.description}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {playlist.songs?.length || playlist._count?.songs || 0} songs • Created {new Date(playlist.createdAt || playlist.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Songs List */}
      <Card>
        {playlist.songs && playlist.songs.length > 0 ? (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-10">Title</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Songs */}
            {playlist.songs.map((playlistSong, index) => {
              const song = playlistSong.song || playlistSong
              const isThisSongPlaying = currentlyPlaying?.id === song.id && isPlaying
              
              return (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  {/* Index / Play button */}
                  <div className="col-span-1 flex items-center text-gray-500">
                    <button
                      onClick={() => handlePlay(song)}
                      className="w-8 h-8 flex items-center justify-center hover:text-purple-500 transition-colors"
                    >
                      {isThisSongPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {!isThisSongPlaying && (
                        <Play className="w-5 h-5 hidden group-hover:block" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="col-span-10 flex items-center gap-3">
                    <img 
                      src={song.albumArt || song.album_art || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop'}
                      alt={song.title}
                      className="w-12 h-12 object-cover rounded shadow-md"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold truncate">{song.title || 'Unknown Title'}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {song.artist || 'Unknown Artist'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRemoveSong(song.id)}
                      className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                      title="Remove from playlist"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title="No Songs Yet"
            description="Add songs to this playlist to get started"
            action={
              <Button>
                <FiPlus className="mr-2" />
                Add Songs
              </Button>
            }
          />
        )}
      </Card>
    </div>
  )
}

export default PlaylistDetail
