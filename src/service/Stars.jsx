import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export const StarRating = ({ rating }) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} color='#FFD700' />)
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} color='#FFD700' />)
    } else {
      stars.push(<FaRegStar key={i} color='#FFD700' />)
    }
  }

  return <div style={{ display: 'flex' }}>{stars}</div>
}
