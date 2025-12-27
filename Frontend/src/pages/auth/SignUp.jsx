import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'

const SignUp = () => {
  const navigate = useNavigate()
  const { register, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    username: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    console.log(`📝 Form field changed: ${e.target.name} = ${e.target.value}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    console.log('🚀 SignUp Form Submitted!')
    console.log('📋 Form Data:', formData)

    // Validation
    if (!formData.email || !formData.password || !formData.username) {
      const errorMsg = 'Please fill in all required fields'
      console.log('❌ Validation Error:', errorMsg)
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    if (formData.username.length < 3) {
      const errorMsg = 'Username must be at least 3 characters'
      console.log('❌ Validation Error:', errorMsg)
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters'
      console.log('❌ Validation Error:', errorMsg)
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    // Prepare registration data
    const registrationData = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
      firstName: formData.fullName ? formData.fullName.split(' ')[0] : '',
      lastName: formData.fullName ? formData.fullName.split(' ').slice(1).join(' ') : '',
    }

    console.log('📤 Sending registration data to API:', registrationData)
    console.log('🔄 Calling register function from AuthContext...')

    const result = await register(registrationData)
    
    console.log('📥 Registration result received:', result)
    
    if (result.success) {
      console.log('✅ Registration successful!')
      console.log('✅ User created:', result.user)
      toast.success('Account created successfully! 🎉')
      console.log('🔄 Redirecting to dashboard...')
      navigate('/dashboard')
    } else {
      console.log('❌ Registration failed:', result.error)
      setError(result.error)
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-[#1a0033] via-[#0f051d] to-[#1a0033] dark:from-[#1a0033] dark:via-[#0f051d] dark:to-[#1a0033] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-30, 30, -30],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
          </motion.div>
        ))}
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <Music className="w-10 h-10 text-purple-500" />
              <span className="text-3xl font-bold bg-gradient-to-r from-[#8b5cf6] via-purple-400 to-[#ec4899] bg-clip-text text-transparent">
                Moodify
              </span>
            </Link>
            <h2 className="text-3xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">Create Your Account</h2>
            <p className="dark:text-[#e0dfff]/70 text-gray-600">Start your musical journey today</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50 z-10" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 pl-12 dark:text-[#f8f8ff] text-gray-900 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Username */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50 z-10" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 pl-12 dark:text-[#f8f8ff] text-gray-900 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50 z-10" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 pl-12 dark:text-[#f8f8ff] text-gray-900 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e0dfff]/50 z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 pl-12 pr-12 dark:text-[#f8f8ff] text-gray-900 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e0dfff]/50 hover:text-[#f8f8ff] transition-colors z-10"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {authLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent dark:text-[#e0dfff]/70 text-gray-600">or sign up with</span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toast.info('Google signup coming soon!')}
                className="flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 dark:text-[#f8f8ff] text-gray-900 hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => toast.info('Spotify signup coming soon!')}
                className="flex items-center justify-center space-x-2 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-xl px-4 py-3 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="dark:text-[#e0dfff]/70 text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#a78bfa] hover:text-[#8b5cf6] font-semibold transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="dark:text-[#e0dfff]/70 text-gray-600 dark:hover:text-[#f8f8ff] hover:text-gray-900 transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
