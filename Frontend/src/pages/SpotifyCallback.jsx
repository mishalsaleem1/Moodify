import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'
import { toast } from 'sonner'
import api from '../services/api'

export default function SpotifyCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('🎵 ========== SPOTIFY CALLBACK ==========')
    console.log('🔗 Current URL:', window.location.href)
    
    const params = new URLSearchParams(window.location.search)
    const token = params.get('accessToken')
    const expiresIn = params.get('expiresIn')
    const error = params.get('spotify_error')

    console.log('🔑 Access Token received:', !!token)
    console.log('⏰ Expires In:', expiresIn)
    console.log('❌ Error:', error)

    if (error) {
      console.error('❌ Spotify authorization error:', error)
      toast.error(`Spotify authorization failed: ${error}`)
      navigate('/profile')
      return
    }

    if (token) {
      console.log('✅ Valid token received, storing in localStorage...')
      
      // Store token in localStorage
      localStorage.setItem('spotify_access_token', token)
      if (expiresIn) {
        localStorage.setItem('spotify_expires_in', expiresIn)
        console.log('✅ Token expiration stored')
      }
      
      console.log('✅ Spotify token saved successfully')
      toast.success('Connected to Spotify!')

      // Auto-sync top tracks to database
      console.log('🔄 Starting auto-sync of top tracks...')
      api
        .get(`/spotify/sync?token=${encodeURIComponent(token)}`)
        .then((res) => {
          console.log('✅ Sync successful:', res.data)
          toast.success(`Synced ${res.data.synced} songs to library`)
          console.log('🎵 Redirecting to profile...')
          console.log('====================================')
          navigate('/profile')
        })
        .catch((err) => {
          console.error('❌ Sync error:', err)
          toast.error('Connected to Spotify but sync failed')
          console.log('🔄 Redirecting to profile...')
          console.log('====================================')
          navigate('/profile')
        })
    } else {
      console.error('❌ No token received from Spotify')
      toast.error('Spotify authorization failed: no token received')
      navigate('/profile')
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0033] via-[#0f051d] to-[#1a0033]">
      <div className="text-center dark:text-[#f8f8ff]">
        <h2 className="text-2xl font-bold mb-4">Processing Spotify connection...</h2>
        <p className="text-gray-400">Please wait while we sync your music library.</p>
      </div>
    </div>
  )
}
