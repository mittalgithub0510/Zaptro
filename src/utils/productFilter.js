const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchesInBlob = (product, value) => {
  if (!value) return true;
  const v = normalize(value);
  const blob = normalize(
    `${product.brand || ""} ${product.category || ""} ${product.name || ""} ${
      product.title || ""
    } ${product.description || ""}`
  );
  return blob.includes(v);
};

const matchesGender = (product, gender) => {
  if (!gender) return true;
  const g = normalize(gender);
  const blob = normalize(
    `${product.gender || ""} ${product.name || ""} ${product.title || ""} ${
      product.description || ""
    } ${product.category || ""}`
  );
  if (g === "unisex") return blob.includes("unisex");
  if (g === "men") return /\bmen\b|\bmens\b|\bboys\b/.test(blob);
  if (g === "women") return /\bwomen\b|\bwomens\b|\bgirls\b/.test(blob);
  return blob.includes(g);
};

const matchesColor = (product, colors) => {
  if (!colors || colors.length === 0) return true;
  const blob = normalize(
    `${product.color || ""} ${product.name || ""} ${product.title || ""} ${
      product.description || ""
    } ${product.category || ""}`
  );
  return colors.some((c) => blob.includes(normalize(c)));
};

const matchesProductType = (product, productType) => {
  if (!productType) return true;
  return matchesInBlob(product, productType);
};

const getPrice = (product) => {
  if (typeof product.priceCents === "number") return product.priceCents / 100;
  if (typeof product.price === "number") return product.price;
  const n = Number(product.price);
  return Number.isFinite(n) ? n : 0;
};

const matchesPriceRange = (product, priceRange) => {
  if (!priceRange) return true;
  const price = getPrice(product);
  if (priceRange.min != null && price < priceRange.min) return false;
  if (priceRange.max != null && price > priceRange.max) return false;
  return true;
};

export const filterProductsByAttributes = (products, attributes) => {
  const attrs = attributes || {};
  return (products || []).filter((p) => {
    if (attrs.brand && !matchesInBlob(p, attrs.brand)) return false;
    if (attrs.category && !matchesInBlob(p, attrs.category)) return false;
    if (attrs.productType && !matchesProductType(p, attrs.productType))
      return false;
    if (!matchesColor(p, attrs.color)) return false;
    if (!matchesGender(p, attrs.gender)) return false;
    if (!matchesPriceRange(p, attrs.priceRange)) return false;
    return true;
  });
};

