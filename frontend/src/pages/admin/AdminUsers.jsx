import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/admin/users").then(({ data }) => {
      setUsers(data.users);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const updateUser = async (id, updates) => {
    try {
      await api.put(`/admin/users/${id}`, updates);
      toast.success("User updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-400">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800">
              <td className="p-4 font-medium">{u.name}</td>
              <td className="p-4 text-slate-500">{u.email}</td>
              <td className="p-4 capitalize">{u.role}</td>
              <td className="p-4">
                <span className={`badge ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {u.isActive ? "Active" : "Suspended"}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <select
                  value={u.role}
                  onChange={(e) => updateUser(u._id, { role: e.target.value })}
                  className="input-field !py-1.5 !w-auto text-xs"
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => updateUser(u._id, { isActive: !u.isActive })}
                  className="btn-ghost !py-1.5 !px-3 text-xs"
                >
                  {u.isActive ? "Suspend" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
