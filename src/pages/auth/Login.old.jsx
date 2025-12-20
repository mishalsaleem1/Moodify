import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { validateEmail, validateRequired } from '../../utils/validation'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError
    
    const passwordError = validateRequired(formData.password, 'Password')
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 gradient-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue to MoodSync
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={FiMail}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon={FiLock}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-white hover:text-gray-200 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
