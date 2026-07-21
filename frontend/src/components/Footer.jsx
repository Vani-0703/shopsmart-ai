import { Link } from "react-router-dom";
import { Sparkles, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="mt-24 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-sunset-gradient flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold">ShopSmart AI</span>
        </div>
        <p className="text-sm text-slate-500 max-w-xs">
          A premium AI-powered shopping experience — personalized recommendations, smart search, and
          seamless checkout, all in one place.
        </p>
        <div className="flex gap-3 mt-4">
          {[Facebook, Twitter, Instagram].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-brand-50 dark:hover:bg-slate-800"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm">Shop</h4>
        <ul className="space-y-2 text-sm text-slate-500">
          <li><Link to="/shop">All products</Link></li>
          <li><Link to="/shop?sort=newest">New arrivals</Link></li>
          <li><Link to="/shop?sort=popular">Best sellers</Link></li>
          <li><Link to="/wishlist">Wishlist</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm">Account</h4>
        <ul className="space-y-2 text-sm text-slate-500">
          <li><Link to="/dashboard">My orders</Link></li>
          <li><Link to="/seller">Sell on ShopSmart</Link></li>
          <li><Link to="/login">Sign in</Link></li>
        </ul>
      </div>
    </div>
    <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-200 dark:border-slate-800">
      © {new Date().getFullYear()} ShopSmart AI. Built for demo purposes — Stripe is in test mode.
    </div>
  </footer>
);

export default Footer;
