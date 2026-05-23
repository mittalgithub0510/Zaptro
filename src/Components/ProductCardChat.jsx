import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

const ProductCardChat = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  if (!product) return null;

  const price = product.priceCents
    ? (product.priceCents / 100).toFixed(2)
    : product.price;
  const rating = product.rating?.stars || product.rating || 0;
  const shortDescription =
    product.description && typeof product.description === "string"
      ? product.description.length > 90
        ? product.description.slice(0, 87) + "..."
        : product.description
      : "";

  const goToProduct = () => {
    if (product.id == null) return;
    navigate(`/product/${product.id}`);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="zaptro-ai-product-card">
      <div className="zaptro-ai-product-image-wrap">
        <img
          src={product.image}
          alt={product.name || product.title}
          className="zaptro-ai-product-image"
          loading="lazy"
        />
      </div>

      <div className="zaptro-ai-product-name">
        {product.name || product.title}
      </div>

      <div className="zaptro-ai-product-meta">
        <span className="zaptro-ai-product-price">₹ {price}</span>
        <span className="zaptro-ai-product-rating">⭐ {rating}</span>
      </div>

      {shortDescription && (
        <div className="zaptro-ai-product-desc">{shortDescription}</div>
      )}

      <div className="zaptro-ai-product-actions">
        <button
          type="button"
          className="zaptro-ai-btn zaptro-ai-btn-primary"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
        <button
          type="button"
          className="zaptro-ai-btn zaptro-ai-btn-secondary"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button
          type="button"
          className="zaptro-ai-btn zaptro-ai-btn-ghost"
          onClick={goToProduct}
        >
          Visit Product
        </button>
      </div>
    </div>
  );
};

export default ProductCardChat;

