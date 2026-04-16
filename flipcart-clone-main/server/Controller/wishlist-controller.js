import { Op } from 'sequelize';
import Product from '../Model/productSchema.js';
import WishlistItem from '../Model/wishlistItemSchema.js';
import { mapProductForUi } from './helpers.js';

/**
 * Returns the "where" clause for wishlist queries.
 * - Logged-in user: use userId
 * - Guest: use sessionId
 */
const getWishlistOwnerWhere = (req) => {
  if (req.session?.user?.id) {
    return { userId: req.session.user.id };
  }
  return { sessionId: req.sessionID };
};

const getWishlistItemsForOwner = async (where) => {
  const wishlistItems = await WishlistItem.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  if (wishlistItems.length === 0) {
    return [];
  }

  const productIds = [...new Set(wishlistItems.map((item) => item.productId))];
  const products = await Product.findAll({
    where: { id: { [Op.in]: productIds } },
  });

  const productById = new Map(products.map((product) => [product.id, product]));

  return wishlistItems
    .map((item) => {
      const product = productById.get(item.productId);
      if (!product) return null;

      return {
        id: item.id,
        product_id: item.productId,
        products: mapProductForUi(product),
      };
    })
    .filter((item) => item !== null);
};

export const getWishlist = async (req, res) => {
  try {
    const where = getWishlistOwnerWhere(req);
    const items = await getWishlistItemsForOwner(where);
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const userId = req.session?.user?.id || null;
    const sessionId = req.sessionID;
    const ownerWhere = userId ? { userId } : { sessionId };

    const existingItem = await WishlistItem.findOne({
      where: { ...ownerWhere, productId },
    });

    if (existingItem) {
      await existingItem.destroy();
      return res.status(200).json({ added: false });
    }

    await WishlistItem.create({
      sessionId,
      userId,
      productId,
    });

    return res.status(200).json({ added: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Merge guest session wishlist items into the logged-in user's wishlist.
 * Called after login/signup.
 */
export const mergeGuestWishlistToUser = async (sessionId, userId) => {
  try {
    const guestItems = await WishlistItem.findAll({
      where: { sessionId, userId: null },
    });

    for (const guestItem of guestItems) {
      const existingUserItem = await WishlistItem.findOne({
        where: { userId, productId: guestItem.productId },
      });

      if (existingUserItem) {
        // Already in user's wishlist, just remove the guest duplicate
        await guestItem.destroy();
      } else {
        // Transfer ownership to the user
        guestItem.userId = userId;
        await guestItem.save();
      }
    }
  } catch (error) {
    console.error('Error merging guest wishlist:', error.message);
  }
};
