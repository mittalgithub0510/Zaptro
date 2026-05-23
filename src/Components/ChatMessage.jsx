import React from "react";
import ProductCardChat from "./ProductCardChat";
import ComparisonCard from "./ComparisonCard";
import CategorySuggestions from "./CategorySuggestions";

const ChatMessage = ({ message, onCategoryClick, onQuickLink }) => {
  const isUser = message.from === "user";
  const quickLinks = Array.isArray(message.quickLinks) ? message.quickLinks : [];

  const categories =
    message.suggestions && Array.isArray(message.suggestions.categories)
      ? message.suggestions.categories
      : [];

  const similar =
    message.suggestions && Array.isArray(message.suggestions.similar)
      ? message.suggestions.similar
      : [];

  const cheaper =
    message.suggestions && Array.isArray(message.suggestions.cheaper)
      ? message.suggestions.cheaper
      : [];

  const trending =
    message.suggestions && Array.isArray(message.suggestions.trending)
      ? message.suggestions.trending
      : [];

  return (
    <div
      className={`zaptro-ai-message ${
        isUser ? "zaptro-ai-message-user" : "zaptro-ai-message-bot"
      }`}
    >
      <div
        className={`zaptro-ai-message-bubble ${
          isUser
            ? "zaptro-ai-message-bubble-user"
            : "zaptro-ai-message-bubble-bot"
        }`}
      >
        {message.text && (
          <div style={{ whiteSpace: "pre-line" }}>{message.text}</div>
        )}

        {quickLinks.length > 0 && (
          <div className="zaptro-ai-chip-row">
            {quickLinks.map((q) => (
              <button
                key={q.id || q.label}
                type="button"
                className="zaptro-ai-chip"
                onClick={() => onQuickLink?.(q)}
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {Array.isArray(message.products) && message.products.length > 0 && (
          <div className="zaptro-ai-product-grid">
            {message.products.map((p) => (
              <ProductCardChat key={p.id} product={p} />
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <>
            <div className="zaptro-ai-section-label">
              Suggested categories
            </div>
            <CategorySuggestions
              categories={categories}
              onCategoryClick={onCategoryClick}
            />
          </>
        )}

        {similar.length > 0 && (
          <>
            <div className="zaptro-ai-section-label">
              You may also like
            </div>
            <div className="zaptro-ai-product-grid">
              {similar.map((p) => (
                <ProductCardChat key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        {cheaper.length > 0 && (
          <>
            <div className="zaptro-ai-section-label">
              Cheaper alternatives
            </div>
            <div className="zaptro-ai-product-grid">
              {cheaper.map((p) => (
                <ProductCardChat key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        {trending.length > 0 && (
          <>
            <div className="zaptro-ai-section-label">
              Trending in this category
            </div>
            <div className="zaptro-ai-product-grid">
              {trending.map((p) => (
                <ProductCardChat key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        {message.comparison && (
          <div style={{ marginTop: "10px" }}>
            <ComparisonCard comparison={message.comparison} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

