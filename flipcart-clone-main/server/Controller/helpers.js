/**
 * Shared helpers for mapping Product DB rows to UI-friendly objects.
 * Used by cart, order, and wishlist controllers.
 */

export const parseDiscount = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number.parseInt(String(value).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const createRatingSeed = (id) => {
  return String(id || 'product')
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

export const parseImages = (product) => {
  // Try JSON images field first, then fall back to single image
  let imgs = [];
  if (product.images) {
    try {
      imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch { /* ignore */ }
  }
  if (Array.isArray(imgs) && imgs.length > 0) return imgs;
  if (product.image) return [product.image];
  return ['/placeholder.svg'];
};

export const parseSpecs = (product) => {
  if (!product.specifications) return {};
  try {
    return typeof product.specifications === 'string'
      ? JSON.parse(product.specifications)
      : product.specifications;
  } catch {
    return {};
  }
};

export const mapProductForUi = (product) => {
  const seed = createRatingSeed(product.id);

  return {
    id: product.id,
    title: product.longTitle || product.shortTitle || 'Product',
    price: Number(product.mrp ?? product.cost ?? 0),
    discount: parseDiscount(product.discountPercent),
    images: parseImages(product),
    rating: Number((3.8 + (seed % 12) / 10).toFixed(1)),
    rating_count: 100 + ((seed * 37) % 5000),
    stock: Number(product.quantity ?? 0),
    description: product.description || 'No description available.',
    category: product.category || product.shortTitle || 'General',
    brand: product.brand || '',
    specifications: parseSpecs(product),
    extraDiscount: product.extraDiscount || '',
    tagline: product.tagline || '',
  };
};
