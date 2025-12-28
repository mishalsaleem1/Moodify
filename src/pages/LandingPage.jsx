import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Music, Sparkles, Heart, TrendingUp, Users, Zap } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cosmic-darker via-cosmic-dark to-[#2d1b4e]">
      {/* Floating Music Notes Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
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
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Music className="text-cosmic-purple" />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Music className="w-8 h-8 text-cosmic-purple" />
            <span className="text-3xl font-clash font-bold logo-gradient">
              Moodify
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link to="/dashboard" className="btn btn-secondary">
              Dashboard
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 glass-card px-4 py-2"
            >
              <Sparkles className="w-5 h-5 text-cosmic-light animate-pulse" />
              <span className="text-text-secondary text-sm">AI-Powered Music Discovery</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-clash font-bold leading-tight">
              <span className="text-text-heading">Discover Music</span>
              <br />
              <span className="logo-gradient">That Matches</span>
              <br />
              <span className="text-text-heading">Your Mood</span>
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed max-w-xl">
              Experience the future of music recommendation. Moodify uses advanced AI to detect your emotions and curate the perfect soundtrack for every moment of your life.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/signup" className="btn btn-primary text-lg px-8 py-4 shadow-2xl shadow-cosmic-purple/50">
                <Zap className="w-5 h-5 mr-2 inline" />
                Start Your Journey
              </Link>
              <Link to="/login" className="btn btn-outline text-lg px-8 py-4">
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 pt-8"
            >
              <div>
                <div className="text-3xl font-bold logo-gradient">10K+</div>
                <div className="text-sm text-text-secondary">Happy Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold logo-gradient">1M+</div>
                <div className="text-sm text-text-secondary">Songs Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold logo-gradient">98%</div>
                <div className="text-sm text-text-secondary">Accuracy Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative glass-card-lg p-8 animate-float">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-cosmic-purple/30 via-pink-500/30 to-purple-500/30 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Music className="w-32 h-32 text-cosmic-light mx-auto" />
                  </motion.div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-text-heading">😊 Happy</div>
                    <div className="text-text-secondary">Listening to upbeat vibes</div>
                  </div>
                </div>
              </div>
              
              {/* Floating mood cards */}
              {['😢 Sad', '😌 Calm', '😠 Angry', '⚡ Energetic'].map((mood, i) => (
                <motion.div
                  key={mood}
                  className="absolute glass-card px-4 py-2 text-sm"
                  style={{
                    top: `${[10, 70, 20, 80][i]}%`,
                    left: `${[-10, 105, -15, 100][i]}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {mood}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-clash font-bold mb-4">
            Why Choose <span className="logo-gradient">Moodify</span>?
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Experience music recommendation like never before with our cutting-edge features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: 'AI Emotion Detection',
              description: 'Advanced AI analyzes your mood through text, facial recognition, or manual selection.',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: Heart,
              title: 'Personalized Playlists',
              description: 'Get custom playlists that perfectly match your emotional state and music taste.',
              gradient: 'from-pink-500 to-rose-500',
            },
            {
              icon: TrendingUp,
              title: 'Mood Tracking',
              description: 'Visualize your emotional journey and discover patterns in your music preferences.',
              gradient: 'from-blue-500 to-cyan-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card-lg p-8 group hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card-lg p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/20 to-pink-500/20 animate-pulse"></div>
          <div className="relative z-10">
            <Users className="w-16 h-16 mx-auto mb-6 text-cosmic-light" />
            <h2 className="text-4xl md:text-5xl font-clash font-bold mb-6">
              Ready to Transform Your<br />
              <span className="logo-gradient">Music Experience?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of users who have discovered their perfect soundtrack with Moodify
            </p>
            <Link to="/signup" className="btn btn-primary text-lg px-12 py-4 shadow-2xl shadow-cosmic-purple/50">
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Music className="w-6 h-6 text-cosmic-purple" />
              <span className="text-xl font-clash font-bold logo-gradient">Moodify</span>
            </div>
            <p className="text-text-secondary text-sm">
              © 2025 Moodify. Crafted with 💜 for music lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
