import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiHome,
  FiMusic,
  FiList,
  FiStar,
  FiClock,
  FiUser,
  FiSettings,
  FiSmile,
} from 'react-icons/fi'

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/emotion-detection', label: 'Detect Emotion', icon: FiSmile },
    { path: '/recommendations', label: 'Recommendations', icon: FiMusic },
    { path: '/playlists', label: 'Playlists', icon: FiList },
    { path: '/favorites', label: 'Favorites', icon: FiStar },
    { path: '/history', label: 'History', icon: FiClock },
    { path: '/profile', label: 'Profile', icon: FiUser },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-40"
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  )
}

export default Sidebar
