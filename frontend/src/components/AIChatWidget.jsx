import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your ShopSmart AI assistant. Ask me to help you find a product 🛍️" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/chat", { message: userMsg.text });
      setMessages((m) => [...m, { role: "assistant", text: data.reply, products: data.matchedProducts }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I ran into an issue. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-sunset-gradient shadow-glow flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="AI shopping assistant"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[28rem] glass-card flex flex-col overflow-hidden">
          <div className="p-4 bg-sunset-gradient flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">ShopSmart AI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === "user" ? "bg-brand-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {m.text}
                  {m.products?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {m.products.slice(0, 3).map((p) => (
                        <Link key={p._id} to={`/products/${p.slug}`} className="block text-brand-600 dark:text-brand-400 underline text-xs">
                          {p.name} — ${p.price}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-slate-400">Thinking...</p>}
          </div>
          <form onSubmit={send} className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a product..."
              className="input-field !py-2 text-sm"
            />
            <button type="submit" className="w-10 h-10 shrink-0 rounded-xl bg-sunset-gradient flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
