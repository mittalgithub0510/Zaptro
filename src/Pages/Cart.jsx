import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    tax,
    delivery,
    finalTotal
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="cart-page">

      {cartItems.length === 0 ? (
        <div className="empty-cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <ShoppingCart size={80} color="#d1d5db" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', marginBottom: '10px' }}>Your cart is empty</h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
          <button 
            className="signInButton button-interactive"
            style={{ padding: '12px 24px', fontSize: '16px', borderRadius: '8px' }}
            onClick={() => navigate('/product')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* LEFT SIDE */}
          <div className="cart-items">
            <h2 className="your-cart">🛒 Your Cart Items</h2>

            {cartItems.map(item => (
              <div className="cart-card" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>

                  <p>
                    Price: ₹ {(item.priceCents / 100).toFixed(2)}
                  </p>

                  <div className="quantity">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.id);
                        } else {
                          decreaseQty(item.id);
                        }
                      }}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQty(item.id)}>
                      +
                    </button>
                  </div>

                  <p className="subtotal">
                    Subtotal: ₹ {(
                      (item.priceCents / 100) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE BILL */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {totalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹ {tax.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>
                {delivery === 0 ? "Free" : `₹ ${delivery}`}
              </span>
            </div>

            {delivery === 0 && (
              <p className="free-delivery-msg">
                🎉 You got Free Delivery!
              </p>
            )}

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>₹ {finalTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Pay ₹ {finalTotal.toFixed(2)}
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default Cart;