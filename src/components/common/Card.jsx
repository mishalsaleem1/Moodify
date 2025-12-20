import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  noPadding = false,
  ...props
}) => {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-200'
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1' : ''
  const paddingStyles = noPadding ? '' : 'p-6'
  const cursorStyles = onClick ? 'cursor-pointer' : ''

  const classes = `${baseStyles} ${hoverStyles} ${paddingStyles} ${cursorStyles} ${className}`.trim()

  const CardComponent = motion.div

  return (
    <CardComponent
      whileHover={hover && onClick ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </CardComponent>
  )
}

export default Card
