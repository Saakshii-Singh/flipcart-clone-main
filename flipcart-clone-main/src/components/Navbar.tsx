import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Heart,
  User,
  Package,
  LogOut,
  ChevronDown,
  Store,
  Sparkles,
  Shirt,
  Smartphone,
  Laptop,
  House,
  Tv,
  Baby,
  BookOpen,
  Car,
  Gem,
  Dumbbell,
  Sofa,
  UtensilsCrossed,
  Bike,
  LogIn,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categoryItems = [
  { label: 'For You', icon: Sparkles, category: 'All' },
  { label: 'Fashion', icon: Shirt, category: 'Fashion' },
  { label: 'Mobiles', icon: Smartphone, category: 'Mobiles' },
  { label: 'Beauty', icon: Gem, category: 'Beauty' },
  { label: 'Electronics', icon: Laptop, category: 'Electronics' },
  { label: 'Home', icon: House, category: 'Home' },
  { label: 'Appliances', icon: Tv, category: 'Appliances' },
  { label: 'Toys, ba...', icon: Baby, category: 'Toys' },
  { label: 'Food & H...', icon: UtensilsCrossed, category: 'Food' },
  { label: 'Auto Acc...', icon: Car, category: 'Auto' },
  { label: '2 Wheele...', icon: Bike, category: '2 Wheeler' },
  { label: 'Sports & ...', icon: Dumbbell, category: 'Sports' },
  { label: 'Books & ...', icon: BookOpen, category: 'Books' },
  { label: 'Furniture', icon: Sofa, category: 'Furniture' },
];

export default function Navbar() {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cartItemCount } = useCart();
  const { user, signOut } = useAuth();

  const isHomePage = location.pathname === '/';
  const activeCategory = searchParams.get('category') || 'All';

  const isLoggedIn = user !== null;

  const displayUser = useMemo(() => {
    if (!user) return 'Account';
    return user.firstname || user.email?.split('@')[0] || user.username || 'Account';
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleCategory = (cat: string) => {
    if (cat === 'All') {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(cat)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Top Bar */}
      <div className="bg-white border-b border-[#e7e7e7]">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4">
          <div className="flex items-center gap-3 sm:gap-4 h-14">
            {/* Flipkart Logo */}
            <Link
              to="/"
              className="shrink-0 flex items-center"
            >
              <span className="bg-[#2874f0] text-white font-bold italic text-lg px-3 py-1 rounded-md tracking-wide">
                Flipkart
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-[564px]">
              <div className="relative">
                <Search className="w-5 h-5 text-[#2874f0] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-[38px] rounded-md border border-transparent bg-[#f0f5ff] pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:border-[#2874f0] transition-colors"
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-1 sm:gap-3 text-[#2a2a2a]">
              {/* Login Button (when not logged in) */}
              {!isLoggedIn && (
                <Link
                  to="/login"
                  id="navbar-login-btn"
                  className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-1.5 bg-white text-[#2874f0] border border-[#dbdbdb] rounded-sm hover:bg-[#f5f8ff] transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}

              {/* Account Dropdown (when logged in) */}
              {isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center gap-1.5 text-sm font-medium px-2 py-1.5 hover:bg-[#f4f5f7] rounded-md outline-none">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline max-w-[80px] truncate">{displayUser}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                      <Package className="w-4 h-4 mr-2" /> My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')} className="cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" /> Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={async () => {
                        await signOut();
                        navigate('/');
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Orders link (visible for guests) */}
              {!isLoggedIn && (
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-2 py-1.5 rounded-md hover:bg-[#f4f5f7]"
                  title="My Orders"
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden sm:inline">Orders</span>
                </Link>
              )}

              {/* Wishlist link (always visible) */}
              <Link
                to="/wishlist"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-2 py-1.5 rounded-md hover:bg-[#f4f5f7]"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="hidden sm:inline">Wishlist</span>
              </Link>

              {/* More */}
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:inline-flex items-center gap-1 text-sm font-medium px-2 py-1.5 rounded-md hover:bg-[#f4f5f7] outline-none">
                  More
                  <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <Store className="w-4 h-4 mr-2" /> Become a Seller
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-sm font-medium relative px-2 py-1.5 rounded-md hover:bg-[#f4f5f7]"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#ff6161] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 inline-flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar (Homepage Only) */}
      {isHomePage && (
        <div className="bg-white border-b border-[#ececec]">
          <div className="max-w-[1280px] mx-auto px-3 sm:px-4">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2">
              {categoryItems.map((item) => {
                const Icon = item.icon;
                const active = activeCategory === item.category;

                return (
                  <button
                    key={item.label}
                    onClick={() => handleCategory(item.category)}
                    className={`shrink-0 flex flex-col items-center gap-1 text-[11px] sm:text-xs pb-1 border-b-[2.5px] transition-all min-w-[52px] ${
                      active
                        ? 'border-[#2874f0] text-[#2874f0] font-semibold'
                        : 'border-transparent text-[#555] hover:text-[#2874f0]'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="whitespace-nowrap leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
