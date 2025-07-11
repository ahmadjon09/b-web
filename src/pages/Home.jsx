import { Link } from 'react-router-dom'
import { QuickBar } from '../components/QuickBar'
import Carousel from '../service/Carousel'
import { MoveRight } from 'lucide-react'
import { ProductList } from './NewProduct'
import useSWR from 'swr'
import Axios from '../Axios'

export const Home = () => {
  const {
    data: newProData,
    isLoading: newProLoading,
    error: newProError
  } = useSWR('product/newproducts', Axios)
  const newProducts = newProData?.data?.data || []

  return (
    <div className='w-full container'>
      <QuickBar />
      <Carousel />
      <br />
      <div className='w-full p-4'>
        <Link
          className='text-xl sm:text-2xl font-extrabold text-center mb-6 text-purple-700 flex items-center gap-1'
          to={'new-products'}
        >
          Yangi mahsulotlar <MoveRight />
        </Link>
        <ProductList products={newProducts} isLoading={newProLoading} />
      </div>
      <div className='h-screen'></div>
    </div>
  )
}
