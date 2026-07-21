import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Store, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(searchParams.get("role") === "seller" ? "seller" : "customer");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password, role });
      navigate(role === "seller" ? "/seller" : "/");
    } catch (err) {
      toast.error(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden py-10">
      <div className="blob w-96 h-96 bg-accent-cyan -top-20 -right-20" />
      <div className="blob w-96 h-96 bg-brand-400 bottom-0 -left-20" />

      <div className="relative glass-card w-full max-w-md p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-sunset-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl">ShopSmart AI</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Join thousands shopping smarter with AI</p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-sm font-medium ${
              role === "customer" ? "border-brand-500 bg-brand-50 dark:bg-brand-950" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <ShoppingBag className="w-5 h-5" /> Shop
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-sm font-medium ${
              role === "seller" ? "border-brand-500 bg-brand-50 dark:bg-brand-950" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <Store className="w-5 h-5" /> Sell
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-11" />
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" required minLength={6} placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-11" />
          </div>
          <button type="submit" disabled={loading} className="btn-gradient w-full">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
