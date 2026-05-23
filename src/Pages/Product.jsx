import React, { useContext, useState, useMemo } from 'react'
import { DataContext } from '../Context/DataContext'
import ProductCard from '../Components/ProductsCard'
import FilterSection from '../Components/FilterSection'
import { SearchX } from "lucide-react"
import { useLocation } from 'react-router-dom'
import LoadingSkeleton from '../Components/LoadingSkeleton'

const Product = () => {

  const { data, loading } = useContext(DataContext)
  const location = useLocation()

  const initialCategory = location.state?.selectedCategory || ''

  const [filters, setFilters] = useState({
    category: initialCategory,
    maxPrice: 10000,
    minRating: 0
  })

  const categories = data
    ? [...new Set(data.map(item => item.category))]
    : []

  const filteredProducts = useMemo(() => {

    if (!data || data.length === 0) return []

    return data.filter(item => {

      const price = item.priceCents / 100

      const matchCategory =
        filters.category
          ? item.category === filters.category
          : true

      const matchPrice =
        price <= filters.maxPrice

      const matchRating =
        (item.rating?.stars || 0) >= filters.minRating

      return matchCategory && matchPrice && matchRating

    })

  }, [data, filters])

  return (
    <div style={{ display: 'flex', gap: '20px', padding: "30px" }}>

      {/* Sidebar Filter */}
      <FilterSection
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />

      {/* Products Section */}
      <div className="product-grid" style={{ flex: 1 }}>

        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <LoadingSkeleton key={i} type="card" />
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state-search" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <SearchX size={50} color="#9ca3af" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ color: '#4b5563', fontSize: '1.2rem', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Try adjusting your filters to find what you're looking for.</p>
          </div>
        ) : (
          filteredProducts.map(item => (
            <ProductCard key={item.id} item={item} />
          ))
        )}

      </div>

    </div>
  )
}

export default Product