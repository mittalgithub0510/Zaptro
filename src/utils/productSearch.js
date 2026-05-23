import { fuzzySearch } from "./fuzzySearch";
import { filterProductsByAttributes } from "./productFilter";

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const searchProductsByTextAndAttributes = (
  products,
  queryText,
  attributes,
  limit = 12
) => {
  if (!products || products.length === 0) return [];

  const q = normalize(queryText || "");

  // 1) Fuzzy search by text across key fields
  let candidates = [];
  if (q) {
    candidates = fuzzySearch(
      products,
      ["name", "title", "category", "description", "brand"],
      q,
      Math.max(limit * 3, 20)
    );
  } else {
    candidates = [...products];
  }

  // 2) Filter candidates by extracted attributes (brand/category/type/color/gender/price)
  const filtered = filterProductsByAttributes(candidates, attributes);

  // If filtering is too strict and yields nothing, attempt fallback:
  if (filtered.length === 0 && q) {
    const broad = fuzzySearch(
      products,
      ["name", "title", "category", "description", "brand"],
      q,
      Math.max(limit * 3, 20)
    );
    const relaxed = filterProductsByAttributes(broad, {
      ...attributes,
      // relax non-critical constraints first
      color: attributes?.color || [],
      gender: attributes?.gender || null,
    });
    if (relaxed.length) return relaxed.slice(0, limit);
  }

  return filtered.slice(0, limit);
};

export const refineResultsByAttributes = (results, attributes, limit = 12) => {
  if (!results || results.length === 0) return [];
  const filtered = filterProductsByAttributes(results, attributes);
  return filtered.slice(0, limit);
};

// Image meta search: filename keywords become queryText; attributes are extracted elsewhere.
export const searchProductsByImageMeta = (products, imageMeta, attributes) => {
  if (!imageMeta || !imageMeta.fileName) return [];
  const text = String(imageMeta.fileName || "").replace(/\.[^.]+$/, "");
  const queryText = text.replace(/[_-]/g, " ");
  return searchProductsByTextAndAttributes(products, queryText, attributes, 12);
};

