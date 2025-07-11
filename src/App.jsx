import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './layout/RootLayout'
import { Home } from './pages/Home'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import Axios from './Axios'
import {
  getUserError,
  getUserPending,
  getUserSuccess
} from './toolkit/UserSlicer'
import { LoadingState } from './components/Loading'
import Err from './pages/Err'
import { AboutPage } from './pages/About'
import { Contact } from './pages/Contact'
import ProductDetailPage from './pages/OneProduct'

export default function App () {
  const { isPending } = useSelector(state => state.user)
  const is_auth = Cookies.get('client_token')
  const dispatch = useDispatch()

  if (is_auth) {
    useEffect(() => {
      const getMyData = async () => {
        try {
          dispatch(getUserPending())
          const response = await Axios.get('client/me')
          if (response.data) {
            dispatch(getUserSuccess(response.data.data))
          } else {
            dispatch(getUserError('No Client data available'))
          }
        } catch (error) {
          dispatch(
            getUserError(error.response?.data.massage || 'Unknown Token')
          )
        }
      }

      if (is_auth) {
        getMyData()
      }
    }, [dispatch])
  }

  if (isPending) {
    return <LoadingState />
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: 'about',
          element: <AboutPage />
        },
        {
          path: 'contact',
          element: <Contact />
        },
        {
          path: 'product/:id',
          element: <ProductDetailPage />
        },
        {
          path: '*',
          element: <Err />
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}
