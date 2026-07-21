import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Truck, ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import AIRecommendations from "../components/AIRecommendations";

const perks = [
  { icon: Truck, title: "Fast delivery", desc: "Real-time order tracking on every purchase" },
  { icon: ShieldCheck, title: "Secure checkout", desc: "Stripe-powered payments, fully encrypted" },
  { icon: Sparkles, title: "AI recommendations", desc: "Personalized picks based on your taste" },
  { icon: RefreshCw, title: "Easy returns", desc: "30-day hassle-free return policy" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products?sort=popular&limit=8").then(({ data }) => {
      setFeatured(data.products);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="blob w-96 h-96 bg-brand-400 -top-20 -left-20" />
        <div className="blob w-96 h-96 bg-accent-pink top-40 right-0" />
        <div className="blob w-72 h-72 bg-accent-cyan bottom-0 left-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            Powered by Gemini AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-extrabold leading-tight mb-6"
          >
            Shop smarter with <span className="gradient-text">AI on your side</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8"
          >
            Personalized recommendations, smart search, and a beautifully simple checkout —
            everything you need for a premium shopping experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/shop" className="btn-gradient">
              Start shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register?role=seller" className="btn-ghost">
              Become a seller
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {perks.map((p) => (
            <div key={p.title} className="glass-card p-5 text-center">
              <p.icon className="w-6 h-6 mx-auto mb-2 text-brand-500" />
              <h3 className="font-semibold text-sm">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending now</h2>
          <Link to="/shop" className="text-brand-500 text-sm font-semibold flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <AIRecommendations />

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-sunset-gradient p-10 sm:p-16 text-center text-white relative overflow-hidden">
          <h2 className="text-3xl font-display font-bold mb-3">Have something to sell?</h2>
          <p className="mb-6 opacity-90 max-w-md mx-auto">
            Join ShopSmart AI as a seller and let our AI write your product descriptions for you.
          </p>
          <Link to="/register?role=seller" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-transform">
            Start selling <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
