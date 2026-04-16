import { Op, or } from 'sequelize';
import CartItem from '../Model/cartItemSchema.js';
import Order from '../Model/orderSchema.js';
import OrderItem from '../Model/orderItemSchema.js';
import Product from '../Model/productSchema.js';
import { mapProductForUi, parseDiscount } from './helpers.js';

const mapOrderForUi = (order, orderItems, productById) => {
  const address = order.address && typeof order.address === 'object'
    ? order.address
    : {};

  return {
    id: order.id,
    user_id: order.userId,
    session_id: order.sessionId,
    total_amount: Number(order.totalAmount),
    status: order.status,
    created_at: order.createdAt,
    address,
    order_items: orderItems.map((item) => {
      const product = productById.get(item.productId);
      const mappedProduct = product ? mapProductForUi(product) : null;

      return {
        id: String(item.id),
        product_id: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        products: {
          id: item.productId,
          title: mappedProduct?.title || 'Product',
          images: mappedProduct?.images || ['/placeholder.svg'],
        },
      };
    }),
  };
};

const fetchOrderForUi = async (order) => {
  const orderItems = await OrderItem.findAll({
    where: { orderId: order.id },
    order: [['createdAt', 'ASC']],
  });

  const productIds = [...new Set(orderItems.map((item) => item.productId))];
  const products = productIds.length
    ? await Product.findAll({ where: { id: { [Op.in]: productIds } } })
    : [];

  const productById = new Map(products.map((product) => [product.id, product]));

  return mapOrderForUi(order, orderItems, productById);
};

const validateAddress = (address) => {
  if (!address || typeof address !== 'object') return false;

  const requiredFields = ['name', 'phone', 'pincode', 'address', 'city', 'state'];
  return requiredFields.every((field) => {
    const value = address[field];
    return typeof value === 'string' && value.trim().length > 0;
  });
};

/**
 * Returns the "where" clause for order queries.
 * - Logged-in user: find orders by userId OR orders placed as guest in this session
 * - Guest: use sessionId
 */
const getOrderOwnerWhere = (req) => {
  if (req.session?.user?.id) {
    return {
      [Op.or]: [
        { userId: req.session.user.id },
        { sessionId: req.sessionID, userId: null },
      ],
    };
  }
  return { sessionId: req.sessionID };
};

/**
 * Returns the "where" clause for cart queries (needed for placeOrder).
 */
const getCartOwnerWhere = (req) => {
  if (req.session?.user?.id) {
    return { userId: req.session.user.id };
  }
  return { sessionId: req.sessionID };
};

export const placeOrder = async (req, res) => {
  try {
    const { address } = req.body;

    if (!validateAddress(address)) {
      return res.status(400).json({ message: 'Please provide a valid shipping address' });
    }

    const sessionId = req.sessionID;
    const userId = req.session?.user?.id || null;
    const cartWhere = getCartOwnerWhere(req);

    const cartItems = await CartItem.findAll({
      where: cartWhere,
      order: [['createdAt', 'ASC']],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const productIds = [...new Set(cartItems.map((item) => item.productId))];
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
    });

    const productById = new Map(products.map((product) => [product.id, product]));

    let totalAmount = 0;
    const orderItemsPayload = [];

    for (const cartItem of cartItems) {
      const product = productById.get(cartItem.productId);
      if (!product) {
        continue;
      }

      const price = Number(product.mrp ?? product.cost ?? 0);
      const discount = parseDiscount(product.discountPercent);
      const finalPrice = Math.round(price * (1 - discount / 100));

      totalAmount += finalPrice * cartItem.quantity;
      orderItemsPayload.push({
        orderId: '',
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: finalPrice,
      });
    }

    if (orderItemsPayload.length === 0) {
      return res.status(400).json({ message: 'No valid products found in cart' });
    }

    const order = await Order.create({
      sessionId,
      userId,
      totalAmount,
      status: 'confirmed',
      address,
    });

    await OrderItem.bulkCreate(
      orderItemsPayload.map((item) => ({
        ...item,
        orderId: order.id,
      }))
    );

    // Clear cart using the same owner where clause
    await CartItem.destroy({ where: cartWhere });

    const responseOrder = await fetchOrderForUi(order);

    return res.status(201).json({
      message: 'Order placed successfully',
      order: responseOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const ownerWhere = getOrderOwnerWhere(req);

    const orders = await Order.findAll({
      where: ownerWhere,
      order: [['createdAt', 'DESC']],
    });

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    const orderIds = orders.map((order) => order.id);
    const orderItems = await OrderItem.findAll({
      where: { orderId: { [Op.in]: orderIds } },
      order: [['createdAt', 'ASC']],
    });

    const productIds = [...new Set(orderItems.map((item) => item.productId))];
    const products = productIds.length
      ? await Product.findAll({ where: { id: { [Op.in]: productIds } } })
      : [];

    const productById = new Map(products.map((product) => [product.id, product]));

    const orderItemsByOrderId = new Map();
    for (const item of orderItems) {
      const list = orderItemsByOrderId.get(item.orderId) || [];
      list.push(item);
      orderItemsByOrderId.set(item.orderId, list);
    }

    const response = orders.map((order) => {
      return mapOrderForUi(order, orderItemsByOrderId.get(order.id) || [], productById);
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerWhere = getOrderOwnerWhere(req);

    const order = await Order.findOne({
      where: { id, ...ownerWhere },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const responseOrder = await fetchOrderForUi(order);
    return res.status(200).json(responseOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Merge guest session orders into the logged-in user's account.
 * Called after login/signup to preserve orders placed before authentication.
 */
export const mergeGuestOrdersToUser = async (sessionId, userId) => {
  try {
    await Order.update(
      { userId },
      { where: { sessionId, userId: null } }
    );
  } catch (error) {
    console.error('Error merging guest orders:', error.message);
  }
};
