import { forwardRef } from 'react'

const Input = forwardRef(
  (
    {
      label,
      error,
      type = 'text',
      placeholder,
      className = '',
      fullWidth = true,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const inputClasses = `
    w-full px-4 py-3 border rounded-lg
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-gray-100
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
    ${Icon ? 'pl-12' : ''}
    ${className}
  `.trim()

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
