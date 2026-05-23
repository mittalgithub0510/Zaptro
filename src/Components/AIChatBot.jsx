import React, { useState, useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import ZaptroAvatar from "./ZaptroAvatar";

const ChatWindow = lazy(() => import("./ChatWindow"));

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  if (!isClient || typeof document === "undefined") {
    return null;
  }

  const chatContent = (
    <>
      <button
        type="button"
        onClick={toggleChat}
        aria-label="Open ZAPTRO shopping assistant"
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          borderRadius: "999px",
          border: "none",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background:
            "linear-gradient(135deg, #111827 0%, #1f2937 50%, #f97316 100%)",
          color: "#f9fafb",
          boxShadow:
            "0 10px 30px rgba(15,23,42,0.45), 0 0 0 1px rgba(148,163,184,0.2)",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        <ZaptroAvatar size={26} />
      </button>

      {isOpen && (
        <Suspense fallback={null}>
          <ChatWindow onClose={toggleChat} />
        </Suspense>
      )}
    </>
  );

  return ReactDOM.createPortal(chatContent, document.body);
};

export default AIChatBot;

