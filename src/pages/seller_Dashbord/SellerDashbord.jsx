import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  TrendingUp,
  PackagePlus,
  CheckCircle,
  MapPin,
  Menu,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import axios from "axios";
import Footer from "../../components/Footer";
import api from "../../api/axios"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Consistent key name for Seller
  const sellerName = localStorage.getItem("companyName") || "Valued Exporter";

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "products", icon: Package, label: "My Products" },
    { id: "orders", icon: ShoppingCart, label: "Inquiries" },
    { id: "settings", icon: Settings, label: "Account" },
  ];

  // ✅ UPDATED LOGOUT: Sirf Seller ka data clear karega
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will need to login again to access your dashboard.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Sirf Seller ki keys delete kar rahe hain
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("companyName"); 
        
        Swal.fire({
          title: "Logged Out!",
          text: "See you soon.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/seller/login", { replace: true });
        }, 1500);
      }
    });
  };
  

  const fetchProducts = async () => {
    try {
      // ✅ FIX: Use 'sellerToken'
      const token = localStorage.getItem("sellerToken");
      
      if (!token) {
        navigate("/seller/login", { replace: true });
        return;
      }

      const { data } = await api.get("/sellers/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setProducts(data.products);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching products", error);
      setLoading(false);

      // ✅ FIX: Unauthorized ya Forbidden error par clean redirect
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("sellerToken"); 
        localStorage.removeItem("companyName");
        navigate("/seller/login", { replace: true }); 
      }
    }
  };

  useEffect(() => {
    // ✅ FIX: Initial Security Check
    const token = localStorage.getItem("sellerToken");
    if (!token) {
        navigate("/seller/login", { replace: true });
    } else {
        fetchProducts();
    }
  }, []);

  // --- DELETE LOGIC ---
  const handleDeleteProduct = async (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("sellerToken"); // ✅ Use sellerToken
          await api.delete(`/sellers/delete-product/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          fetchProducts(); 

          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };

  // --- EDIT LOGIC ---
  const handleEditProduct = (product) => {
    Swal.fire({
      title:
        '<span style="font-weight: 800; color: #1e293b;">Edit Product</span>',
      html: `
        <div style="text-align: left; font-family: 'Inter', sans-serif; padding: 0 5px;">
          <div style="margin-bottom: 12px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">Product Name</label>
            <input id="p-name" value="${product.name}" class="swal2-input" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 10px;">
          </div>
          <div style="display: flex; gap: 10px; margin-bottom: 12px;">
              <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">HS Code</label>
                  <input id="p-hscode" value="${product.hscode || ""}" class="swal2-input" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 10px;">
              </div>
              <div style="flex: 1;">
                  <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">Category</label>
                  <select id="p-category" class="swal2-input" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 0 10px; height: 46px; display: flex; align-items: center;">
                      <option value="${product.category}" selected>${product.category}</option>
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
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">New Image (Optional)</label>
            <input type="file" id="p-image" class="swal2-file" style="margin-top:5px; width: 100%; font-size: 12px;">
          </div>
          <div style="margin-bottom: 5px;">
            <label style="font-size: 10px; font-weight: 900; text-transform: uppercase; color:#64748b; letter-spacing: 0.1em; margin-left: 4px;">Description</label>
            <textarea id="p-desc" class="swal2-textarea" style="border-radius: 12px; font-size: 14px; font-weight: 600; width: 100%; height: 80px; margin: 5px 0 0 0; border: 2px solid #e2e8f0; box-shadow: none; padding: 10px; resize: none;">${product.desc || ""}</textarea>
          </div>
        </div>
      `,
      confirmButtonText: "Update Product",
      confirmButtonColor: "#3b82f6",
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById("p-name").value;
        const hscode = document.getElementById("p-hscode").value;
        const category = document.getElementById("p-category").value;
        const desc = document.getElementById("p-desc").value;
        const image = document.getElementById("p-image").files[0];
        return { name, hscode, category, desc, image };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { name, hscode, category, desc, image } = result.value;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("hscode", hscode);
        formData.append("category", category);
        formData.append("desc", desc);
        if (image) formData.append("image", image);

        try {
          const token = localStorage.getItem("sellerToken"); // ✅ Use sellerToken
          await api.put(`/sellers/update-product/${product._id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          fetchProducts();
          Swal.fire("Success", "Product updated!", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to update product", "error");
        }
      }
    });
  };

  const addProductAlert = () => {
    Swal.fire({
      title:
        '<span style="font-weight: 800; color: #1e293b;">Add New Product</span>',
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
      confirmButtonText: "List Product",
      confirmButtonColor: "#10b981",
      showCancelButton: true,
      cancelButtonColor: "#94a3b8",
      customClass: { popup: "rounded-[1.5rem]" },

      preConfirm: () => {
        const name = document.getElementById("p-name").value;
        const hscode = document.getElementById("p-hscode").value;
        const category = document.getElementById("p-category").value;
        const desc = document.getElementById("p-desc").value;
        const image = document.getElementById("p-image").files[0];

        if (!name || !category) {
          Swal.showValidationMessage("Product Name and Category are required!");
          return false;
        }
        if (!image) {
          Swal.showValidationMessage("Product Image is required!");
          return false;
        }

        return { name, hscode, category, desc, image };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { name, hscode, category, desc, image } = result.value;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("hscode", hscode);
        formData.append("category", category);
        formData.append("desc", desc);
        formData.append("image", image);

        try {
          Swal.fire({
            title: "Uploading...",
            text: "Please wait while we list your product.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          const token = localStorage.getItem("sellerToken"); // ✅ FIX: Use sellerToken

          if (!token) {
            throw new Error("You are not logged in!");
          }

          const response = await api.post("/sellers/add-product", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          fetchProducts();

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product listed successfully!",
            confirmButtonColor: "#10b981",
          });
        } catch (error) {
          console.error("Error adding product:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              error.response?.data?.message ||
              error.message ||
              "Something went wrong!",
            confirmButtonColor: "#ef4444",
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
                      ? "bg-blue-600 text-white shadow-xl translate-x-2"
                      : "text-slate-400 hover:bg-blue-900/30 hover:text-white"
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full mb-4"
                >
                  <MapPin size={14} className="text-blue-600" />
                  <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">
                    Official Trade Portal of MP
                  </span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-[#0B184A] tracking-tighter uppercase leading-none">
                  Hello, <span className="text-blue-600">{sellerName}</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-2 italic">
                  Manage your exports and inquiries
                </p>
              </div>

              <button
                onClick={addProductAlert}
                className="w-full sm:w-auto bg-[#10b981] text-white px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all active:scale-95 group"
              >
                <PackagePlus
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />{" "}
                List New Product
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  label: "Products",
                  value: products.length || "0",
                  icon: Package,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Inquiries",
                  value: "48",
                  icon: TrendingUp,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Reach",
                  value: "14+",
                  icon: MapPin,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 flex items-center gap-6 group hover:shadow-2xl transition-all"
                >
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 ${stat.bg} ${stat.color} rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon size={32} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl md:text-4xl font-black text-[#0B184A] tracking-tighter">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PROFESSIONAL CATALOG GRID --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 overflow-hidden mb-12">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Package size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0B184A] uppercase tracking-tight leading-none">
                      Active Listings
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                      Manage your catalog
                    </p>
                  </div>
                </div>
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  Total: {!loading ? products.length : 0}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {!loading &&
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="group flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-[0_20px_40px_rgba(8,_112,_184,_0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-50">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <Package size={40} className="text-slate-300" />
                          </div>
                        )}

                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-sm border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                            Live
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur text-[#0B184A] font-bold text-[10px] uppercase tracking-wider shadow-sm border border-slate-100">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 p-6 flex flex-col">
                        <div className="mb-auto">
                          <h4 className="font-black text-[#0B184A] text-lg leading-snug mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h4>

                          <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2 h-[2.5em] mb-4">
                            {product.description ||
                              "No description provided for this item."}
                          </p>

                          <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              HS Code
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-600">
                              {product.hscode || "---"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-400">
                            <CheckCircle
                              size={14}
                              className="text-emerald-500"
                            />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                              Active Listing
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                            >
                              <Edit size={15} strokeWidth={2.5} />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all shadow-sm"
                            >
                              <Trash2 size={15} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                <button
                  onClick={addProductAlert}
                  className="group flex flex-col h-full min-h-[420px] bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 relative overflow-hidden text-left"
                >
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-100 text-slate-300 group-hover:text-white group-hover:bg-blue-600 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                      <Plus size={32} strokeWidth={3} />
                    </div>
                    <div className="text-center">
                      <h5 className="font-black text-sm text-[#0B184A] uppercase tracking-[0.2em] mb-2">
                        Add Product
                      </h5>
                      <p className="text-xs text-slate-400 font-medium px-8">
                        Create a new listing for your global buyers
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {!loading && products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <Package size={48} className="text-slate-300 mb-4" />
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                    Your catalog is empty
                  </p>
                </div>
              )}
            </div>

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