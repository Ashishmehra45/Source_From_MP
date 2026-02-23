import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaUsers, FaStore, FaBox, FaComments, FaTrashAlt, FaChartLine ,FaSpinner} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ buyers: 0, sellers: 0, products: 0, inquiries: 0 });
  const [activeTab, setActiveTab] = useState("buyers"); // buyers, sellers, inquiries, products
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Stats & Initial Data
  useEffect(() => {
    fetchStats();
    fetchData(activeTab);
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats"); // Backend banana padega iska
      setStats(data);
    } catch (err) { console.error(err); }
  };

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/${tab}`);
      setData(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-[#001D4C] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-black mb-10 tracking-tighter">ADMIN PANEL</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab("buyers")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "buyers" ? "bg-blue-600" : "hover:bg-white/10"}`}><FaUsers /> Buyers</button>
          <button onClick={() => setActiveTab("sellers")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "sellers" ? "bg-blue-600" : "hover:bg-white/10"}`}><FaStore /> Sellers</button>
          <button onClick={() => setActiveTab("products")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "products" ? "bg-blue-600" : "hover:bg-white/10"}`}><FaBox /> Products</button>
          <button onClick={() => setActiveTab("inquiries")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === "inquiries" ? "bg-blue-600" : "hover:bg-white/10"}`}><FaComments /> Inquiries</button>
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<FaUsers />} label="Total Buyers" value={stats.buyers} color="text-blue-500" />
          <StatCard icon={<FaStore />} label="Total Sellers" value={stats.sellers} color="text-green-500" />
          <StatCard icon={<FaBox />} label="Products" value={stats.products} color="text-purple-500" />
          <StatCard icon={<FaComments />} label="Inquiries" value={stats.inquiries} color="text-orange-500" />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-[#001D4C] uppercase tracking-wide">{activeTab} List</h3>
            <button onClick={() => fetchData(activeTab)} className="text-sm font-bold text-blue-600">Refresh</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                <tr>
                  <th className="p-4">Name/ID</th>
                  <th className="p-4">Contact/Email</th>
                  <th className="p-4">{activeTab === "inquiries" ? "Product" : "Details"}</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="4" className="text-center p-10"><FaSpinner className="animate-spin inline text-2xl" /></td></tr>
                ) : data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-[#001D4C]">{item.name || item.productName || item._id}</td>
                    <td className="p-4 text-sm text-gray-500">{item.email || item.whatsapp || "N/A"}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold">
                        {item.role || item.category || "Active"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-red-400 hover:text-red-600"><FaTrashAlt /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Stats
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-50 flex items-center gap-5">
    <div className={`text-3xl ${color} bg-gray-50 p-4 rounded-2xl`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-2xl font-black text-[#001D4C]">{value}</h4>
    </div>
  </div>
);

export default AdminDashboard;