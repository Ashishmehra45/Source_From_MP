import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import { 
  FaSearch, FaMapMarkerAlt, FaHeart, FaRegHeart, 
  FaSpinner, FaBarcode, FaBoxOpen, FaChevronDown, FaArrowRight,
  FaFilter 
} from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");



  const categories = [
    "All", "Sarees & Ethnic Wear", "Textiles & Fabrics", "Apparel & Garments",
    "Agriculture & Grains", "Spices & Condiments", "Fruits & Vegetables",
    "Handicrafts & Decor", "Leather & Footwear", "Gems & Jewellery",
    "Herbal & Ayurveda", "Processed Food", "Engineering Goods", "Other"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, savedRes] = await Promise.all([
          api.get("/products/all"), 
          api.get("/buyers/saved-items")
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

  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.hsCode && p.hsCode.toString().includes(query)) ||
        (p.hscode && p.hscode.toString().includes(query))
      );
    }
    if (sortBy === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortBy, products]);

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

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="sticky top-0 z-[100] shadow-sm"><Header /></div>

      {/* --- 🏗️ MINIMAL HEADER (#0B184A Theme) --- */}
      <div className="bg-[#0B184A] text-white pt-12 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Title Section */}
            <div className="flex-shrink-0">
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Marketplace</h1>
              <div className="flex items-center gap-2 text-blue-300/60 text-xs font-bold uppercase tracking-widest">
                <span className="w-8 h-[2px] bg-blue-500"></span>
                Authenticated Direct Sourcing
              </div>
            </div>

            {/* 🔥 SEARCH & FILTER ALIGNMENT (SEARCH BADA KIYA HAI) */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
              
              {/* Search - Flex Grow se bada kar diya */}
              <div className="relative flex-grow w-full">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/50" size={14} />
                <input 
                  type="text"
                  placeholder="Search Product Name / HS Code..."
                  className="w-full bg-white/5 border border-white/10 text-white py-3.5 pl-11 pr-4 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm font-semibold shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Dropdown - Width limited to md:w-72 */}
              <div className="relative w-full md:w-72">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/50" size={12} />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white py-3.5 pl-11 pr-10 rounded-xl appearance-none cursor-pointer text-sm font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="text-[#0B184A] font-sans">{cat}</option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/50 pointer-events-none" size={10} />
              </div>

            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* --- 🔥 DYNAMIC SECTION HEADER (Baki sb wesa hi hai) --- */}
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
                <span className="bg-blue-50 text-[#0B184A] text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 uppercase">Authenticated</span>
                <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-full border border-green-100 uppercase">Live Marketplace</span>
            </div>
        </div>

        {/* --- 🛍️ PRODUCT GRID (Design preserved) --- */}
        {loading ? (
          <div className="flex flex-col items-center py-40">
            <FaSpinner className="animate-spin text-4xl text-[#0B184A] mb-4" />
            <p className="font-black uppercase tracking-[0.3em] text-[10px] text-gray-400">Synchronizing Database...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const isSaved = savedProducts.some((p) => p._id === product._id);
              const displayHS = product.hsCode || product.hscode;

           return (
  <div key={product._id} className="bg-white rounded-[35px] overflow-hidden border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(11,24,74,0.15)] hover:-translate-y-3 transition-all duration-500 flex flex-col group">
    
    {/* --- 🖼️ IMAGE & OVERLAYS --- */}
    <div className="relative h-64 bg-[#F8FAFC] overflow-hidden">
      <img
        src={
          product.images?.[0] 
            ? (product.images[0].startsWith('http') ? product.images[0] : `${product.images[0]}`) 
            : product.image 
              ? (product.image.startsWith('http') ? product.image : `${product.image}`) 
              : "https://via.placeholder.com/400"
        }
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
      />

      {/* 🔥 SUPER VISIBLE HS CODE BADGE */}
      {displayHS && (
        <div className="absolute top-5 left-5 bg-[#0B184A] text-white flex items-center gap-2 px-4 py-2 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
          <FaBarcode className="text-blue-300" size={14} />
          <span className="text-[11px] font-black tracking-[0.1em]">HS CODE: {displayHS}</span>
        </div>
      )}

      {/* Floating Save Button */}
      <button 
          onClick={() => toggleSaveProduct(product)} 
          className={`absolute top-5 right-5 w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-xl transition-all ${isSaved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
      >
          {isSaved ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
      </button>

      {/* Category Glass Chip */}
      <div className="absolute bottom-5 left-6">
        <span className="bg-white/80 backdrop-blur-md text-[#0B184A] text-[9px] font-black px-4 py-2 rounded-xl shadow-sm uppercase tracking-[0.2em] border border-white/50">
          {product.category}
        </span>
      </div>
    </div>

    {/* --- 📝 CONTENT AREA --- */}
    <div className="p-8 flex flex-col flex-grow">
      <div className="flex items-center gap-2 mb-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
          <FaMapMarkerAlt className="text-blue-500" size={10} /> 
          {product.location || "Madhya Pradesh, India"}
      </div>

      <h3 className="text-[#0B184A] text-2xl font-black mb-3 line-clamp-1 group-hover:text-blue-800 transition-colors tracking-tight leading-tight">
          {product.name}
      </h3>

      <p className="text-gray-500 text-[13px] leading-relaxed mb-8 line-clamp-2 italic opacity-80 pl-4 border-l-4 border-blue-100">
        {product.description || "Premium authentic quality product sourced directly from the heart of Central India."}
      </p>

      {/* --- 🚀 ACTION AREA (No Price, Full Focus on CTA) --- */}
      <div className="mt-auto">
          <button className="w-full bg-[#0B184A] text-white py-4.5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.25em] hover:bg-blue-900 shadow-[0_15px_30px_rgba(11,24,74,0.2)] transition-all flex items-center justify-center gap-3 group/btn relative overflow-hidden">
              <span className="relative z-10">Send Inquiry</span>
              <FaArrowRight className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300" size={12} />
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Verified Merchant Access
          </div>
      </div>
    </div>
  </div>
);
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] py-40 text-center border-2 border-dashed border-gray-100 max-w-2xl mx-auto mt-10">
            <FaBoxOpen className="mx-auto text-gray-200 text-7xl mb-6" />
            <h3 className="text-2xl font-black text-[#0B184A] mb-3 uppercase">Zero Results Found</h3>
            <p className="text-gray-400 font-medium mb-10 px-10">Try searching for generic terms or resetting your category filter to "All Products".</p>
            <button onClick={() => {setSelectedCategory("All"); setSearchQuery("");}} className="bg-[#0B184A] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl">Reset Catalog</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;