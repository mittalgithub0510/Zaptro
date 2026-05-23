import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId || `ZAP-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div style={styles.container} className="success-container">
      <div style={styles.card} className="success-card success-card-mobile">

        {/* Animated check icon */}
        <div style={styles.iconWrapper}>
          <CheckCircle size={70} color="#22c55e" strokeWidth={1.5} />
        </div>

        <h2 style={styles.title} className="success-title success-title-mobile">
          Order Placed Successfully!
        </h2>

        <p style={styles.text} className="success-text success-text-mobile">
          Thank you for shopping with <strong>ZAPTRO</strong> ❤️<br />
          Your order has been confirmed and will be shipped soon.
        </p>

        {/* Order ID Badge */}
        <div style={styles.orderIdBox}>
          <Package size={16} color="#f97316" />
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
            Order ID:&nbsp;
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#f97316", letterSpacing: "1px" }}>
            {orderId}
          </span>
        </div>

        <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "28px" }}>
          Save this order ID for tracking your order.
        </p>

        <button
          style={styles.button}
          className="button-interactive"
          onClick={() => navigate("/")}
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2f3, #dfe9f3)",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#ffffff",
    padding: "45px 30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
  },
  iconWrapper: {
    marginBottom: "20px",
    animation: "pulse 1.5s ease-in-out",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1f2937",
  },
  text: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  orderIdBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff7ed",
    border: "1.5px solid #fed7aa",
    borderRadius: "10px",
    padding: "10px 18px",
    marginBottom: "12px",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #FF6B6B, #f97316)",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    boxShadow: "0 8px 20px rgba(249,115,22,0.3)",
    transition: "opacity 0.2s",
  },
};

export default Success;