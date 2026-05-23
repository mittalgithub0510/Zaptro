import React from "react";

const ComparisonCard = ({ comparison }) => {
  if (!comparison) return null;

  const { left, right, recommendation, criteria } = comparison;
  const formatPrice = (p) =>
    typeof p?.priceCents === "number"
      ? (p.priceCents / 100).toFixed(2)
      : p?.price;

  return (
    <div
      style={{
        borderRadius: "12px",
        border: "1px solid rgba(55,65,81,0.9)",
        backgroundColor: "#020617",
        padding: "8px",
        fontSize: "0.78rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          marginBottom: "6px",
        }}
      >
        {[left, right].map((p, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "10px",
              backgroundColor: "#0b1120",
              padding: "6px",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>
              {p?.name || p?.title}
            </div>
            <div style={{ color: "#fbbf24", marginBottom: "2px" }}>
              ₹ {formatPrice(p)}
            </div>
            <div style={{ color: "#9ca3af", marginBottom: "2px" }}>
              ⭐ {p?.rating?.stars || p?.rating || 0}
            </div>
            {p?.category && <div style={{ color: "#6b7280" }}>{p.category}</div>}
          </div>
        ))}
      </div>

      {Array.isArray(criteria) && criteria.length > 0 && (
        <ul style={{ margin: "0 0 4px", paddingLeft: "16px", color: "#9ca3af" }}>
          {criteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}

      {recommendation && (
        <div style={{ marginTop: "4px", color: "#bbf7d0" }}>
          Recommendation: <strong>{recommendation}</strong>
        </div>
      )}
    </div>
  );
};

export default ComparisonCard;

