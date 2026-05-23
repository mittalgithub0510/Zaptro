export const getTrendingProducts = (products, limit = 6) => {
  if (!products || products.length === 0) return [];
  const sorted = [...products].sort((a, b) => {
    const ra = a.rating?.stars || a.rating || 0;
    const rb = b.rating?.stars || b.rating || 0;
    const ca = a.rating?.count || 0;
    const cb = b.rating?.count || 0;
    const scoreA = ra * 2 + ca * 0.01;
    const scoreB = rb * 2 + cb * 0.01;
    return scoreB - scoreA;
  });
  return sorted.slice(0, limit);
};

export const getRelatedProducts = (products, seed, limit = 6) => {
  if (!products || !seed || seed.length === 0) return [];
  const first = seed[0];
  if (!first?.category) return [];
  return products
    .filter((p) => p.id !== first.id && p.category === first.category)
    .slice(0, limit);
};

export const getCheaperAlternatives = (products, baseProduct, limit = 6) => {
  if (!products || !baseProduct) return [];
  const basePrice = getPrice(baseProduct);
  return products
    .filter((p) => p.id !== baseProduct.id)
    .filter((p) => getPrice(p) < basePrice)
    .sort((a, b) => getPrice(a) - getPrice(b))
    .slice(0, limit);
};

export const getSimilarProducts = (products, baseProduct, limit = 6) => {
  if (!products || !baseProduct) return [];
  const baseCategory = (baseProduct.category || "").toLowerCase();
  const baseName = (baseProduct.name || baseProduct.title || "").toLowerCase();

  const scored = products
    .filter((p) => p.id !== baseProduct.id)
    .map((p) => {
      const catMatch =
        baseCategory &&
        (p.category || "").toLowerCase().includes(baseCategory)
          ? 10
          : 0;
      const nameOverlap = wordOverlapScore(
        baseName,
        (p.name || p.title || "").toLowerCase()
      );
      return { product: p, score: catMatch + nameOverlap };
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.product);
};

const getPrice = (product) => {
  if (typeof product?.priceCents === "number") return product.priceCents / 100;
  if (typeof product?.price === "number") return product.price;
  const n = Number(product?.price);
  return Number.isFinite(n) ? n : 0;
};

const wordOverlapScore = (a, b) => {
  const aw = a.split(/\s+/).filter(Boolean);
  const bw = b.split(/\s+/).filter(Boolean);
  if (!aw.length || !bw.length) return 0;
  const setB = new Set(bw);
  let count = 0;
  aw.forEach((w) => {
    if (setB.has(w)) count += 1;
  });
  return count;
};

