import React, { useContext, useEffect, useRef, useState } from "react";
import { X, Mic, Image as ImageIcon } from "lucide-react";
import { DataContext } from "../Context/DataContext";
import { CartContext } from "../Context/CartContext";
import { processUserMessage } from "../utils/chatbotEngine";
import ChatMessage from "./ChatMessage";
import VoiceSearchButton from "./VoiceSearchButton";
import ImageSearchButton from "./ImageSearchButton";
import "./aiChatbot.css";
import ZaptroAvatar from "./ZaptroAvatar";

const ChatWindow = ({ onClose }) => {
  const { data: products } = useContext(DataContext);
  const { cartItems, addToCart, removeFromCart, clearCart } =
    useContext(CartContext);

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      from: "bot",
      text:
        "Hii ! I am Modern Digital Shopping experience ZAPTRO Assistant. Tell me how can i help you",
      quickLinks: [
        { id: "ql-laptop", label: "Laptop", query: "laptop" },
        { id: "ql-headphones", label: "Headphone", query: "headphone" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [contextState, setContextState] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserQuery = async (userText, options = {}) => {
    const text = String(userText || "").trim();
    if (!text) return;

    const now = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: `${now}-user`, from: "user", text },
    ]);

    if (!products || products.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${now}-bot`,
          from: "bot",
          text: "Products are still loading. Please try again in a moment.",
        },
      ]);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processUserMessage(text, {
        products,
        cartItems,
        previousContext: contextState,
        imageMeta: options.imageMeta || null,
      });

      if (result.cartAction) {
        const { type, payload } = result.cartAction;
        if (type === "ADD_TO_CART") {
          addToCart(payload.product, payload.quantity || 1);
        } else if (type === "REMOVE_FROM_CART") {
          removeFromCart(payload.id);
        } else if (type === "CLEAR_CART") {
          clearCart();
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${now}-bot`,
          from: "bot",
          text: result.replyText,
          products: result.products || [],
          comparison: result.comparison || null,
          suggestions: result.suggestions || null,
        },
      ]);
      setContextState(result.updatedContext || null);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-bot`,
          from: "bot",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    handleUserQuery(text);
  };

  const handleVoiceResult = (text) => {
    if (!text) return;
    setInput(text);
    handleUserQuery(text);
  };

  const handleImageSelected = (file) => {
    if (!file) return;
    handleUserQuery(`Find products similar to this image: ${file.name}`, {
      imageMeta: { fileName: file.name },
    });
  };

  const handleCategoryClick = (categoryLabel) => {
    if (!categoryLabel) return;
    handleUserQuery(categoryLabel);
  };

  const handleQuickLink = (q) => {
    const query = q?.query;
    if (!query) return;
    handleUserQuery(query);
  };

  return (
    <div className="zaptro-ai-chat-window">
      <div className="zaptro-ai-chat-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ZaptroAvatar size={30} />
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>
              ZAPTRO Assistant
            </div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            Search, compare, and manage cart by chat.
          </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          style={{
            background: "transparent",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "999px",
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="zaptro-ai-chat-body">
        {isProcessing && (
          <div className="zaptro-ai-loading">
            <span>Finding the best products</span>
            <span className="zaptro-ai-loading-dot" />
            <span className="zaptro-ai-loading-dot" />
            <span className="zaptro-ai-loading-dot" />
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
            onCategoryClick={handleCategoryClick}
            onQuickLink={handleQuickLink}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="zaptro-ai-chat-footer">
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              placeholder="Ask: brand, color, gender, budget..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 90px 8px 10px",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                borderRadius: "999px",
                border: "1px solid rgba(55,65,81,0.9)",
                fontSize: "0.82rem",
                outline: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <VoiceSearchButton
                onResult={handleVoiceResult}
                icon={<Mic size={16} />}
              />
              <ImageSearchButton
                onImageSelected={handleImageSelected}
                icon={<ImageIcon size={16} />}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            style={{
              borderRadius: "999px",
              border: "none",
              padding: "8px 12px",
              background:
                "linear-gradient(135deg, #f97316, #fb923c, #fde68a)",
              color: "#111827",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: isProcessing ? "default" : "pointer",
              opacity: isProcessing ? 0.85 : 1,
            }}
          >
            {isProcessing ? "Thinking..." : "Send"}
          </button>
        </div>
        <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
          Example: “nike men black sneakers under 2500”
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

