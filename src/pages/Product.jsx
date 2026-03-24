import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaSpinner,
  FaBoxOpen,
  FaChevronDown,
} from "react-icons/fa";

// Lucide Icons - Yahan MapPin add kar diya
import { X, ArrowRight, MapPin } from "lucide-react";

const Products = () => {
  const navigate = useNavigate();

  // --- 🛒 PRODUCT STATES ---
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 🔍 FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // --- 📝 INQUIRY MODAL STATES ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    quantity: "",
    whatsapp: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "All",
    "Sarees & Ethnic Wear",
    "Textiles & Fabrics",
    "Apparel & Garments",
    "Agriculture & Grains",
    "Spices & Condiments",
    "Fruits & Vegetables",
    "Handicrafts & Decor",
    "Leather & Footwear",
    "Gems & Jewellery",
    "Herbal & Ayurveda",
    "Processed Food",
    "Engineering Goods",
    "Other",
  ];

  const BACKEND_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://source-from-mp-backend.onrender.com";

  // ==========================================
  // 🔥 1. DATA FETCHING LOGIC
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, savedRes] = await Promise.all([
          api.get("/products/all"),
          api.get("/buyers/saved-items"),
        ]);
        setProducts(prodRes.data);
        setFilteredProducts(prodRes.data);
        setSavedProducts(savedRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ==========================================
  // 🔥 2. FILTERING LOGIC
  // ==========================================
  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.hsCode && p.hsCode.toString().includes(query)) ||
          (p.hscode && p.hscode.toString().includes(query)),
      );
    }
    if (sortBy === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortBy, products]);

  // ==========================================
  // 🔥 3. SAVE PRODUCT LOGIC
  // ==========================================
  const toggleSaveProduct = async (product) => {
    try {
      await api.post(`/buyers/toggle-save/${product._id}`);
      const isAlreadySaved = savedProducts.some((p) => p._id === product._id);
      if (isAlreadySaved) {
        setSavedProducts(savedProducts.filter((p) => p._id !== product._id));
      } else {
        setSavedProducts([...savedProducts, product]);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  // ==========================================
  // 🔥 4. INQUIRY FORM LOGIC (The Pro Stuff)
  // ==========================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // LocalStorage se Buyer ka data nikaalein
    const buyerData = JSON.parse(localStorage.getItem("buyerInfo"));

    // Login Check
    if (!buyerData || !buyerData.token) {
      localStorage.setItem("pendingInquiryProductId", selectedProduct._id);

      Swal.fire({
        title: "Login Required",
        text: "Please login as a Buyer to send an inquiry.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) navigate("/buyer/login");
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        productId: selectedProduct._id,
        sellerId: selectedProduct.seller,
        buyerId: buyerData._id,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        hscode: selectedProduct.hscode || selectedProduct.hsCode,
        email: formData.email,
        quantity: formData.quantity,
        whatsapp: formData.whatsapp,
        message: formData.message,
      };

      const { data } = await api.post("/inquiries/send-inquiry", payload);

      if (data.success) {
        Swal.fire(
          "Success!",
          "Your inquiry has been sent to the seller.",
          "success",
        );
        setIsModalOpen(false);
        setFormData({ email: "", quantity: "", whatsapp: "", message: "" });
      }
    } catch (error) {
      console.error("Inquiry Error:", error);
      const msg = error.response?.data?.message || "Failed to send inquiry";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check pending inquiry after returning from login
  useEffect(() => {
    const pendingProductId = localStorage.getItem("pendingInquiryProductId");
    const buyerData = localStorage.getItem("buyerInfo");

    if (pendingProductId && buyerData && products.length > 0) {
      const product = products.find((p) => p._id === pendingProductId);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
        localStorage.removeItem("pendingInquiryProductId");
      }
    }
  }, [products]);

  // ==========================================
  // 🔥 RENDER UI
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="sticky top-0 z-[50] shadow-sm">
        <Header />
      </div>

      {/* --- 📝 INQUIRY MODAL OVERLAY --- */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            {/* LEFT PANEL: PRODUCT PREVIEW */}
            <div className="md:w-[35%] bg-slate-50 p-8 border-r border-slate-100 flex flex-col">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 block">
                Inquiry For
              </span>

              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 mb-6 shadow-sm">
                <img
                  src={
                    selectedProduct.image
                      ? selectedProduct.image.startsWith("http")
                        ? selectedProduct.image
                        : `${BACKEND_URL}/${selectedProduct.image}`
                      : selectedProduct.images?.[0]
                        ? selectedProduct.images[0].startsWith("http")
                          ? selectedProduct.images[0]
                          : `${BACKEND_URL}/${selectedProduct.images[0]}`
                        : "https://via.placeholder.com/400"
                  }
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="text-xl font-bold text-[#0B184A] mb-2 leading-tight">
                {selectedProduct.name}
              </h4>

              <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-4">
                {selectedProduct.description ||
                  "Standard export quality product."}
              </p>

              <div className="mt-auto bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  HS Code
                </p>
                <p className="text-sm font-mono font-bold text-[#0B184A]">
                  {selectedProduct.hscode ||
                    selectedProduct.hsCode ||
                    "Not Specified"}
                </p>
              </div>
            </div>

            {/* RIGHT PANEL: ENQUIRY FORM */}
            <div className="flex-1 p-8 md:p-10 bg-white relative overflow-y-auto max-h-[85vh]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>

              <header className="mb-8">
                <h2 className="text-2xl font-bold text-[#0B184A]">
                  Send Inquiry
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Please fill the details for direct manufacturer response.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@business.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 ml-1">
                      Quantity Needed <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="quantity"
                      type="text"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 1000 Units"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 ml-1">
                      WhatsApp (Optional)
                    </label>
                    <input
                      name="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+91..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Detailed Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe specific requirements, custom packaging, etc..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#0B184A] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 uppercase tracking-wider text-xs mt-2 ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700 active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Inquiry Now"}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- 🏗️ BLUE HEADER SECTION --- */}
      <div className="bg-[#0B184A] text-white pt-12 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-shrink-0">
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
                Marketplace
              </h1>
              <div className="flex items-center gap-2 text-blue-300/60 text-xs font-bold uppercase tracking-widest">
                <span className="w-8 h-[2px] bg-blue-500"></span> Authenticated
                Direct Sourcing
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
              <div className="relative flex-grow w-full">
                <FaSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/50"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search Product Name / HS Code..."
                  className="w-full bg-white/5 border border-white/10 text-white py-3.5 pl-11 pr-4 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-semibold shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative w-full md:w-72">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white py-3.5 pl-5 pr-10 rounded-xl appearance-none cursor-pointer text-sm font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="text-[#0B184A] font-sans"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
                <FaChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/50 pointer-events-none"
                  size={10}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🛍️ MAIN GRID AREA --- */}
      <main className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-[#0B184A] text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-[#0B184A] rounded-full"></span>
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-[0.2em]">
              {filteredProducts.length} Items Found in MP Region
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="bg-blue-50 text-[#0B184A] text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 uppercase">
              Authenticated
            </span>
            <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-full border border-green-100 uppercase">
              Live Marketplace
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40">
            <FaSpinner className="animate-spin text-4xl text-[#0B184A] mb-4" />
            <p className="font-black uppercase tracking-[0.3em] text-[10px] text-gray-400">
              Synchronizing Database...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
            {filteredProducts.map((product) => {
              const isSaved = savedProducts.some((p) => p._id === product._id);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-[40px] shadow-md border border-gray-50 p-6 flex flex-col group hover:shadow-2xl transition-all duration-500 h-full"
                >
                  {/* Image Section */}
                  <div className="bg-[#F4F7FA] h-52 rounded-[30px] mb-5 flex items-center justify-center overflow-hidden relative shrink-0">
                    <img
                      src={
                        product.image
                          ? product.image.startsWith("http")
                            ? product.image
                            : `${BACKEND_URL}/${product.image}`
                          : product.images?.[0]
                            ? product.images[0].startsWith("http")
                              ? product.images[0]
                              : `${BACKEND_URL}/${product.images[0]}`
                            : "https://via.placeholder.com/400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleSaveProduct(product)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                          isSaved
                            ? "bg-red-50 text-red-500"
                            : "bg-white/80 text-gray-400 hover:text-red-500"
                        }`}
                      >
                        {isSaved ? (
                          <FaHeart size={16} />
                        ) : (
                          <FaRegHeart size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 px-1 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        {product.category || "General"}
                      </span>

                      {product.seller?.city && (
                        <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-100 shrink-0">
                          <MapPin size={10} className="text-red-500" />
                          <span className="text-[9px] font-bold uppercase tracking-tight text-slate-600">
                            {product.seller.city}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-[#000F29] text-xl font-black mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* ✅ FIX: line-clamp-3 hata diya taaki poora description dikhe */}
                    <div className="flex-1 mb-4">
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        {product.description ||
                          "Premium quality export-ready product sourced directly from Madhya Pradesh."}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer Section */}
                  <div className="pt-5 border-t border-gray-50 flex justify-between items-center mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        HS Code
                      </span>
                      <span className="font-mono font-bold text-slate-700 text-sm">
                        {product.hscode || product.hsCode || "---"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="bg-[#000F29] text-white px-7 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] py-40 text-center border-2 border-dashed border-gray-100 max-w-2xl mx-auto mt-10">
            <FaBoxOpen className="mx-auto text-gray-200 text-7xl mb-6" />
            <h3 className="text-2xl font-black text-[#0B184A] mb-3 uppercase">
              Zero Results Found
            </h3>
            <p className="text-gray-400 font-medium mb-10 px-10">
              Try searching for generic terms or resetting your category filter
              to "All Products".
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="bg-[#0B184A] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl"
            >
              Reset Catalog
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
