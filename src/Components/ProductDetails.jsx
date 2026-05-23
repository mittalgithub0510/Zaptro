import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataContext } from "../Context/DataContext";
import { CartContext } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import { Heart } from "lucide-react";
import ProductsCard from "./ProductsCard";
import LoadingSkeleton from "./LoadingSkeleton";

const ProductDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data, loading } = useContext(DataContext);
  const {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart
  } = useContext(CartContext);

  const { toggleWishlist, isWishlisted } = useWishlist();

  // Show skeleton while loading
  if (loading) {
    return (
      <div style={{ padding: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <LoadingSkeleton type="detail" />
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  const product = data.find(
    item => String(item.id) === String(id)
  );

  if (!product) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h2 style={{ color: "#374151", marginBottom: "12px" }}>Product Not Found</h2>
      <button
        onClick={() => navigate("/product")}
        style={{
          padding: "10px 24px",
          background: "linear-gradient(135deg, #FF6B6B, #f97316)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Browse All Products
      </button>
    </div>
  );

  const price = product.priceCents / 100;

  const relatedProducts = data.filter(
    item =>
      item.category === product.category &&
      item.id !== product.id
  );

  const cartItem = cartItems.find(
    item => item.id === product.id
  );

  const quantity = cartItem ? cartItem.quantity : 0;
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => addToCart(product, 1);
  const handleIncrease = () => increaseQty(product.id);
  const handleDecrease = () => {
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      decreaseQty(product.id);
    }
  };

  const handleBuyNow = () => {
    if (!cartItem) addToCart(product, 1);
    navigate("/checkout");
  };

  return (
    <section className="apple-wrapper apple-wrapper-mobile">

      <div className="apple-card apple-card-mobile">

        {/* IMAGE */}
        <div className="apple-image-section apple-image-section-mobile">
          <img
            src={product.image}
            alt={product.name}
            className="apple-image image-lazy"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        </div>

        {/* DETAILS */}
        <div className="apple-details-section">

          <p className="apple-category">
            {product.category}
          </p>

          <h1 className="apple-title">
            {product.name}
          </h1>

          <div className="apple-rating">
            ⭐ {product.rating?.stars || 4.8}
            <span> ({product.rating?.count || 0} reviews)</span>
          </div>

          <h2 className="apple-price">
            ₹ {price.toFixed(2)}
          </h2>

          <p className="apple-description">
            {product.description}
          </p>

          {/* ADD / QUANTITY / WISHLIST */}
          <div className="apple-buttons">

            {quantity === 0 ? (
              <button
                className="apple-cart-btn button-interactive"
                onClick={handleAdd}
              >
                Add to Cart
              </button>
            ) : (
              <div className="apple-quantity">
                <button onClick={handleDecrease}>-</button>
                <span>{quantity}</span>
                <button style={{ borderRadius: "0 50% 50% 0" }} onClick={handleIncrease}>+</button>
              </div>
            )}

            <button
              className="apple-buy-btn button-interactive"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

            {/* Wishlist toggle button */}
            <button
              onClick={() => toggleWishlist(product)}
              title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: wishlisted ? "1.5px solid #fecaca" : "1.5px solid #e5e7eb",
                background: wishlisted ? "#fef2f2" : "#fff",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: wishlisted ? "#ef4444" : "#6b7280",
                transition: "all 0.2s",
              }}
            >
              <Heart
                size={16}
                fill={wishlisted ? '#ef4444' : 'none'}
                color={wishlisted ? '#ef4444' : '#6b7280'}
              />
              {wishlisted ? "Wishlisted" : "Wishlist"}
            </button>

          </div>

        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="apple-related apple-grid-mobile">
          <h2>Related Products in {product.category}</h2>
          <div className="apple-grid">
            {relatedProducts.slice(0, 8).map(item => (
              <ProductsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

    </section>
  );
};

export default ProductDetails;