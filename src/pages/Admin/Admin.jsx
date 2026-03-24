import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  FaUsers, FaStore, FaBox, FaComments, FaTrashAlt, 
  FaSpinner, FaVideo, FaCheckCircle, FaTimesCircle, FaArrowRight , FaChartLine
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ buyers: 0, sellers: 0, products: 0, inquiries: 0 });
  const [activeTab, setActiveTab] = useState("buyers");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Meeting Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [meetingDetails, setMeetingDetails] = useState({ link: "", time: "" });

  useEffect(() => {
    fetchStats();
    fetchData(activeTab);
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
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

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/approve-inquiry/${id}`);
      toast.success("Enquiry Approved!");
      fetchData("inquiries");
    } catch (err) { toast.error("Approval failed"); }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex font-sans text-slate-900">
      
      {/* --- 🧊 PREMIUM SIDEBAR --- */}
      <aside className="w-72 bg-[#001D4C] m-4 rounded-[40px] shadow-2xl flex flex-col p-8 sticky h-[calc(100vh-2rem)] top-4">
        <div className="mb-12">
          <h2 className="text-white text-3xl font-black tracking-tighter italic">
            MP <span className="text-blue-400">ADMIN</span>
          </h2>
          <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full"></div>
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarLink active={activeTab === "buyers"} onClick={() => setActiveTab("buyers")} icon={<FaUsers />} label="Buyers Hub" />
          <SidebarLink active={activeTab === "sellers"} onClick={() => setActiveTab("sellers")} icon={<FaStore />} label="Sellers Hub" />
          <SidebarLink active={activeTab === "products"} onClick={() => setActiveTab("products")} icon={<FaBox />} label="Inventory" />
          <SidebarLink active={activeTab === "inquiries"} onClick={() => setActiveTab("inquiries")} icon={<FaComments />} label="Trade Inquiries" />
        </nav>

        <div className="mt-auto bg-white/10 p-5 rounded-3xl backdrop-blur-md">
          <p className="text-xs text-blue-200 font-bold uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-white">All Systems Live</p>
          </div>
        </div>
      </aside>

      {/* --- ⚡ MAIN CONTENT --- */}
      <main className="flex-1 p-8">
        
        {/* --- Header --- */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#000F29] tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 font-medium">Monitoring trade flow from Madhya Pradesh</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <FaChartLine className="text-blue-600" />
            </button>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <span className="font-bold text-sm">Super Admin</span>
            </div>
          </div>
        </header>

        {/* --- 📊 NEON STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <StatCard label="Live Buyers" value={stats.buyers} gradient="from-blue-500 to-blue-700" icon={<FaUsers />} />
          <StatCard label="Top Sellers" value={stats.sellers} gradient="from-emerald-400 to-emerald-600" icon={<FaStore />} />
          <StatCard label="Global Products" value={stats.products} gradient="from-purple-500 to-purple-700" icon={<FaBox />} />
          <StatCard label="Pending Trade" value={stats.inquiries} gradient="from-orange-400 to-orange-600" icon={<FaComments />} />
        </div>

        {/* --- 📑 DATA TABLE CARD --- */}
        <div className="bg-white rounded-[45px] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-2xl font-black text-[#001D4C] uppercase tracking-tighter">
              {activeTab} <span className="text-blue-600">Database</span>
            </h3>
            <button onClick={() => fetchData(activeTab)} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition">
              Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="p-8 text-left">Primary Details</th>
                  <th className="p-8 text-left">Contact Info</th>
                  <th className="p-8 text-left">Status/Role</th>
                  <th className="p-8 text-center">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="4" className="p-20 text-center"><FaSpinner className="animate-spin inline text-4xl text-blue-600" /></td></tr>
                ) : data.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-black text-[#001D4C] text-lg">{item.name || item.productName}</span>
                        <span className="text-xs text-slate-400 font-mono mt-1">ID: #{item._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="p-8 font-bold text-slate-600">{item.email || item.whatsapp}</td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.status || item.role || item.category}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center gap-3">
                        {activeTab === 'inquiries' && (
                          item.status === 'Approved' ? (
                            <button 
                              onClick={() => { setSelectedInquiry(item); setIsModalOpen(true); }}
                              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase flex items-center gap-2 hover:scale-105 transition active:scale-95"
                            >
                              <FaVideo /> Conduct Meeting
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleApprove(item._id)}
                              className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition"
                            >
                              <FaCheckCircle />
                            </button>
                          )
                        )}
                        <button className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- 🎥 MEETING MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><FaTimesCircle size={24} /></button>
            <h2 className="text-2xl font-black text-[#001D4C] mb-2 leading-tight">Schedule Business Call</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium italic">Invite Buyer & Seller for final discussion</p>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Google Meet Link</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none focus:ring-2 ring-blue-500 outline-none font-medium"
                  placeholder="https://meet.google.com/xxx-yyyy"
                  onChange={(e) => setMeetingDetails({...meetingDetails, link: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Meeting Timestamp</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none focus:ring-2 ring-blue-500 outline-none font-medium text-slate-600"
                  onChange={(e) => setMeetingDetails({...meetingDetails, time: e.target.value})}
                />
              </div>
              <button className="w-full bg-[#001D4C] text-white py-5 rounded-[20px] font-black uppercase tracking-widest hover:bg-blue-900 transition flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20">
                Send Direct Invites <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 translate-x-2" : "text-blue-100 hover:bg-white/5"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </button>
);

const StatCard = ({ label, value, gradient, icon }) => (
  <div className={`bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group hover:-translate-y-1 transition-all`}>
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-[80px]`}></div>
    <div className={`text-2xl mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-4xl font-black text-[#001D4C]">{value}</h4>
  </div>
);

export default AdminDashboard;