import {
  buildProductTaxonomy,
  parseIntentWithTaxonomy,
} from "./intentParser.taxonomy";
import {
  refineResultsByAttributes,
  searchProductsByImageMeta,
  searchProductsByTextAndAttributes,
} from "./productSearch";
import {
  getCheaperAlternatives,
  getRelatedProducts,
  getSimilarProducts,
  getTrendingProducts,
} from "./recommendationEngine";

let cachedTaxonomy = null;
let cachedProductsRef = null;

const ensureTaxonomy = (products) => {
  if (cachedProductsRef === products && cachedTaxonomy) return cachedTaxonomy;
  cachedProductsRef = products;
  cachedTaxonomy = buildProductTaxonomy(products);
  return cachedTaxonomy;
};

const MAX_CHAT_PRODUCTS = 6;

export const processUserMessage = async (text, context) => {
  const { products, cartItems, previousContext, imageMeta } = context;
  const taxonomy = ensureTaxonomy(products);

  const intent = parseIntentWithTaxonomy(text, previousContext, taxonomy);

  const baseReply = {
    replyText: "",
    products: [],
    comparison: null,
    suggestions: null,
    cartAction: null,
    updatedContext: previousContext || {},
  };

  switch (intent.type) {
    case "COMPARE_PRODUCTS":
      return handleCompare(intent, products, baseReply);
    case "ADD_TO_CART_FROM_RESULTS":
      return handleAddToCartFromChat(intent, previousContext, products, baseReply);
    case "REMOVE_FROM_CART":
      return handleRemoveFromCart(intent, cartItems, baseReply);
    case "CLEAR_CART":
      return handleClearCart(baseReply);
    case "SHOW_CART":
      return handleShowCart(cartItems, baseReply);
    case "TRENDING":
      return handleTrending(products, baseReply);
    case "REFINE_SEARCH":
      return handleRefine(intent, previousContext, baseReply);
    case "SEARCH_PRODUCTS":
    default:
      return handleSearch(intent, products, imageMeta, baseReply);
  }
};

const handleSearch = (intent, products, imageMeta, baseReply) => {
  const attrs = intent.attributes || {};

  let results = [];
  if (imageMeta) {
    results = searchProductsByImageMeta(products, imageMeta, attrs);
  } else {
    results = searchProductsByTextAndAttributes(
      products,
      intent.queryText,
      attrs,
      14
    );
  }

  if (!results.length) {
    return {
      ...baseReply,
      replyText:
        "I couldn’t find matches for that. Try relaxing a filter (brand/color/gender/budget) or using a simpler query.",
      updatedContext: {
        ...baseReply.updatedContext,
        lastSearch: [],
        lastSearchQuery: intent.queryText,
      },
    };
  }

  const main = results.slice(0, MAX_CHAT_PRODUCTS);
  const related = getRelatedProducts(products, main, 4);
  const combined = [...main, ...related].slice(0, MAX_CHAT_PRODUCTS);

  const categorySuggestions = buildCategorySuggestions(combined, attrs);

  const summaryBits = [];
  if (attrs.brand) summaryBits.push(`brand: ${attrs.brand}`);
  if (attrs.category) summaryBits.push(`category: ${attrs.category}`);
  if (attrs.productType) summaryBits.push(`type: ${attrs.productType}`);
  if (attrs.gender) summaryBits.push(`gender: ${attrs.gender}`);
  if (attrs.color?.length) summaryBits.push(`color: ${attrs.color.join(", ")}`);
  if (attrs.priceRange?.max != null)
    summaryBits.push(`under ₹${Number(attrs.priceRange.max).toLocaleString("en-IN")}`);
  if (attrs.priceRange?.min != null && attrs.priceRange?.max != null)
    summaryBits.push(
      `₹${Number(attrs.priceRange.min).toLocaleString("en-IN")}–₹${Number(
        attrs.priceRange.max
      ).toLocaleString("en-IN")}`
    );

  const header = summaryBits.length
    ? `Here are products matching (${summaryBits.join(" · ")}).`
    : "Here are some products I found.";

  const suggestionText =
    'You can say: "only black ones", "cheaper options", "compare nike vs adidas", or "add first product to cart".';

  return {
    ...baseReply,
    replyText: [header, related.length ? "You might also like these related items." : null, suggestionText]
      .filter(Boolean)
      .join("\n"),
    products: combined,
    suggestions: {
      categories: categorySuggestions,
    },
    updatedContext: {
      ...baseReply.updatedContext,
      lastSearch: combined,
      lastSearchQuery: intent.queryText,
      lastAttributes: attrs,
    },
  };
};

const handleRefine = (intent, previousContext, baseReply) => {
  if (!previousContext?.lastSearch?.length) {
    return {
      ...baseReply,
      replyText:
        "I’m not sure what to refine yet. Ask me to show products first, then refine like “only black ones” or “men under 2000”.",
    };
  }

  const refined = refineResultsByAttributes(
    previousContext.lastSearch,
    intent.refinement,
    14
  );

  if (!refined.length) {
    return {
      ...baseReply,
      replyText:
        "Nothing matched that refinement. Try a different color, brand, or a higher budget.",
      updatedContext: {
        ...previousContext,
        lastSearch: [],
      },
    };
  }

  return {
    ...baseReply,
    replyText: "Here are the refined results based on your preferences.",
    products: refined.slice(0, MAX_CHAT_PRODUCTS),
    updatedContext: {
      ...previousContext,
      lastSearch: refined,
      lastAttributes: intent.refinement,
    },
  };
};

const handleTrending = (products, baseReply) => {
  const trending = getTrendingProducts(products, MAX_CHAT_PRODUCTS);
  if (!trending.length) {
    return { ...baseReply, replyText: "I couldn’t load trending products right now." };
  }
  return {
    ...baseReply,
    replyText:
      "These are trending and highly rated right now. You can refine by brand, color, gender, and budget.",
    products: trending,
    updatedContext: {
      ...baseReply.updatedContext,
      lastSearch: trending,
      lastSearchQuery: "trending",
    },
  };
};

const handleCompare = (intent, products, baseReply) => {
  const raw = String(intent.raw || "");
  const lower = raw.toLowerCase();
  const parts = lower.replace("compare ", "").split(" vs ");
  const a = parts[0]?.trim();
  const b = parts[1]?.trim();

  const groupA = filterByBrandLike(products, a);
  const groupB = filterByBrandLike(products, b);

  if (!groupA.length || !groupB.length) {
    return {
      ...baseReply,
      replyText:
        "I couldn’t find enough products to compare. Try “compare <brand> vs <brand> shoes” or use product names.",
    };
  }

  const bestA = pickBestRated(groupA);
  const bestB = pickBestRated(groupB);

  const comparison = {
    left: bestA,
    right: bestB,
    criteria: ["Price", "Rating", "Category match"],
    recommendation: chooseRecommendation(bestA, bestB),
  };

  return {
    ...baseReply,
    replyText: "Here’s a quick comparison based on price and rating.",
    comparison,
    updatedContext: {
      ...baseReply.updatedContext,
      lastSearch: [bestA, bestB],
      lastSearchQuery: `compare ${a} vs ${b}`,
    },
  };
};

const handleAddToCartFromChat = (intent, previousContext, products, baseReply) => {
  const lower = String(intent.raw || "").toLowerCase();
  let index = 0;
  const indexMatch = lower.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th)\b/);
  if (indexMatch) {
    const word = indexMatch[1];
    if (word.startsWith("second") || word.startsWith("2")) index = 1;
    else if (word.startsWith("third") || word.startsWith("3")) index = 2;
    else if (word.startsWith("fourth") || word.startsWith("4")) index = 3;
  }

  const source =
    previousContext?.lastSearch?.length ? previousContext.lastSearch : products;
  const product = source[index];
  if (!product) {
    return {
      ...baseReply,
      replyText:
        "I’m not sure which product to add. Ask me to show products first, then say “add first product to cart”.",
    };
  }

  return {
    ...baseReply,
    replyText: `Added “${product.name || product.title}” to your cart.`,
    cartAction: { type: "ADD_TO_CART", payload: { product, quantity: 1 } },
    updatedContext: { ...previousContext },
    suggestions: buildSuggestions(products, product),
  };
};

const handleRemoveFromCart = (intent, cartItems, baseReply) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      ...baseReply,
      replyText: "Your cart is empty.",
    };
  }

  const lower = String(intent.raw || "").toLowerCase();
  const target = cartItems.find((item) => {
    const blob = normalize(`${item.name || ""} ${item.title || ""} ${item.category || ""}`);
    const tokens = normalize(lower).split(" ").filter(Boolean);
    return tokens.some((t) => t.length >= 3 && blob.includes(t));
  });

  const product = target || cartItems[0];
  return {
    ...baseReply,
    replyText: `Removed “${product.name || product.title}” from your cart.`,
    cartAction: { type: "REMOVE_FROM_CART", payload: { id: product.id } },
  };
};

const handleClearCart = (baseReply) => ({
  ...baseReply,
  replyText: "Cleared your cart.",
  cartAction: { type: "CLEAR_CART", payload: {} },
});

const handleShowCart = (cartItems, baseReply) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      ...baseReply,
      replyText: "Your cart is empty.",
    };
  }
  const lines = [
    "Here’s what’s in your cart:",
    "",
    ...cartItems.map((item, idx) => {
      const price = item.priceCents ? (item.priceCents / 100).toFixed(2) : item.price;
      return `${idx + 1}. ${item.name || item.title} — ₹${price} × ${item.quantity}`;
    }),
  ];
  return { ...baseReply, replyText: lines.join("\n") };
};

const buildSuggestions = (products, baseProduct) => {
  const similar = getSimilarProducts(products, baseProduct, 4);
  const cheaper = getCheaperAlternatives(products, baseProduct, 4);
  const trendingInCategory = getRelatedProducts(products, [baseProduct], 4);
  return { similar, cheaper, trending: trendingInCategory };
};

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const filterByBrandLike = (products, brandText) => {
  if (!brandText) return [];
  const b = normalize(brandText);
  return (products || []).filter((p) => {
    const blob = normalize(`${p.brand || ""} ${p.name || ""} ${p.title || ""} ${p.description || ""}`);
    return blob.includes(b);
  });
};

const pickBestRated = (arr) => {
  return [...arr].sort((a, b) => {
    const ra = a.rating?.stars || a.rating || 0;
    const rb = b.rating?.stars || b.rating || 0;
    const ca = a.rating?.count || 0;
    const cb = b.rating?.count || 0;
    const scoreA = ra * 2 + ca * 0.01;
    const scoreB = rb * 2 + cb * 0.01;
    return scoreB - scoreA;
  })[0];
};

const chooseRecommendation = (a, b) => {
  const pa = typeof a?.priceCents === "number" ? a.priceCents / 100 : a.price || 0;
  const pb = typeof b?.priceCents === "number" ? b.priceCents / 100 : b.price || 0;
  const ra = a.rating?.stars || a.rating || 0;
  const rb = b.rating?.stars || b.rating || 0;

  const scoreA = ra * 2 - pa * 0.001;
  const scoreB = rb * 2 - pb * 0.001;

  if (scoreA > scoreB) return `I’d pick ${a.name || a.title} for better value.`;
  if (scoreB > scoreA) return `I’d pick ${b.name || b.title} for better value.`;
  return "Both are close—choose based on your preferred style/brand.";
};

const buildCategorySuggestions = (products, attrs) => {
  if (!products || products.length === 0) return [];
  const rawCategories = products
    .map((p) => p.category)
    .filter(Boolean)
    .map((c) => String(c));

  const unique = Array.from(new Set(rawCategories));

  // If user already filtered by a category, prefer sub-variants (e.g. running/sports/casual)
  const currentCat = attrs?.category ? String(attrs.category).toLowerCase() : "";

  const shoeLike = /\bshoe|sneaker|trainer/i;
  if (currentCat && shoeLike.test(currentCat)) {
    const presets = [
      "Running Shoes",
      "Sneakers",
      "Sports Shoes",
      "Casual Shoes",
    ];
    return presets;
  }

  return unique.slice(0, 6);
};

