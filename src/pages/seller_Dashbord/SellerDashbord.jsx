import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, LogOut, 
  Plus, Search, Bell, TrendingUp, PackagePlus, CheckCircle, MapPin, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../../components/Header';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- NEW STATE FOR DYNAMIC PRODUCTS ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // --- FETCH PRODUCTS FROM BACKEND ---
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      // URL adjust kar lena agar port change ho
      const { data } = await axios.get('http://localhost:5000/api/sellers/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products", error);
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- IMAGE URL HELPER ---
  const getImageUrl = (path) => {
    if(!path) return '';
    // Windows path separator fix
    const cleanPath = path.replace(/\\/g, "/");
    return `http://localhost:5000/${cleanPath}`;
  };

  const addProductAlert = () => {
    Swal.fire({
      title: '<span style="font-weight: 800; color: #1e293b;">Add New Product</span>',
      html: `
        <div style="text-align: left; font-family: 'Inter', sans-serif; padding: 0 5px;">
          
          <div style="margin-bottom: 12px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">Product Name</label>
            <input id="p-name" class="swal2-input" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 10px;" placeholder="e.g. Banarasi Saree / MP Wheat">
          </div>

          <div style="display: flex; gap: 10px; margin-bottom: 12px;">
              <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">HS Code</label>
                  <input id="p-hscode" class="swal2-input" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 10px;" placeholder="e.g. 500720">
              </div>
              <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">Category</label>
                  <select id="p-category" class="swal2-input" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 0 10px; height: 46px; display: flex; align-items: center;">
                      <option value="" disabled selected>Select Category</option>
                      <option value="Sarees & Ethnic Wear">Sarees & Ethnic Wear</option>
                      <option value="Textiles & Fabrics">Textiles & Fabrics</option>
                      <option value="Apparel & Garments">Apparel & Garments</option>
                      <option value="Agriculture & Grains">Agriculture & Grains</option>
                      <option value="Spices & Condiments">Spices & Condiments</option>
                      <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                      <option value="Handicrafts & Decor">Handicrafts & Decor</option>
                      <option value="Leather & Footwear">Leather & Footwear</option>
                      <option value="Gems & Jewellery">Gems & Jewellery</option>
                      <option value="Herbal & Ayurveda">Herbal & Ayurveda</option>
                      <option value="Processed Food">Processed Food</option>
                      <option value="Engineering Goods">Engineering Goods</option>
                      <option value="Other">Other</option>
                  </select>
              </div>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">Product Image</label>
            <div onclick="document.getElementById('p-image').click()" 
                 style="cursor: pointer; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 15px; text-align: center; margin-top: 5px; background: #f8fafc; transition: all 0.2s;">
              <div id="image-placeholder">
                <p style="font-size: 11px; font-weight: 800; color: #64748b; margin: 0; text-transform: uppercase;">Click to upload image</p>
              </div>
              <img id="image-preview" style="display: none; width: 100%; max-height: 120px; object-fit: contain; border-radius: 8px; margin-top: 5px;" />
            </div>
            <input type="file" id="p-image" style="display: none;" accept="image/*" onchange="const file = this.files[0]; if(file){const reader = new FileReader(); reader.onload = (e) => {document.getElementById('image-preview').src = e.target.result; document.getElementById('image-preview').style.display = 'block'; document.getElementById('image-placeholder').style.display = 'none';}; reader.readAsDataURL(file);}">
          </div>

          <div style="margin-bottom: 5px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">Description</label>
            <textarea id="p-desc" class="swal2-textarea" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; height: 80px; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 10px; resize: none;" placeholder="Product details..."></textarea>
          </div>

        </div>
      `,
      confirmButtonText: 'List Product',
      confirmButtonColor: '#10b981',
      showCancelButton: true,
      cancelButtonColor: '#94a3b8',
      customClass: { popup: 'rounded-[1.5rem]' },
      
      preConfirm: () => {
        const name = document.getElementById('p-name').value;
        const hscode = document.getElementById('p-hscode').value;
        const category = document.getElementById('p-category').value;
        const desc = document.getElementById('p-desc').value;
        const image = document.getElementById('p-image').files[0];

        if (!name || !category) {
          Swal.showValidationMessage('Product Name and Category are required!');
          return false;
        }
        if (!image) {
          Swal.showValidationMessage('Product Image is required!');
          return false;
        }

        return { name, hscode, category, desc, image };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { name, hscode, category, desc, image } = result.value;
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('hscode', hscode);
        formData.append('category', category);
        formData.append('desc', desc);
        formData.append('product_image', image); 

        try {
          Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while we list your product.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const token = localStorage.getItem('token'); 
          
          if (!token) {
             throw new Error("You are not logged in!");
          }

          const response = await axios.post('http://localhost:5000/api/sellers/add-product', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}` 
            }
          });

          // Refresh products list after adding
          fetchProducts();

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product listed successfully!',
            confirmButtonColor: '#10b981'
          });
          
        } catch (error) {
          console.error('Error adding product:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || error.message || 'Something went wrong!',
            confirmButtonColor: '#ef4444'
          });
        }
      }
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
                { label: 'Products', value: products.length || '0', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
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

            {/* --- DYNAMIC CATALOG GRID --- */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5 p-8 md:p-12 overflow-hidden mb-12">
              <h3 className="text-xl font-black text-[#0B184A] uppercase border-l-4 border-blue-600 pl-5 mb-10">Active Listings</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                
                {/* 1. Mapped Products */}
                {!loading && products.map((product) => (
                  <div key={product._id} className="bg-white rounded-[2.5rem] p-6 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group ring-1 ring-slate-100 flex flex-col h-full">
                    
                    <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                      {product.image ? (
                        <img 
                          src={getImageUrl(product.image)} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={60} className="text-slate-200 opacity-50" />
                      )}
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Live</div>
                    </div>

                    <h4 className="font-black text-[#0B184A] uppercase text-sm tracking-wider mb-2 text-center truncate px-2">
                      {product.name}
                    </h4>
                    
                    <p className="text-slate-400 font-bold text-[10px] mb-1 text-center uppercase tracking-wider">
                      {product.category}
                    </p>

                    <p className="text-emerald-600 font-black text-[12px] mb-6 tracking-widest text-center uppercase">
                      HS: {product.hscode || 'N/A'}
                    </p>

                    <div className="flex gap-3 px-2 mt-auto">
                      <button className="flex-1 py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">Edit</button>
                      <button className="flex-1 py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">Delete</button>
                    </div>
                  </div>
                ))}

                {/* 2. Add New Product Card (Always visible at the end) */}
                <button onClick={addProductAlert} className="min-h-[350px] border-4 border-dashed border-slate-100 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all group cursor-pointer">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl text-slate-200 group-hover:text-blue-500 group-hover:scale-110 transition-all border border-slate-50">
                    <Plus size={40} />
                  </div>
                  <span className="font-black text-[11px] text-slate-400 uppercase tracking-[0.25em] group-hover:text-blue-600 text-center uppercase">Add New Product</span>
                </button>

              </div>
              
              {/* Optional: Empty State Message if no products and loading is done */}
              {!loading && products.length === 0 && (
                 <p className="text-center text-slate-400 mt-8 italic text-sm">You haven't listed any products yet. Start by clicking "Add New Product".</p>
              )}
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