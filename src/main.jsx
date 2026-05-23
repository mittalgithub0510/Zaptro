import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { DataProvider } from './Context/DataContext.jsx'
import { CartProvider } from './Context/CartContext.jsx'
import { WishlistProvider } from './Context/WishlistContext.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <DataProvider>
    <CartProvider>
      <WishlistProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ClerkProvider>
      </WishlistProvider>
    </CartProvider>
  </DataProvider>
)