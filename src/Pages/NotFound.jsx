import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Frown } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "40px 20px",
      background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Big 404 */}
      <div style={{
        fontSize: "clamp(80px, 20vw, 160px)",
        fontWeight: "900",
        background: "linear-gradient(135deg, #FF6B6B, #f97316)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
        letterSpacing: "-4px",
        marginBottom: "16px",
      }}>
        404
      </div>

      <Frown size={48} color="#9ca3af" style={{ marginBottom: "20px" }} />

      <h1 style={{
        fontSize: "clamp(1.4rem, 4vw, 2rem)",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "12px",
      }}>
        Page Not Found
      </h1>

      <p style={{
        fontSize: "1rem",
        color: "#6b7280",
        maxWidth: "400px",
        lineHeight: "1.6",
        marginBottom: "36px",
      }}>
        Looks like this page wandered off while shopping. Let's get you back on track!
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 28px",
            background: "linear-gradient(135deg, #FF6B6B, #f97316)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Go Home
        </button>

        <button
          onClick={() => navigate("/product")}
          style={{
            padding: "12px 28px",
            background: "white",
            color: "#374151",
            border: "2px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#f97316")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
        >
          <ShoppingBag size={16} />
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default NotFound;
