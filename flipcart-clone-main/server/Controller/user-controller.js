import User from '../Model/userSchema.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { mergeGuestCartToUser } from './cart-controller.js';
import { mergeGuestWishlistToUser } from './wishlist-controller.js';
import { mergeGuestOrdersToUser } from './order-controller.js';

const toSafeUser = (user) => ({
  id: user.id,
  firstname: user.firstname,
  lastname: user.lastname,
  username: user.username,
  email: user.email,
  phone: user.phone,
});


// 🔐 LOGIN
export const userLogIn = async (req, res) => {
  try {
    const { identifier, username, email, password } = req.body;
    const normalizedIdentifier = (identifier || username || email || '').toLowerCase().trim();

    if (!normalizedIdentifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: normalizedIdentifier },
          { email: normalizedIdentifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Capture the guest session ID before setting the user
    const guestSessionId = req.sessionID;

    const safeUser = toSafeUser(user);
    req.session.user = safeUser;

    // Merge guest cart & wishlist into user's account
    await mergeGuestCartToUser(guestSessionId, safeUser.id);
    await mergeGuestWishlistToUser(guestSessionId, safeUser.id);
    await mergeGuestOrdersToUser(guestSessionId, safeUser.id);

    return res.status(200).json({
      message: `${safeUser.username} login successful`,
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📝 SIGNUP
export const userSignUp = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, phone } = req.body;
    const normalizedUsername = username?.toLowerCase().trim();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!firstname || !lastname || !normalizedUsername || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // check if user exists
    const exist = await User.findOne({
      where: {
        [Op.or]: [
          { username: normalizedUsername },
          { email: normalizedEmail },
        ],
      },
    });

    if (exist) {
      return res.status(400).json({ message: "User already exists with this username or email" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
    });

    // Capture the guest session ID before setting the user
    const guestSessionId = req.sessionID;

    const safeUser = toSafeUser(newUser);
    req.session.user = safeUser;

    // Merge any guest cart & wishlist into the new user's account
    await mergeGuestCartToUser(guestSessionId, safeUser.id);
    await mergeGuestWishlistToUser(guestSessionId, safeUser.id);
    await mergeGuestOrdersToUser(guestSessionId, safeUser.id);

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};