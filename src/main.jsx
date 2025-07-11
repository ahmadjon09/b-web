import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import UserReducer from './toolkit/UserSlicer'
import { LanguageProvider } from './context/LanguageContext'

const store = configureStore({
  reducer: {
    user: UserReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <LanguageProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </LanguageProvider>
)
