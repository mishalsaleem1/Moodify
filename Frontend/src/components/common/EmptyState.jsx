import { motion } from 'framer-motion'

const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      {Icon && (
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export default EmptyState
