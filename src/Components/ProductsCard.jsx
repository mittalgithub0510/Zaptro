import React, { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import { CartContext } from '../Context/CartContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../Context/WishlistContext'

const ProductsCard = ({ item }) => {

  const { addToCart } = useContext(CartContext)
  const { toggleWishlist, isWishlisted } = useWishlist()
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)

  const wishlisted = isWishlisted(item.id)

  return (
    <div
      className="shop-card shop-card-enhanced"
      onClick={() => navigate(`/product/${item.id}`)}
      style={{ cursor: "pointer" }}
    >

      <div className="shop-card-image-container">

        <img
          src={item.image}
          alt={item.name}
          className="shop-card-image image-lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />

        <Heart
          className={`shop-wishlist-btn ${wishlisted ? 'heartbeat-animation' : ''}`}
          size={20}
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(item)
          }}
          fill={wishlisted ? '#ef4444' : 'none'}
          color={wishlisted ? '#ef4444' : 'currentColor'}
        />

        {item.rating?.stars >= 4.6 && (
          <span className="shop-badge">Bestseller</span>
        )}

      </div>

      <div className="shop-card-info">

        <span className="shop-category">
          {item.category}
        </span>

        <h3 className="shop-title">
          {item.name}
        </h3>

        <div className="shop-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(item.rating?.stars || 0)
                ? '#fbbf24'
                : 'none'}
            />
          ))}
          <span>
            {item.rating?.stars || 0}
          </span>
        </div>

        <div className="shop-price">
          ₹ {(item.priceCents / 100).toFixed(2)}
        </div>

        <button
          className="shop-add-btn button-interactive"
          onClick={(e) => {
            e.stopPropagation()
            addToCart(item)
          }}
        >
          Add to Cart
        </button>

      </div>

    </div>
  )
}

export default React.memo(ProductsCard)