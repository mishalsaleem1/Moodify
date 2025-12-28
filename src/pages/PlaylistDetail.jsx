import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { playlistService } from '../services'
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
              {playlist.song_count || 0} songs • Created {new Date(playlist.created_at).toLocaleDateString()}
            </p>
            
            <div className="flex space-x-3">
              <Button>
                <FiPlus className="mr-2" />
                Add Songs
              </Button>
              <Button variant="outline">
                <FiEdit className="mr-2" />
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <FiTrash2 className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Songs List */}
      <Card>
        {playlist.songs && playlist.songs.length > 0 ? (
          <div className="space-y-4">
            {playlist.songs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-500 w-6">{index + 1}</span>
                <img 
                  src={song.album_art || `https://images.unsplash.com/photo-${['1614149162883-504ce4d13909', '1470225620780-dba8ba36b745', '1459749411175-04bf5292ceea', '1487180144351-b8472da7d491', '1493225457124-a3eb8e39f7d0', '1514525253161-7a46d19cd819'][index % 6]}?w=200&h=200&fit=crop`}
                  alt={song.title}
                  className="w-12 h-12 object-cover rounded shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{song.title || 'Song Title'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {song.artist || 'Artist Name'}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{song.duration || '3:45'}</span>
              </div>
            ))}
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
