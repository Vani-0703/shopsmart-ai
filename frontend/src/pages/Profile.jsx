import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/auth/me", { name, phone });
      await refreshProfile();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Profile settings</h1>
      <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <input value={profile?.email} disabled className="input-field opacity-60" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Account type</label>
          <input value={profile?.role} disabled className="input-field opacity-60 capitalize" />
        </div>
        <button type="submit" disabled={saving} className="btn-gradient">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
