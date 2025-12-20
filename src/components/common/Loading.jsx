const Loading = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizes[size]}`}
      />
      {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>
}

export default Loading
