import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-8xl font-display font-extrabold gradient-text mb-4">404</h1>
    <p className="text-slate-500 mb-6">This page seems to have wandered off. Let's get you back on track.</p>
    <Link to="/" className="btn-gradient">
      <Home className="w-4 h-4" /> Back home
    </Link>
  </div>
);

export default NotFound;
