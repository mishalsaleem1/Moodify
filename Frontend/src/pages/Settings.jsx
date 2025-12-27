import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, User, Music, Shield, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const [highQuality, setHighQuality] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [saveHistory, setSaveHistory] = useState(true)
  const [shareData, setShareData] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      settings: [
        { id: 'email', label: 'Email', value: 'user@moodify.com', type: 'text' },
        { id: 'password', label: 'Password', value: '••••••••', type: 'button', action: () => toast.info('Change password feature coming soon!') },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { id: 'push', label: 'Push Notifications', value: notifications, type: 'toggle', onChange: setNotifications },
        { id: 'email_notif', label: 'Email Notifications', value: emailNotifications, type: 'toggle', onChange: setEmailNotifications },
      ]
    },
    {
      title: 'Music Preferences',
      icon: Music,
      settings: [
        { id: 'autoplay', label: 'Autoplay', value: autoplay, type: 'toggle', onChange: setAutoplay },
        { id: 'quality', label: 'High Quality Audio', value: highQuality, type: 'toggle', onChange: setHighQuality },
      ]
    },
    {
      title: 'Privacy',
      icon: Shield,
      settings: [
        { id: 'history', label: 'Save Listening History', value: saveHistory, type: 'toggle', onChange: setSaveHistory },
        { id: 'analytics', label: 'Share Anonymous Data', value: shareData, type: 'toggle', onChange: setShareData },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#0f051d] to-[#1a0033] dark:from-[#1a0033] dark:via-[#0f051d] dark:to-[#1a0033] bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-4 flex items-center gap-3">
            <SettingsIcon className="w-12 h-12 text-purple-400" />
            Settings
          </h1>
          <p className="dark:text-[#e0dfff]/70 text-gray-600 text-xl">
            Customize your Moodify experience
          </p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
              >
                <h2 className="text-2xl font-bold dark:text-[#f8f8ff] text-gray-900 mb-6 flex items-center gap-3">
                  <Icon className="w-7 h-7 text-purple-400" />
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="dark:text-[#f8f8ff] text-gray-900 font-medium">{setting.label}</p>
                        {setting.type === 'text' && (
                          <p className="dark:text-[#e0dfff]/50 text-gray-600 text-sm mt-1">{setting.value}</p>
                        )}
                      </div>
                      
                      {setting.type === 'toggle' && (
                        <button
                          onClick={() => {
                            setting.onChange(!setting.value)
                            toast.success(`${setting.label} ${!setting.value ? 'enabled' : 'disabled'}`)
                          }}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                            setting.value ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]' : 'dark:bg-white/10 bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              setting.value ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                      
                      {setting.type === 'button' && (
                        <button
                          onClick={setting.action}
                          className="bg-white/5 border border-white/10 dark:text-[#f8f8ff] text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-6 py-4 rounded-xl hover:bg-red-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
