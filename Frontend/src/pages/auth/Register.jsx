import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    console.log('🔵 Form submitted with data:', formData)
    
    // Validation
    if (!formData.email || !formData.username || !formData.password) {
      console.log('❌ Validation failed: Missing required fields')
      setError('Please fill in all required fields')
      return
    }

    if (formData.password.length < 6) {
      console.log('❌ Validation failed: Password too short')
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.username.length < 3) {
      console.log('❌ Validation failed: Username too short')
      setError('Username must be at least 3 characters')
      return
    }

    console.log('✅ Validation passed, calling register function...')
    const result = await register(formData)
    console.log('📥 Register result:', result)
    
    if (result.success) {
      console.log('✅ Registration successful, navigating to dashboard')
      navigate('/dashboard')
    } else {
      console.log('❌ Registration failed:', result.error)
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-cosmic-darker via-cosmic-dark to-[#2d1b4e] dark:from-cosmic-darker dark:via-cosmic-dark dark:to-[#2d1b4e] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
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
              y: [-20, 20, -20],
              x: [-20, 20, -20],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-64 h-64 bg-cosmic-purple/20 rounded-full blur-3xl" />
          </motion.div>
        ))}
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card-lg p-8 md:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <Music className="w-10 h-10 text-cosmic-purple" />
              <span className="text-3xl font-clash font-bold logo-gradient">
                Moodify
              </span>
            </Link>
            <h2 className="text-3xl font-bold dark:text-text-heading text-gray-900 mb-2">Create Account</h2>
            <p className="dark:text-text-secondary text-gray-600">Join us to discover music based on your mood</p>
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

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="glass-input w-full focus:ring-2 focus:ring-cosmic-purple"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="glass-input w-full focus:ring-2 focus:ring-cosmic-purple"
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="relative">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="glass-input w-full pl-12 focus:ring-2 focus:ring-cosmic-purple"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="glass-input w-full pl-12 focus:ring-2 focus:ring-cosmic-purple"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="glass-input w-full pl-12 pr-12 focus:ring-2 focus:ring-cosmic-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 shadow-lg shadow-cosmic-purple/30 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-cosmic-light hover:text-cosmic-purple font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
