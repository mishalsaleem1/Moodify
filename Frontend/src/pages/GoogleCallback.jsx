import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { STORAGE_KEYS } from '../utils/constants'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      console.log('🔍 Google Callback - Token:', !!token, 'Error:', error)

      if (error) {
        console.error('❌ Google OAuth error:', error)
        toast.error('Google authentication failed')
        navigate('/login')
        return
      }

      if (token) {
        try {
          console.log('✅ Token received, fetching user data...')
          
          // Fetch user data using the token
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const userData = await response.json()
            console.log('✅ User data received:', userData)
            
            // Store auth data using proper keys
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
            
            // Update auth context
            setUser(userData)
            
            toast.success(`Welcome, ${userData.firstName || userData.username || userData.email}! 🎉`)
            
            console.log('🔄 Redirecting to dashboard...')
            
            // Small delay to ensure state is updated
            setTimeout(() => {
              navigate('/dashboard', { replace: true })
            }, 100)
          } else {
            const errorData = await response.json().catch(() => ({}))
            console.error('❌ Failed to fetch user data:', errorData)
            throw new Error(errorData.message || 'Failed to fetch user data')
          }
        } catch (err) {
          console.error('❌ Google callback error:', err)
          toast.error('Authentication failed. Please try again.')
          navigate('/login')
        }
      } else {
        console.error('❌ No authentication token received')
        toast.error('No authentication token received')
        navigate('/login')
      }
    }

    handleCallback()
  }, [searchParams, navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cosmic-darker via-cosmic-dark to-[#2d1b4e]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-cosmic-purple animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-heading mb-2">
          Authenticating with Google...
        </h2>
        <p className="text-text-secondary">
          Please wait while we complete your sign in
        </p>
      </div>
    </div>
  )
}

export default GoogleCallback
