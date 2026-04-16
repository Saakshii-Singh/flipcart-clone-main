import CartItem from '../Model/cartItemSchema.js';
import Product from '../Model/productSchema.js';
import { Op } from 'sequelize';
import { mapProductForUi } from './helpers.js';

const mapCartItemForUi = (cartItem) => {
	return {
		id: cartItem.id,
		product_id: cartItem.productId,
		quantity: cartItem.quantity,
		products: mapProductForUi(cartItem.product),
	};
};

/**
 * Returns the "where" clause for cart queries.
 * - If the user is logged in, use userId for isolation.
 * - Otherwise, fall back to sessionId for guest carts.
 */
const getCartOwnerWhere = (req) => {
	if (req.session?.user?.id) {
		return { userId: req.session.user.id };
	}
	return { sessionId: req.sessionID };
};

const getCartItemsForOwner = async (where) => {
	const cartItems = await CartItem.findAll({
		where,
		order: [['createdAt', 'DESC']],
	});

	if (cartItems.length === 0) {
		return [];
	}

	const productIds = [...new Set(cartItems.map((item) => item.productId))];
	const products = await Product.findAll({
		where: { id: { [Op.in]: productIds } },
	});

	const productById = new Map(products.map((product) => [product.id, product]));

	return cartItems
		.map((item) => {
			const product = productById.get(item.productId);
			if (!product) return null;

			return mapCartItemForUi({
				...item.toJSON(),
				product,
			});
		})
		.filter((item) => item !== null);
};

export const getCart = async (req, res) => {
	try {
		const where = getCartOwnerWhere(req);
		const items = await getCartItemsForOwner(where);

		return res.status(200).json({
			cart: { id: req.session?.user?.id || req.sessionID },
			items,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const addItemInCart = async (req, res) => {
	try {
		const { productId, quantity = 1 } = req.body;
		const requestedQuantity = Number(quantity);

		if (!productId || !Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
			return res.status(400).json({ message: 'Valid productId and quantity are required' });
		}

		const product = await Product.findByPk(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		const userId = req.session?.user?.id || null;
		const sessionId = req.sessionID;

		// Build where clause for finding existing item
		const ownerWhere = userId ? { userId } : { sessionId };

		const existingItem = await CartItem.findOne({
			where: { ...ownerWhere, productId },
		});

		if (existingItem) {
			existingItem.quantity += requestedQuantity;
			await existingItem.save();
		} else {
			await CartItem.create({
				sessionId,
				userId,
				productId,
				quantity: requestedQuantity,
			});
		}

		return getCart(req, res);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateCartItem = async (req, res) => {
	try {
		const { itemId } = req.params;
		const { quantity } = req.body;
		const nextQuantity = Number(quantity);

		if (!Number.isFinite(nextQuantity)) {
			return res.status(400).json({ message: 'Valid quantity is required' });
		}

		const ownerWhere = getCartOwnerWhere(req);

		const cartItem = await CartItem.findOne({
			where: {
				id: Number(itemId),
				...ownerWhere,
			},
		});

		if (!cartItem) {
			return res.status(404).json({ message: 'Cart item not found' });
		}

		if (nextQuantity <= 0) {
			await cartItem.destroy();
			return getCart(req, res);
		}

		cartItem.quantity = nextQuantity;
		await cartItem.save();

		return getCart(req, res);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const removeCartItem = async (req, res) => {
	try {
		const { itemId } = req.params;
		const ownerWhere = getCartOwnerWhere(req);

		const cartItem = await CartItem.findOne({
			where: {
				id: Number(itemId),
				...ownerWhere,
			},
		});

		if (!cartItem) {
			return res.status(404).json({ message: 'Cart item not found' });
		}

		await cartItem.destroy();
		return getCart(req, res);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const clearCart = async (req, res) => {
	try {
		const ownerWhere = getCartOwnerWhere(req);
		await CartItem.destroy({ where: ownerWhere });

		return res.status(200).json({
			cart: { id: req.session?.user?.id || req.sessionID },
			items: [],
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

/**
 * Merge guest session cart items into the logged-in user's cart.
 * Called after login/signup to preserve items added before authentication.
 */
export const mergeGuestCartToUser = async (sessionId, userId) => {
	try {
		const guestItems = await CartItem.findAll({
			where: { sessionId, userId: null },
		});

		for (const guestItem of guestItems) {
			const existingUserItem = await CartItem.findOne({
				where: { userId, productId: guestItem.productId },
			});

			if (existingUserItem) {
				// Merge quantities
				existingUserItem.quantity += guestItem.quantity;
				await existingUserItem.save();
				await guestItem.destroy();
			} else {
				// Transfer ownership to the user
				guestItem.userId = userId;
				await guestItem.save();
			}
		}
	} catch (error) {
		console.error('Error merging guest cart:', error.message);
	}
};