import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, MessageSquare, Smile, Play, Loader, Sparkles } from 'lucide-react'
import { useMoodStore } from '../store/useMoodStore'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { emotionService } from '../services'

const EmotionDetection = () => {
  const navigate = useNavigate()
  const { setMood } = useMoodStore()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  
  const [text, setText] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [detectedMood, setDetectedMood] = useState(null)
  const [cameraStream, setCameraStream] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-500' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-400 to-indigo-500' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'from-emerald-400 to-teal-500' },
    { id: 'angry', emoji: '😠', label: 'Angry', color: 'from-red-400 to-rose-500' },
    { id: 'energetic', emoji: '⚡', label: 'Energetic', color: 'from-pink-400 to-rose-500' },
    { id: 'romantic', emoji: '💕', label: 'Romantic', color: 'from-rose-400 to-pink-500' },
  ]

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraStream(stream)
      setCameraActive(true)
      toast.success('Camera started! 📸')
    } catch (error) {
      console.error('Camera access error:', error)
      toast.error('Failed to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
      setCameraActive(false)
    }
  }

  const captureEmotion = async () => {
    if (!cameraActive) {
      await startCamera()
      return
    }

    setDetecting(true)
    
    // Simulate emotion detection (replace with actual API call)
    setTimeout(() => {
      const randomMood = moods[Math.floor(Math.random() * moods.length)]
      handleMoodDetected(randomMood.id, 0.92)
      stopCamera()
    }, 2000)
  }

  const analyzeText = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    setDetecting(true)
    
    // Simulate text analysis (replace with actual API call)
    setTimeout(() => {
      // Simple sentiment analysis simulation
      const lowerText = text.toLowerCase()
      let detectedMoodId = 'calm'
      
      if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('great')) {
        detectedMoodId = 'happy'
      } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('cry')) {
        detectedMoodId = 'sad'
      } else if (lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('furious')) {
        detectedMoodId = 'angry'
      } else if (lowerText.includes('energetic') || lowerText.includes('excited') || lowerText.includes('pump')) {
        detectedMoodId = 'energetic'
      } else if (lowerText.includes('love') || lowerText.includes('romantic') || lowerText.includes('heart')) {
        detectedMoodId = 'romantic'
      }
      
      handleMoodDetected(detectedMoodId, 0.87)
    }, 1500)
  }

  const selectManualMood = (moodId) => {
    setDetecting(true)
    setTimeout(() => {
      handleMoodDetected(moodId, 1.0)
    }, 500)
  }

  const handleMoodDetected = async (moodId, confidence) => {
    console.log('🎭 ========== MOOD DETECTED ==========')
    console.log('📊 Mood ID:', moodId)
    console.log('📈 Confidence:', confidence)
    
    const mood = moods.find(m => m.id === moodId)
    console.log('✅ Mood details:', mood)
    
    setDetectedMood({ ...mood, confidence })
    setMood(moodId, confidence)
    setDetecting(false)
    
    // Save emotion to database
    try {
      console.log('💾 Saving emotion to database...')
      const emotionData = {
        emotion: moodId,
        confidence: confidence,
        text: text || null, // Include text if it was text-based detection
        source: text ? 'text' : 'manual', // Track detection method
      }
      console.log('📤 Emotion data to save:', emotionData)
      
      const savedEmotion = await emotionService.detectEmotion(emotionData)
      console.log('✅ Emotion saved to database:', savedEmotion)
      
    } catch (error) {
      console.error('❌ Error saving emotion:', error)
      // Continue anyway - don't block user flow
    }
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    toast.success(`Mood detected: ${mood.label}! 🎉`)
    console.log('🎵 Redirecting to recommendations page with mood:', moodId)
    console.log('====================================')
    
    // Navigate to recommendations after 2 seconds
    setTimeout(() => {
      navigate('/recommendations')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#0f051d] to-[#1a0033] dark:from-[#1a0033] dark:via-[#0f051d] dark:to-[#1a0033] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-purple-400" />
            Detect Your Mood
          </h1>
          <p className="dark:text-[#e0dfff]/70 text-gray-600 text-xl">
            Choose your preferred method to discover music that matches your vibe
          </p>
        </motion.div>

        {/* Mood Detection Result */}
        <AnimatePresence>
          {detectedMood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="mb-12 text-center"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 inline-block">
                <div className={`text-8xl mb-4 inline-block animate-bounce`}>
                  {detectedMood.emoji}
                </div>
                <h2 className="text-4xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-2">
                  You&apos;re feeling {detectedMood.label}!
                </h2>
                <p className="dark:text-[#e0dfff]/70 text-gray-600 text-lg">
                  Confidence: {(detectedMood.confidence * 100).toFixed(0)}%
                </p>
                <p className="text-purple-400 mt-4 flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating personalized recommendations...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detection Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Webcam Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/6 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 flex items-center gap-2">
                <Camera className="w-7 h-7 text-purple-400" />
                Webcam
              </h3>
              {cameraActive && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                  Live
                </span>
              )}
            </div>
            
            <p className="dark:text-[#e0dfff]/70 text-gray-600 mb-6">
              Let AI analyze your facial expression to detect your current mood
            </p>

            {/* Camera Preview */}
            <div className="relative mb-6 bg-black/30 rounded-2xl overflow-hidden aspect-video">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-[#e0dfff]/30" />
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <button
              onClick={captureEmotion}
              disabled={detecting}
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {detecting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : cameraActive ? (
                <>
                  <Play className="w-5 h-5" />
                  Capture Emotion
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Start Camera
                </>
              )}
            </button>
          </motion.div>

          {/* Text Input Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/6 transition-all duration-300"
          >
            <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-purple-400" />
              Text Input
            </h3>
            
            <p className="dark:text-[#e0dfff]/70 text-gray-600 mb-6">
              Describe how you&apos;re feeling and we&apos;ll analyze your mood
            </p>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="E.g., I'm feeling energetic and ready to take on the world! 💪"
              rows={6}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 dark:text-[#f8f8ff] text-gray-900 dark:placeholder-[#e0dfff]/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all resize-none mb-6"
            />

            <button
              onClick={analyzeText}
              disabled={detecting || !text.trim()}
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {detecting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Analyze Text
                </>
              )}
            </button>
          </motion.div>

          {/* Manual Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/6 transition-all duration-300"
          >
            <h3 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-6 flex items-center gap-2">
              <Smile className="w-7 h-7 text-purple-400" />
              Manual Select
            </h3>
            
            <p className="dark:text-[#e0dfff]/70 text-gray-600 mb-6">
              Already know your mood? Pick it directly from the options
            </p>

            <div className="grid grid-cols-2 gap-4">
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  onClick={() => selectManualMood(mood.id)}
                  disabled={detecting}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className={`text-5xl mb-3 group-hover:scale-110 transition-transform`}>
                    {mood.emoji}
                  </div>
                  <p className="dark:text-[#f8f8ff] text-gray-900 font-semibold">{mood.label}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="dark:text-[#f8f8ff] text-gray-900 font-semibold mb-2">How it works</h4>
              <p className="dark:text-[#e0dfff]/70 text-gray-600 text-sm leading-relaxed">
                Our advanced AI analyzes your facial expressions, text sentiment, or manual selection to understand your current emotional state. 
                Based on this, we curate a personalized playlist of songs that perfectly match and enhance your mood.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EmotionDetection

