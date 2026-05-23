import React, { useContext } from 'react'
import { DataContext } from '../Context/DataContext'
import { CartContext } from '../Context/CartContext'
import { Heart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../Context/WishlistContext'

const ProductGallery = () => {

  const { data } = useContext(DataContext)
  const { addToCart } = useContext(CartContext)
  const { toggleWishlist, isWishlisted } = useWishlist()
  const navigate = useNavigate()

  if (!data || data.length === 0) return null

  const openProduct = (id) => {
    navigate(`/product/${id}`)
  }

  return (
    <section className="home-products">

      <div className="section-header">
        <h2>🔥 Trending This Week</h2>
        <p>Discover our most popular products loved by customers</p>
      </div>

      <div className="home-product-grid">

        {data.slice(0, 30).map((item) => {

          const price = item.priceCents / 100
          const rating = item.rating?.stars || 0
          const wishlisted = isWishlisted(item.id)

          const discount =
            item.originalPrice
              ? Math.round(
                  ((item.originalPrice - price) / item.originalPrice) * 100
                )
              : 0

          return (
            <div key={item.id} className="home-card">

              {/* IMAGE */}
              <div
                className="home-image-wrapper"
                onClick={() => openProduct(item.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="home-product-image"
                />

                <button
                  className="home-wishlist"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(item)
                  }}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  style={{
                    background: wishlisted ? "#fef2f2" : "white",
                    border: wishlisted ? "1px solid #fecaca" : "1px solid #e5e7eb",
                  }}
                >
                  <Heart
                    size={18}
                    fill={wishlisted ? '#ef4444' : 'none'}
                    color={wishlisted ? '#ef4444' : '#6b7280'}
                  />
                </button>

                {discount > 0 && (
                  <span className="discount-badge">
                    {discount}% OFF
                  </span>
                )}

                {rating >= 4.6 && (
                  <span className="bestseller-badge">
                    Bestseller
                  </span>
                )}
              </div>

              {/* INFO */}
              <div className="home-info">

                <span className="home-category">
                  {item.category}
                </span>

                <h3
                  className="home-title"
                  onClick={() => openProduct(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  {item.name}
                </h3>

                {/* RATING */}
                <div className="home-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                      stroke="#fbbf24"
                    />
                  ))}
                  <span>
                    {rating} ({item.rating?.count || 0})
                  </span>
                </div>

                {/* PRICE */}
                <div className="home-price">
                  <span className="current">
                    ₹ {price.toFixed(2)}
                  </span>
                  {item.originalPrice && (
                    <span className="old">
                      ₹ {item.originalPrice}
                    </span>
                  )}
                </div>

                {/* ADD TO CART */}
                <button
                  className="home-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>

              </div>
            </div>
          )
        })}

      </div>

    </section>
  )
}

export default ProductGallery