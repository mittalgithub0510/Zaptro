import Fuse from "fuse.js";

let cachedFuse = null;
let cachedListRef = null;
let cachedKeySig = null;

export const createFuzzyIndex = (list, options) => {
  const keySig = JSON.stringify(options?.keys || []);
  if (cachedListRef === list && cachedFuse && cachedKeySig === keySig) {
    return cachedFuse;
  }
  cachedListRef = list;
  cachedKeySig = keySig;
  cachedFuse = new Fuse(list, {
    threshold: 0.38,
    distance: 120,
    minMatchCharLength: 2,
    ignoreLocation: true,
    useExtendedSearch: false,
    ...options,
  });
  return cachedFuse;
};

export const fuzzySearch = (list, keys, query, limit = 10) => {
  if (!query || !list || list.length === 0) return [];
  const fuse = createFuzzyIndex(list, { keys });
  const results = fuse.search(query, { limit });
  return results.map((r) => r.item);
};

