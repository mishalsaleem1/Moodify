import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMusic, FiSmile, FiTrendingUp, FiHeart } from 'react-icons/fi'
import Button from '../components/common/Button'

const LandingPage = () => {
  const features = [
    {
      icon: FiSmile,
      title: 'Emotion Detection',
      description: 'Advanced AI analyzes your mood through text to understand how you feel',
    },
    {
      icon: FiMusic,
      title: 'Smart Recommendations',
      description: 'Get personalized music suggestions that perfectly match your emotional state',
    },
    {
      icon: FiTrendingUp,
      title: 'Mood Tracking',
      description: 'Track your emotional journey and discover patterns in your music preferences',
    },
    {
      icon: FiHeart,
      title: 'Curated Playlists',
      description: 'Build and manage playlists based on your moods and favorite songs',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow">
              Discover Music That Matches Your Mood
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              MoodSync uses AI-powered emotion detection to recommend the perfect songs for your current emotional state
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How MoodSync Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Experience music discovery like never before
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Perfect Soundtrack?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users discovering music that truly resonates with their emotions
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 MoodSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
