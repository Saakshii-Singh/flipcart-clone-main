import express from 'express';
import { getProductById, getProducts, getCategories, getSimilarProducts } from '../Controller/product-controller.js';
import { userSignUp, userLogIn } from '../Controller/user-controller.js';
import { addItemInCart, clearCart, getCart, removeCartItem, updateCartItem } from '../Controller/cart-controller.js';
import { getOrderById, getOrders, placeOrder } from '../Controller/order-controller.js';
import { getWishlist, toggleWishlist } from '../Controller/wishlist-controller.js';
const router = express.Router();

//  Auth Routes
router.post('/signup', userSignUp);
router.post('/login', userLogIn);
router.get('/session', (req, res) => {
  res.status(200).json({ user: req.session.user || null });
});

// 🛍 Product Routes
router.get('/products', getProducts);
router.get('/products/categories', getCategories);
router.get('/products/:id', getProductById);
router.get('/products/:id/similar', getSimilarProducts);

//  Cart Routes
router.get('/cart', getCart);
router.post('/cart/items', addItemInCart);
router.put('/cart/items/:itemId', updateCartItem);
router.delete('/cart/items/:itemId', removeCartItem);
router.delete('/cart', clearCart);

//  Order Routes
router.post('/orders', placeOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);

//  Wishlist Routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/toggle', toggleWishlist);

router.get('/logout', (req, res) => {
  if (!req.session?.user) {
    return res.status(200).json({ message: 'Already logged out' });
  }

  // Remove user from session without destroying the session itself.
  // This preserves the sessionId so guest cart/wishlist data stays accessible.
  delete req.session.user;

  req.session.save((error) => {
    if (error) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});
export default router;