# Flipkart Clone — SDE Intern Fullstack Assignment

A functional e-commerce web application that closely replicates Flipkart's design and user experience. Includes product browsing, cart management, checkout, order placement, and order history — all backed by a MySQL database.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + TypeScript |
| **State/Data** | TanStack React Query |
| **Styling** | TailwindCSS + Shadcn UI |
| **Backend** | Node.js + Express.js |
| **ORM** | Sequelize |
| **Database** | MySQL |
| **Session** | express-session (cookie-based) |

## Implemented Features

### Core Features (Must Have)

#### 1. Product Listing Page ✅
- Flipkart-style product grid with responsive card layout
- Search by product name (search bar in navbar, server-side search)
- Filter by category (navbar category bar + filter pills on homepage)
- Auto-sliding hero banner carousel with navigation arrows
- "Deals of the Day" horizontal scroll section
- Category circles for quick navigation

#### 2. Product Detail Page ✅
- Image carousel with thumbnail strip and navigation arrows
- Product title, brand, description, and specifications table
- Price with discount percentage and MRP strikethrough
- Stock availability status
- "Add to Cart" button (gold) and "Buy Now" button (orange)
- Available offers section, delivery info, warranty
- Similar products carousel at the bottom

#### 3. Shopping Cart ✅
- View all items added to cart
- Update quantity with +/- controls
- Remove items from cart
- Cart summary showing MRP, discount, delivery charges, and total amount
- "You will save ₹X on this order" savings message
- Flipkart/Grocery tabs, delivery address bar

#### 4. Order Placement ✅
- Multi-step checkout with stepper UI (Login → Address → Summary → Payment)
- Shipping address form with all required fields
- Order summary review before placing order
- Place order creates Order + OrderItems records in database
- Order confirmation page with order ID, items, address, and status

### Bonus Features (Good to Have)

#### Responsive Design ✅
- Mobile, tablet, and desktop breakpoints via Tailwind responsive utilities
- Horizontal scroll carousels, collapsible layouts

#### User Authentication ✅
- Login/Signup pages with Flipkart-style split-panel design
- Session-based auth (express-session with cookie)
- Guest user mode — no login required for core flows

#### Order History ✅
- `/orders` page listing all past orders
- Search orders by product name or order ID
- Order cards with status badges, dates, and item thumbnails
- Click to view full order details

#### Wishlist ✅
- Toggle wishlist from product cards and detail page
- `/wishlist` page with grid layout
- "Move to Cart" and "Delete" actions per item

#### Email Notification ❌
- Not implemented (not a core requirement)

## Database Schema

The backend uses Sequelize ORM with `sequelize.sync({ alter: true })` for auto-migration.

### Tables

**`Users`**
| Column | Type | Notes |
|---|---|---|
| `id` | INT (PK) | Auto increment |
| `firstname` | STRING | |
| `lastname` | STRING | |
| `username` | STRING | Unique |
| `email` | STRING | Unique |
| `password` | STRING | Hashed |
| `phone` | STRING | |

**`Products`**
| Column | Type | Notes |
|---|---|---|
| `id` | STRING (PK) | e.g., `elec-001` |
| `shortTitle` | STRING | Short display name |
| `longTitle` | STRING(500) | Full product title |
| `mrp` | INTEGER | Maximum retail price |
| `cost` | INTEGER | Selling price |
| `discountPercent` | STRING | e.g., `48%` |
| `quantity` | INTEGER | Stock count |
| `description` | TEXT | Product description |
| `extraDiscount` | STRING | Offer text |
| `tagline` | STRING | Badge text (Best Seller, etc.) |
| `image` | STRING(1000) | Primary image URL |
| `images` | JSON | Array of image URLs |
| `category` | STRING | Indexed for filtering |
| `brand` | STRING | Brand name |
| `specifications` | JSON | Key-value spec pairs |

**`CartItems`**
| Column | Type | Notes |
|---|---|---|
| `id` | INT (PK) | Auto increment |
| `sessionId` | STRING | Indexed |
| `userId` | INT | Nullable, FK to Users |
| `productId` | STRING | FK to Products |
| `quantity` | INT | Item quantity |
| | | Unique: (`sessionId`, `productId`) |

**`Orders`**
| Column | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `sessionId` | STRING | Indexed |
| `userId` | INT | Nullable |
| `totalAmount` | DECIMAL | Order total |
| `status` | STRING | e.g., `confirmed` |
| `address` | JSON | Shipping address object |

**`OrderItems`**
| Column | Type | Notes |
|---|---|---|
| `id` | INT (PK) | Auto increment |
| `orderId` | UUID | Indexed, FK to Orders |
| `productId` | STRING | Indexed, FK to Products |
| `quantity` | INT | Qty ordered |
| `price` | DECIMAL | Unit price at order time |

**`WishlistItems`**
| Column | Type | Notes |
|---|---|---|
| `id` | INT (PK) | Auto increment |
| `sessionId` | STRING | Indexed |
| `userId` | INT | Nullable |
| `productId` | STRING | FK to Products |
| | | Unique: (`sessionId`, `productId`) |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Login with email/username + password |
| `GET` | `/session` | Get current session user |
| `GET` | `/logout` | Destroy session and logout |

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List products (`?search=X&category=Y`) |
| `GET` | `/products/categories` | Get distinct category list |
| `GET` | `/products/:id` | Get single product by ID |
| `GET` | `/products/:id/similar` | Get similar products (same category) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/cart` | Get cart with items |
| `POST` | `/cart/items` | Add item to cart |
| `PUT` | `/cart/items/:itemId` | Update item quantity |
| `DELETE` | `/cart/items/:itemId` | Remove item from cart |
| `DELETE` | `/cart` | Clear entire cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/orders` | Place a new order |
| `GET` | `/orders` | Get all orders for session |
| `GET` | `/orders/:id` | Get specific order details |

### Wishlist
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/wishlist` | Get wishlist items |
| `POST` | `/wishlist/toggle` | Add/remove product from wishlist |

## Setup Instructions

### Prerequisites
- **Node.js** 18+
- **MySQL** server running locally
- Create a database named `flipkart` (or it will be auto-created)

### 1. Clone & Install

```bash
git clone <repo-url>
cd flipcart-clone-main
```

### 2. Configure Backend Environment

Create `server/.env`:

```env
PORT=8000
DB_NAME=flipkart
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
CLIENT_ORIGIN=http://localhost:8080
SESSION_SECRET=replace_with_strong_secret
SESSION_COOKIE_MAX_AGE=604800000
ENABLE_PRODUCT_SEED=true
```

### 3. Configure Frontend Environment

Create `.env` in project root:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Install & Run Backend

```bash
cd server
npm install
npm run dev
```

Backend runs at `http://localhost:8000`.

### 5. Install & Run Frontend

```bash
cd ..
npm install
npm run dev
```

Frontend runs at `http://localhost:8080`.

## Sample Data

- **31 products** across **10 categories**: Electronics, Mobiles, Fashion, Home, Appliances, Beauty, Sports, Books, Toys, Furniture
- Data is in `server/Constant/data.js` and auto-seeded on startup when `ENABLE_PRODUCT_SEED=true`
- Each product has: multiple images, brand, specifications, pricing, descriptions

## Assumptions

- **No login required**: A default guest user is assumed. Cart, orders, and wishlist are session-based.
- **Authentication is optional**: Login/Signup are implemented as bonus features but not required for core flows.
- **Session-based ownership**: `express-session` cookie ties cart/orders/wishlist to the browser session.
- **Database auto-migration**: `sequelize.sync({ alter: true })` handles schema changes automatically.

## Project Structure

```
flipcart-clone-main/
├── server/                    # Backend (Express + Sequelize + MySQL)
│   ├── Connection/            # DB connection config
│   ├── Constant/              # Seed data (data.js)
│   ├── Controller/            # Route handlers
│   │   ├── cart-controller.js
│   │   ├── order-controller.js
│   │   ├── product-controller.js
│   │   ├── user-controller.js
│   │   ├── wishlist-controller.js
│   │   └── helpers.js         # Shared product mapping utilities
│   ├── Model/                 # Sequelize schema definitions
│   ├── Routes/                # API route definitions
│   ├── default.js             # Data seeder
│   └── index.js               # Server entry point
├── src/                       # Frontend (React + TypeScript)
│   ├── components/            # Navbar, Footer, ProductCard, PromoBanner
│   ├── hooks/                 # useAuth, useCart, useProducts, useWishlist
│   ├── lib/                   # API client, product mapping utilities
│   ├── pages/                 # All page components
│   │   ├── Index.tsx          # Home page
│   │   ├── ProductDetail.tsx  # Product detail
│   │   ├── Cart.tsx           # Shopping cart
│   │   ├── Checkout.tsx       # Checkout flow
│   │   ├── OrderConfirmation.tsx
│   │   ├── Orders.tsx         # Order history
│   │   ├── Wishlist.tsx       # Wishlist
│   │   ├── Login.tsx          # Login page
│   │   └── Signup.tsx         # Signup page
│   └── types/                 # TypeScript type definitions
├── .env                       # Frontend env vars
├── package.json               # Frontend dependencies
└── README.md
```
