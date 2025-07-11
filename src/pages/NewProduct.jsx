import { Loader2, DatabaseBackup } from 'lucide-react'
import { ProductCard } from '../components/Products'

export const ProductList = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className='w-full h-[30vh] flex items-center justify-center text-gray-400 gap-1'>
        <Loader2 className='animate-spin' /> Yuklanmoqda...
      </div>
    )
  }
  if (!Array.isArray(products) || products.length === 0 || !products) {
    return (
      <div className='w-full h-[30vh] flex items-center justify-center text-red-500 gap-1'>
        <DatabaseBackup /> No data...
      </div>
    )
  }

  const shuffled = [...products].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 5)

  return (
    <div className='flex flex-wrap gap-4 justify-center'>
      {selected.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
