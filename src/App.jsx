import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import AIChatBot from './Components/AIChatBot'
import ProtectedRoute from './Components/ProtectedRoute'
import LoadingSkeleton from './Components/LoadingSkeleton'
import { useGeolocation } from './hooks/useGeolocation'
import BottomNav from './Components/BottomNav'

const Home        = lazy(() => import('./Pages/Home'))
const About       = lazy(() => import('./Pages/About'))
const Contact     = lazy(() => import('./Pages/Contact'))
const Cart        = lazy(() => import('./Pages/Cart'))
const Product     = lazy(() => import('./Pages/Product'))
const ProductDetails = lazy(() => import('./Components/ProductDetails'))
const Checkout    = lazy(() => import('./Components/Checkout'))
const Success     = lazy(() => import('./Components/Success'))
const NotFound    = lazy(() => import('./Pages/NotFound'))

const SuspenseFallback = () => (
  <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <LoadingSkeleton key={i} type="card" />
    ))}
  </div>
)

const App = () => {
  const { location, setLocation, getLocation } = useGeolocation()

  return (
    <div>
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '10px',
            background: '#1f2937',
            color: '#f9fafb',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#f97316', secondary: '#fff' },
          },
        }}
      />

      <Navbar location={location} setLocation={setLocation} getLocation={getLocation} />

      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path='/'          element={<Home />} />
          <Route path='/about'     element={<About />} />
          <Route path='/contact'   element={<Contact />} />
          <Route path='/product'   element={<Product />} />
          <Route path='/product/:id' element={<ProductDetails />} />

          {/* Protected Routes — require sign in */}
          <Route path='/cart' element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path='/checkout' element={
            <ProtectedRoute><Checkout location={location} /></ProtectedRoute>
          } />
          <Route path='/success' element={
            <ProtectedRoute><Success /></ProtectedRoute>
          } />

          {/* 404 Catch-all */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
      <BottomNav />
      <AIChatBot />
    </div>
  )
}

export default App