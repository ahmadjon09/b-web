import { useState } from 'react'
import { StarRating } from './Stars'

export const CommentCard = ({ comment }) => {
  if (comment == undefined) {
    return
  }
  const { user, rating, comment: text, createdAt } = comment
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 200

  const toggleExpand = () => setExpanded(prev => !prev)
  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-4 transition-transform hover:scale-[1.01] sm:hover:scale-[1.02]'>
      <div className='flex items-center gap-3 mb-3'>
        <img
          src={user?.avatar || ''}
          alt='avatar'
          className='w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border'
        />
        <div>
          <p className='font-semibold text-gray-800 dark:text-white text-sm sm:text-base'>
            {user?.firstName} {user?.lastName}
          </p>
          <p className='text-xs text-gray-500'>
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-1 mb-2'>
        <StarRating rating={rating} />
      </div>

      <p className='text-gray-700 dark:text-gray-200 text-sm leading-relaxed'>
        {expanded || !isLong ? text : `${text.slice(0, 200)}...`}
      </p>

      {isLong && (
        <button
          onClick={toggleExpand}
          className='mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline'
        >
          {expanded ? 'Yopish' : "Ko'proq"}
        </button>
      )}
    </div>
  )
}
