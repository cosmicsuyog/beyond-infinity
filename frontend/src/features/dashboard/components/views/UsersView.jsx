import { useState, useEffect } from "react";
import { 
  Users, Search, Filter, Plus, MoreVertical, Shield, 
  Mail, Clock, CheckCircle, XCircle, Trash2, Edit2, Loader2
} from "lucide-react";
import PageHeader from "../ui/PageHeader";
import GhostBtn from "../ui/GhostBtn";
import Badge from "../ui/Badge";
import { userService } from "../../service/user.service";

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.data.users || response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await userService.updateUser(userId, { role: newRole });
      if (response.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        const response = await userService.deleteUser(userId);
        if (response.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-5 fade-in">
      <PageHeader 
        title="USER MANAGEMENT" 
        subtitle="Manage organization members, roles, and access permissions"
      >
        <GhostBtn onClick={fetchUsers}>
          <Loader2 size={12} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          REFRESH
        </GhostBtn>
        <button className="bg-white text-black px-4 py-2 rounded font-bebas text-[14px] tracking-[0.1em] hover:bg-white/90 transition flex items-center gap-2">
          <Plus size={14} /> INVITE USER
        </button>
      </PageHeader>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-md pl-10 pr-4 py-2 font-barlow text-[11px] text-white focus:outline-none focus:border-white/20 transition"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 font-barlow text-[11px] text-white/60 focus:outline-none"
          >
            <option value="all">ALL ROLES</option>
            <option value="admin">ADMIN</option>
            <option value="employee">EMPLOYEE</option>
            <option value="manager">MANAGER</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.01]">
                <th className="px-5 py-4 font-bebas text-[12px] tracking-[0.2em] text-white/40 uppercase">User</th>
                <th className="px-5 py-4 font-bebas text-[12px] tracking-[0.2em] text-white/40 uppercase">Role</th>
                <th className="px-5 py-4 font-bebas text-[12px] tracking-[0.2em] text-white/40 uppercase">Status</th>
                <th className="px-5 py-4 font-bebas text-[12px] tracking-[0.2em] text-white/40 uppercase">Last Active</th>
                <th className="px-5 py-4 font-bebas text-[12px] tracking-[0.2em] text-white/40 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-5 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/[0.05]" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-white/[0.05] rounded" />
                          <div className="h-2 w-24 bg-white/[0.03] rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-[12px] font-semibold text-white overflow-hidden">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            (u.name || u.email).substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-barlow text-[12px] text-white font-medium uppercase tracking-wide">
                            {u.name || "Unnamed User"}
                          </div>
                          <div className="font-barlow text-[10px] text-white/30 lowercase">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Shield size={12} className={u.role === 'admin' ? "text-red-400" : "text-white/30"} />
                        <span className={`font-barlow text-[11px] uppercase tracking-wider ${u.role === 'admin' ? "text-red-400" : "text-white/60"}`}>
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge 
                        variant={u.isActive !== false ? "success" : "neutral"}
                        className="text-[9px] px-2 py-0.5"
                      >
                        {u.isActive !== false ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-barlow text-[11px] text-white/40">
                        <Clock size={12} />
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white/[0.08] rounded-md transition text-white/40 hover:text-white" title="Edit User">
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 hover:bg-red-500/10 rounded-md transition text-white/40 hover:text-red-400" 
                          title="Deactivate User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-20 text-center">
                    <Users size={40} className="mx-auto text-white/10 mb-4" />
                    <div className="font-bebas text-[18px] text-white/30 tracking-widest uppercase">No users found</div>
                    <p className="font-barlow text-[11px] text-white/20 uppercase mt-1 tracking-wider">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersView;
