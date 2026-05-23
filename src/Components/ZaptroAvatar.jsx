import React from "react";

const ZaptroAvatar = ({ size = 28 }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 30% 30%, rgba(248,113,113,0.98), rgba(239,68,68,0.92) 50%, rgba(127,29,29,0.96) 100%)",
        boxShadow:
          "0 10px 22px rgba(15,23,42,0.55), 0 0 0 1px rgba(148,163,184,0.25)",
        color: "#fff7ed",
        fontWeight: 800,
        fontSize: Math.max(12, Math.floor(size * 0.45)),
        letterSpacing: "0.02em",
        userSelect: "none",
      }}
    >
      Z
    </div>
  );
};

export default ZaptroAvatar;

