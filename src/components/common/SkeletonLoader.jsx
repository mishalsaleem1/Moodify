const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const CardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )

  const TextSkeleton = () => (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6" />
    </div>
  )

  const skeletonComponents = {
    card: CardSkeleton,
    list: ListSkeleton,
    text: TextSkeleton,
  }

  const SkeletonComponent = skeletonComponents[type] || CardSkeleton

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  )
}

export default SkeletonLoader
