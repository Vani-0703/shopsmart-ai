import { useEffect, useState } from "react";
import { Plus, Sparkles, Trash2, Edit, X, Upload } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getProductImage } from "../../utils/productImages";

const emptyForm = {
  name: "",
  category: "",
  brand: "",
  price: "",
  discountPrice: "",
  stock: "",
  description: "",
  shortTagline: "",
  tags: [],
  images: [],
};

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/products/mine/list").then(({ data }) => {
      setProducts(data.products);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      brand: p.brand,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      description: p.description,
      shortTagline: p.shortTagline,
      tags: p.tags || [],
      images: p.images || [],
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const generateDescription = async () => {
    if (!form.name || !form.category) {
      toast.error("Enter a product name and category first");
      return;
    }
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/generate-description", {
        name: form.name,
        category: form.category,
        brand: form.brand,
        keyFeatures: form.shortTagline,
      });
      setForm((f) => ({ ...f, description: data.description, shortTagline: data.tagline, tags: data.tags }));
      toast.success("AI description generated ✨");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, images: [...f.images, ...data.images] }));
      toast.success("Images uploaded");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || 0, stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Product removed");
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="btn-gradient !py-2.5 text-sm">
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">No products yet — add your first one!</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="glass-card p-4">
              <img
                src={getProductImage(p)}
                alt={p.name}
                className="w-full aspect-video object-cover rounded-xl mb-3"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x300?text=ShopSmart+AI";
                }}
              />
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-slate-400 mb-2">{p.category} · Stock: {p.stock}</p>
              <p className="font-bold text-brand-500 mb-3">${p.price}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="btn-ghost flex-1 !py-1.5 text-xs">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="btn-ghost !py-1.5 !px-3 text-red-500 border-red-200">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setShowForm(false)} className="absolute right-4 top-4">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit product" : "New product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
                <input required type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
                <input type="number" step="0.01" placeholder="Discount price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
              </div>
              <input required type="number" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
              <input placeholder="Key features (comma separated) — used by AI" value={form.shortTagline} onChange={(e) => setForm({ ...form, shortTagline: e.target.value })} className="input-field" />

              <div className="relative">
                <textarea
                  required
                  placeholder="Product description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[120px]"
                />
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={generating}
                  className="absolute right-3 bottom-3 flex items-center gap-1 text-xs font-semibold text-white bg-sunset-gradient px-3 py-1.5 rounded-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {generating ? "Generating..." : "AI generate"}
                </button>
              </div>

              <div>
                <label className="btn-ghost inline-flex cursor-pointer text-sm">
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload images"}
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <div className="flex gap-2 mt-2">
                  {form.images.map((img, i) => (
                    <img key={i} src={img.url} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-gradient w-full">
                {saving ? "Saving..." : editingId ? "Update product" : "Create product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
