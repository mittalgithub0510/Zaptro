const COLOR_WORDS = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "grey",
  "gray",
  "orange",
  "brown",
  "silver",
  "gold",
  "beige",
  "cream",
  "navy",
  "maroon",
];

const GENDER_ALIASES = [
  { match: /\bmen\b|\bmens\b|\bman\b|\bboys\b/i, value: "men" },
  { match: /\bwomen\b|\bwomens\b|\bwoman\b|\bgirls\b/i, value: "women" },
  { match: /\bunisex\b/i, value: "unisex" },
];

// Common product-type keywords (kept broad; actual filtering uses product fields)
const PRODUCT_TYPES = [
  "shoes",
  "sneakers",
  "running shoes",
  "headphones",
  "earbuds",
  "tshirt",
  "t-shirt",
  "shirt",
  "hoodie",
  "jacket",
  "watch",
  "smartwatch",
  "bag",
  "backpack",
  "laptop",
  "phone",
  "mobile",
  "camera",
  "perfume",
  "sunglasses",
];

const STOPWORDS = new Set([
  "show",
  "me",
  "the",
  "a",
  "an",
  "best",
  "cheap",
  "cheapest",
  "trending",
  "popular",
  "products",
  "product",
  "for",
  "under",
  "below",
  "less",
  "than",
  "between",
  "to",
  "and",
  "only",
  "just",
  "ones",
  "with",
  "without",
  "in",
  "on",
  "of",
  "compare",
  "vs",
  "add",
  "cart",
  "remove",
]);

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

const parsePriceRange = (text) => {
  // Supports:
  // - "under 2000", "below 2k", "less than 1500"
  // - "between 1000 and 2000"
  // - "1000 to 2000"
  // - "₹2000"
  const t = text;
  const kToNum = (n, suffix) => {
    const base = Number(n);
    if (!Number.isFinite(base)) return null;
    if (!suffix) return base;
    if (suffix.toLowerCase() === "k") return base * 1000;
    return base;
  };

  const between =
    t.match(/\bbetween\s+(\d+(?:\.\d+)?)\s*(k?)\s+and\s+(\d+(?:\.\d+)?)\s*(k?)\b/i) ||
    t.match(/\b(\d+(?:\.\d+)?)\s*(k?)\s+to\s+(\d+(?:\.\d+)?)\s*(k?)\b/i);
  if (between) {
    const min = kToNum(between[1], between[2]);
    const max = kToNum(between[3], between[4]);
    if (min != null && max != null) {
      return { min: Math.min(min, max), max: Math.max(min, max) };
    }
  }

  const under = t.match(/\b(under|below|less than)\s+(\d+(?:\.\d+)?)\s*(k?)\b/i);
  if (under) {
    const max = kToNum(under[2], under[3]);
    if (max != null) return { min: null, max };
  }

  const atMost = t.match(/\b(max|upto|up to)\s+(\d+(?:\.\d+)?)\s*(k?)\b/i);
  if (atMost) {
    const max = kToNum(atMost[2], atMost[3]);
    if (max != null) return { min: null, max };
  }

  const currency = t.match(/[₹$]\s*(\d+(?:\.\d+)?)\s*(k?)\b/i);
  if (currency) {
    const value = kToNum(currency[1], currency[2]);
    if (value != null) return { min: null, max: value };
  }

  return { min: null, max: null };
};

const detectGender = (text) => {
  for (const g of GENDER_ALIASES) {
    if (g.match.test(text)) return g.value;
  }
  return null;
};

const detectColors = (text) => {
  const t = normalize(text);
  const found = COLOR_WORDS.filter((c) => new RegExp(`\\b${c}\\b`, "i").test(t));
  return uniq(found);
};

const detectProductTypes = (text) => {
  const t = normalize(text);
  const found = PRODUCT_TYPES
    .filter((pt) => new RegExp(`\\b${escapeRegex(pt)}\\b`, "i").test(t))
    .sort((a, b) => b.length - a.length);
  return uniq(found);
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Build taxonomy (brands/categories) from product dataset at runtime.
export const buildProductTaxonomy = (products) => {
  const brands = new Set();
  const categories = new Set();
  const typeHints = new Set();

  (products || []).forEach((p) => {
    if (p.brand) brands.add(String(p.brand));
    if (p.category) categories.add(String(p.category));

    const nameBlob = `${p.name || ""} ${p.title || ""} ${p.description || ""}`;
    const t = normalize(nameBlob);
    detectProductTypes(t).forEach((pt) => typeHints.add(pt));
  });

  // Add frequent word-like candidates from product names as "brand-like" tokens:
  // We keep this conservative: only tokens appearing across many items will be used later if needed.
  const tokenCounts = new Map();
  (products || []).forEach((p) => {
    const name = normalize(p.name || p.title || "");
    name.split(" ").forEach((tok) => {
      if (!tok || tok.length < 3) return;
      if (STOPWORDS.has(tok)) return;
      tokenCounts.set(tok, (tokenCounts.get(tok) || 0) + 1);
    });
  });
  // Take top repeating tokens as potential brand/type hints
  const repeatingTokens = Array.from(tokenCounts.entries())
    .filter(([, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([tok]) => tok);

  return {
    brands: uniq(Array.from(brands)).sort((a, b) => a.localeCompare(b)),
    categories: uniq(Array.from(categories)).sort((a, b) => a.localeCompare(b)),
    productTypes: uniq([...PRODUCT_TYPES, ...Array.from(typeHints)]),
    repeatingTokens,
  };
};

const detectFromVocabulary = (text, vocab) => {
  const t = normalize(text);
  const hits = [];
  (vocab || []).forEach((term) => {
    const termNorm = normalize(term);
    if (!termNorm) return;
    // For multiword terms, check substring with word boundaries on ends
    const re = new RegExp(`\\b${escapeRegex(termNorm)}\\b`, "i");
    if (re.test(t)) hits.push(term);
  });
  // Prefer longer matches first
  hits.sort((a, b) => b.length - a.length);
  return uniq(hits);
};

// Primary exported parser.
// Returns normalized attributes to be used downstream for filtering.
export const parseIntentWithTaxonomy = (text, previousContext, taxonomy) => {
  const raw = String(text || "").trim();
  const lower = raw.toLowerCase();

  // Detect base intents (cart/compare/trending) similarly to earlier parser
  if (lower.startsWith("compare ")) {
    const parts = lower.replace("compare ", "").split(" vs ");
    if (parts.length === 2) {
      return {
        type: "COMPARE_PRODUCTS",
        raw,
        brands: parts.map((p) => p.trim()).filter(Boolean),
        attributes: extractAttributes(raw, taxonomy),
      };
    }
  }

  if (lower.includes("add") && lower.includes("cart")) {
    return { type: "ADD_TO_CART_FROM_RESULTS", raw, attributes: extractAttributes(raw, taxonomy) };
  }
  if (lower.includes("remove") && lower.includes("cart")) {
    return { type: "REMOVE_FROM_CART", raw, attributes: extractAttributes(raw, taxonomy) };
  }
  if (lower.includes("clear cart") || lower.includes("empty cart")) {
    return { type: "CLEAR_CART", raw, attributes: extractAttributes(raw, taxonomy) };
  }
  if (lower.includes("show my cart") || lower.includes("show cart")) {
    return { type: "SHOW_CART", raw, attributes: extractAttributes(raw, taxonomy) };
  }
  if (lower.includes("trending") || lower.includes("popular")) {
    return { type: "TRENDING", raw, attributes: extractAttributes(raw, taxonomy) };
  }

  // Refinement intent if we have prior search context
  if (
    previousContext &&
    previousContext.lastSearch &&
    (lower.startsWith("only ") ||
      lower.startsWith("just ") ||
      lower.includes("ones") ||
      /cheaper|more expensive|higher rated|better/i.test(raw))
  ) {
    return {
      type: "REFINE_SEARCH",
      raw,
      refinement: extractAttributes(raw, taxonomy),
    };
  }

  // Default search
  const attributes = extractAttributes(raw, taxonomy);
  return {
    type: "SEARCH_PRODUCTS",
    raw,
    queryText: raw,
    attributes,
  };
};

export const extractAttributes = (text, taxonomy) => {
  const raw = String(text || "");
  const norm = normalize(raw);

  const priceRange = parsePriceRange(raw);
  const gender = detectGender(raw);
  const color = detectColors(raw);
  const productType = detectProductTypes(raw);

  const brands = detectFromVocabulary(raw, taxonomy?.brands || []);
  const categories = detectFromVocabulary(raw, taxonomy?.categories || []);

  // If no explicit brand detected but query includes a repeating token, treat it as a "brand hint"
  let brandHint = null;
  if (!brands.length && taxonomy?.repeatingTokens?.length) {
    const tokens = norm.split(" ").filter(Boolean);
    for (const tok of tokens) {
      if (taxonomy.repeatingTokens.includes(tok)) {
        brandHint = tok;
        break;
      }
    }
  }

  return {
    brand: brands.length ? brands[0] : brandHint,
    category: categories.length ? categories[0] : null,
    productType: productType.length ? productType[0] : null,
    color,
    priceRange,
    gender,
  };
};

