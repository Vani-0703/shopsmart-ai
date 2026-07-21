import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, Search, Sparkles, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

const dashboardPath = { customer: "/dashboard", seller: "/seller", admin: "/admin" };

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, profile, role, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?keyword=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl border-b border-white/40 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-sunset-gradient flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">
            ShopSmart <span className="gradient-text">AI</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="input-field !py-2.5 pr-11"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-500">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/wishlist" className="hidden sm:flex w-11 h-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </Link>
          <Link to="/cart" className="relative flex w-11 h-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-pink text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-brand-400"
              >
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-sunset-gradient flex items-center justify-center text-white font-bold">
                    {profile?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-card p-2 flex flex-col gap-1">
                  <div className="px-3 py-2 text-sm">
                    <p className="font-semibold">{profile?.name}</p>
                    <p className="text-slate-500 text-xs capitalize">{role} account</p>
                  </div>
                  <Link to={dashboardPath[role] || "/dashboard"} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800 text-sm">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800 text-sm">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-sm text-red-500"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-gradient !py-2.5 !px-5 text-sm">
              Sign in
            </Link>
          )}

          <button className="md:hidden w-11 h-11 flex items-center justify-center" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field !py-2.5 pr-11"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-500">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
