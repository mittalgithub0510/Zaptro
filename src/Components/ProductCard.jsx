import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h4>{product.title}</h4>
      <p>₹ {product.price}</p>
      <p>⭐ {product.rating}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;