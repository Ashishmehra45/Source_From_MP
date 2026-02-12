import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, LogOut, 
  Plus, Search, Bell, TrendingUp, PackagePlus, CheckCircle, MapPin, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../../components/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'products', icon: Package, label: 'My Products' },
    { id: 'orders', icon: ShoppingCart, label: 'Inquiries' },
    { id: 'settings', icon: Settings, label: 'Account' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const addProductAlert = () => {
    Swal.fire({
      title: 'Add New Product',
      html: `
      <div style="text-align: left; font-family: 'Inter', sans-serif; padding: 0 10px;">
          <div style="margin-bottom: 15px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#545454; letter-spacing: 0.1em;">Product Name</label>
            <input id="p-name" class="swal2-input" style="border-radius: 15px; font-size: 14px; font-weight: 700; width: 100%; margin: 8px 0; border: 2px solid #f1f5f9; box-shadow: none;" placeholder="e.g. MP Sharbati Wheat">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#545454; letter-spacing: 0.1em;">Product Image</label>
            <div onclick="document.getElementById('p-image').click()" 
                 style="cursor: pointer; border: 2px dashed #e2e8f0; border-radius: 15px; padding: 20px; text-align: center; margin-top: 8px; background: #f8fafc;">
              <div id="image-placeholder">
                <p style="font-size: 11px; font-weight: 800; color: #64748b; margin: 0; text-transform: uppercase;">Click to upload image</p>
              </div>
              <img id="image-preview" style="display: none; width: 100%; max-height: 150px; object-fit: contain; border-radius: 10px;" />
            </div>
            <input type="file" id="p-image" style="display: none;" accept="image/*">
          </div>
          <div style="margin-bottom: 5px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#545454; letter-spacing: 0.1em;">Product Description</label>
            <textarea id="p-desc" class="swal2-textarea" style="border-radius: 15px; font-size: 14px; font-weight: 700; width: 100%; height: 100px; margin: 8px 0; border: 2px solid #f1f5f9; box-shadow: none;" placeholder="Describe your product..."></textarea>
          </div>
        </div>
      `,
      confirmButtonText: 'List Product',
      confirmButtonColor: '#10b981',
      showCancelButton: true,
      customClass: { popup: 'rounded-[2rem]' }
    });
  };

  return (
    <div className="bg-[#F8FAFC] h-screen font-sans flex flex-col overflow-hidden">
      
      {/* --- STICKY HEADER --- */}
      <div className="flex-none bg-white border-b border-slate-100 shadow-sm z-[100]">
        <Header />
      </div>

      {/* --- MAIN LAYOUT WRAPPER --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- FIXED SIDEBAR --- */}
        <aside className="w-76 bg-[#041147] text-white hidden lg:flex flex-col border-r border-blue-900/20 shadow-2xl shrink-0">
          <div className="h-full flex flex-col w-full">
            <nav className="flex-1 p-6 space-y-3 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-xl translate-x-2' 
                      : 'text-slate-400 hover:bg-blue-900/30 hover:text-white'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-blue-900/50 mb-4">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-4 px-5 py-4 text-red-400 font-black text-[11px] uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* --- SCROLLABLE CONTENT --- */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 bg-[#F8FAFC] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Branding Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
              <div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
                  <MapPin size={14} className="text-blue-600" />
                  <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Official Trade Portal of MP</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-[#0B184A] tracking-tighter uppercase leading-none">
                  Seller <span className="text-blue-600">Dashboard</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-2 italic">Source From MP Global Network</p>
              </div>

              <button 
                onClick={addProductAlert}
                className="w-full sm:w-auto bg-[#10b981] text-white px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all active:scale-95 group"
              >
                <PackagePlus size={20} className="group-hover:rotate-12 transition-transform" /> List New Product
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                { label: 'Products', value: '12', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Inquiries', value: '48', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Reach', value: '14+', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 flex items-center gap-6 group hover:shadow-2xl transition-all">
                  <div className={`w-16 h-16 md:w-20 md:h-20 ${stat.bg} ${stat.color} rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}><stat.icon size={32} /></div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-1">{stat.label}</p>
                    <p className="text-3xl md:text-4xl font-black text-[#0B184A] tracking-tighter">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Catalog Grid */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5 p-8 md:p-12 overflow-hidden mb-12">
              <h3 className="text-xl font-black text-[#0B184A] uppercase border-l-4 border-blue-600 pl-5 mb-10">Active Listings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group ring-1 ring-slate-100">
                  <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center relative overflow-hidden">
                    <Package size={60} className="text-slate-200 opacity-50" />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Live</div>
                  </div>
                  <h4 className="font-black text-[#0B184A] uppercase text-sm tracking-wider mb-2 text-center">MP Sharbati Wheat</h4>
                  <p className="text-emerald-600 font-black text-[12px] mb-6 tracking-widest text-center uppercase">₹3,200 / QUINTAL</p>
                  <div className="flex gap-3 px-2">
                    <button className="flex-1 py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">Edit</button>
                    <button className="flex-1 py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">Delete</button>
                  </div>
                </div>

                <button onClick={addProductAlert} className="min-h-[300px] border-4 border-dashed border-slate-100 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl text-slate-200 group-hover:text-blue-500 group-hover:scale-110 transition-all border border-slate-50">
                    <Plus size={40} />
                  </div>
                  <span className="font-black text-[11px] text-slate-400 uppercase tracking-[0.25em] group-hover:text-blue-600 text-center uppercase">Add New Product</span>
                </button>
              </div>
            </div>

            {/* Seller Portal Footer */}
            <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 pb-8">
               Seller Portal • Source From MP • 2026
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;