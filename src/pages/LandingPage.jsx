
import React from 'react';
import { Search, MapPin, Utensils, Coffee, ShoppingBag, Music, Hotel, ChevronRight, Globe, User ,ArrowRight} from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import Footer from '../components/Footer';
import api from '../api/axios'



// Custom SVG Icons (Standard for professional B2B sites)
const IconGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconChevron = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;

const LandingPage = () => {

  
  const navigate = useNavigate();

  // ✅ YE LINES ADD KARNI HAIN (Jo missing hain)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ YE EFFECT BHI ADD KARNA HAI (Data lane ke liye)
 useEffect(() => {
  const fetchPublicProducts = async () => {
    try {
      // ✅ URL Change kiya: '/my-products' hata kar '/public-products' lagaya
      const { data } = await api.get('/sellers/public-products');
      
      if (data && data.products) {
          setProducts(data.products);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoading(false);
    }
  };

  fetchPublicProducts();
}, []);

  // ✅ Image URL Helper Function
  const getImageUrl = (path) => {
    if(!path) return '';
    const cleanPath = path.replace(/\\/g, "/");
    return `http://localhost:5000/${cleanPath}`;
  };

   

  const departments = [
    "GI Products","ODOP Products", "Food & Beverage", "Agriculture", "Sports & Entertainment",
    "Fashion Apparel & Fabrics", "Timepieces, Jewelry & Eyewear", "Construction & Real Estate",
    "Home & Garden", "Business & Industrial", "Gifts & Decorations", "Toys & Hobbies"
  ];
  const categories = [
    { name: 'Agriculture', ads: '45 Ads', icon: '🌾' },
    { name: 'GI Products', ads: '12 Ads', icon: '🏛️' },
    { name: 'Textiles', ads: '28 Ads', icon: '🧵' },
    { name: 'Electronics', ads: '15 Ads', icon: '💻' },
    { name: 'Machinery', ads: '9 Ads', icon: '⚙️' },
    { name: 'Handicrafts', ads: '32 Ads', icon: '🎨' },
  ];

  const handleNavigation = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    if (slug === 'gi-products') {
      navigate('/gi');
    } else if (slug === 'odop-products') {
      navigate('/odop');
    } else {
      // Future routes ke liye (jaise /category/agriculture)
      navigate(`/category/${slug}`);
    }
  };

  return (
    <div className="min-h-screen w-full  font-sans text-slate-900  ">
      
      {/* 1. GLOBAL ANNOUNCEMENT (Image 1 Context) */}
    

      {/* 2. TOP UTILITY BAR (Image 2 Context) */}
     
      {/* 3. MAIN HEADER - FULL WIDTH */}
       <div className="sticky top-0 z-[100]">
        <Header />
      </div>

     {/* 4. MAIN CONTENT GRID - WIDE LAYOUT */}
<main className="w-full px-4 md:px-12 py-6 md:py-8 mx-auto max-w-[1800px]">
  <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
    
    {/* Sidebar Departments - Hidden on Mobile/Tablet, Desktop par wide rahega */}
    <aside className="hidden lg:block w-72 shrink-0 space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-28">
        <div className="bg-[#0B184A] p-4 text-white flex items-center gap-3">
          <div className="w-5 h-[2px] bg-white relative before:absolute before:top-[-6px] before:w-5 before:h-[2px] before:bg-white after:absolute after:top-[6px] after:w-5 after:h-[2px] after:bg-white"></div>
          <span className="font-black text-xs tracking-widest uppercase">All Departments</span>
        </div>
        <div className="py-2">
          {departments.map((cat, i) => (
            <div key={i} 
            onClick={() => handleNavigation(cat)}
            className="flex items-center justify-between px-5 py-3 text-[13px] font-bold text-slate-600 hover:bg-blue-50 hover:text-[#0B184A] cursor-pointer transition-colors border-b border-slate-50 last:border-0 group">
              {cat} <IconChevron />
            </div>
          ))}
        </div>
      </div>
    </aside>

    {/* Hero Content Area */}
    <div className="flex-1 space-y-6 md:space-y-8">
      {/* Main Sourcing Banner - Mobile par height auto/chhoti aur text size adjust kiya */}
      <div className="relative min-h-[400px] md:h-[550px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 group shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105" 
          alt="Digital Trade Hub" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 md:via-slate-900/40 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 py-12 text-white">
          <div className="mb-4 inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-[8px] md:text-[10px] font-black uppercase tracking-widest w-fit">
              Verified Export Manufacturers
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1] md:leading-[0.9] mb-4 md:mb-6 tracking-tighter uppercase">
            Madhya Pradesh <br/><span className="text-blue-400">Trade Hub</span>
          </h2>
          <p className="text-slate-200 text-base md:text-2xl mb-8 md:text-12 font-medium max-w-2xl leading-relaxed">
            Direct access to 15,000+ verified Indian manufacturers. Trade with trust on the official FIEO platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-5"> 
            <button className="bg-white text-slate-900 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-[#0B184A] hover:text-white transition-all shadow-2xl active:scale-95"> 
              Start Sourcing Now ↗
            </button>
          </div>
        </div>
      </div>

      {/* Registration Cards - Mobile par stack honge (grid-cols-1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-[rgb(232,235,249)] p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-blue-100 flex flex-col justify-between hover:shadow-xl transition relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-[#0B184A] mb-3 md:mb-4">Sell on Sourcr From MP <br className="hidden md:block"/> Business Portal</h3>
              <p className="text-slate-600 text-xs md:text-sm font-bold mb-6 md:mb-8 max-w-[250px]">MPIDC invites MP exporters to create their digital stores today.</p>
              <button className="w-full sm:w-fit bg-[#0B184A] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm shadow-lg">Register as an MP Exporter</button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
               <IconGlobe size={120} />
            </div>
        </div> 

        <div className="bg-[rgb(232,235,249)] p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 flex flex-col justify-between hover:shadow-xl transition relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-[#0B184A] mb-3 md:mb-4">Buy from <br className="hidden md:block"/> Indian Exporters</h3>
              <p className="text-slate-600 text-xs md:text-sm font-bold mb-6 md:mb-8 max-w-[250px]">Widest range of export-ready products for international buyers.</p>
              <button className="w-full sm:w-fit bg-[#0B184A] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm shadow-blue-200">Register as a Foreign Buyer</button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-5">
               <IconGlobe size={120} />
            </div>
        </div>
      </div>
    </div>
  </div>

  {/* 5. TOP CATEGORIES - Responsive Grid (2 columns on mobile, 6 on desktop) */}
  <section className="py-12 md:py-20 px-0 md:px-8 max-w-7xl mx-auto w-full">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
      <div>
        <h3 className="text-3xl md:text-4xl font-black text-blue-900 mb-2">Our <span className="bg-[#0B184A] text-white px-3 rounded-md">Category</span></h3>
        <p className="text-gray-500 text-sm md:text-base font-medium">Buy and Sell Everything from MP's Top Trade Sectors</p>
      </div>
      <button className="w-full md:w-fit justify-center border-2 text-white border-[#0B184A] bg-[#0B184A] px-2 py-2 rounded-md font-bold flex items-center hover:bg-white hover:text-black transition">
        View All <ChevronRight size={18} />
      </button>
    </div>

   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
  {categories.map((cat, idx) => (
    <div 
      key={idx} 
      className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all duration-500 group cursor-pointer"
    >
      <span className="text-[10px] md:text-xs font-bold text-gray-400 mb-1">{cat.ads}</span>
      
      {/* Icon Div with 360 Rotation Logic */}
      <div className="text-3xl md:text-5xl mb-3 md:mb-4 transform transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110">
        {cat.icon}
      </div>
      
      <h4 className="font-bold text-blue-900 text-sm md:text-base leading-tight">{cat.name}</h4>
    </div>
  ))}
</div>
  </section>

  <section className="py-20 px-4 md:px-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1800px] mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
               <span className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2 block">Fresh from Factories</span>
               <h3 className="text-3xl md:text-5xl font-black text-[#0B184A] tracking-tight">
                 Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Export Products</span>
               </h3>
            </div>
            <button className="group flex items-center gap-2 font-bold text-[#0B184A] hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">
              View All Marketplace <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Loading State */}
            {loading && [1,2,3,4].map((n) => (
              <div key={n} className="h-[400px] bg-white rounded-[2.5rem] animate-pulse"></div>
            ))}

            {/* Products Mapping */}
            {!loading && products.map((product) => (
              <div key={product._id} className="group bg-white rounded-[2.5rem] p-4 border border-slate-200 shadow-sm hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
                
                {/* Image Area */}
                <div className="relative h-64 w-full rounded-[2rem] overflow-hidden bg-slate-100 mb-5">
                  {product.image ? (
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package size={48} />
                    </div>
                  )}
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-[#0B184A]/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Export Ready
                  </div>
                </div>

                {/* Content */}
                <div className="px-2 flex-1 flex flex-col">
                  <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">
                    {product.category}
                  </p>
                  <h4 className="text-xl font-black text-[#0B184A] leading-tight mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4 h-8">
                    {product.description || "Premium quality export product available for bulk orders."}
                  </p>

                  {/* HS Code & Action */}
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase">HS Code</span>
                      <span className="font-mono font-bold text-slate-700 text-sm">{product.hscode || 'N/A'}</span>
                    </div>
                    <button className="bg-[#0B184A] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20 active:scale-95">
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State (Agar products nahi hain) */}
            {!loading && products.length === 0 && (
               <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-slate-300"/>
                  </div>
                  <h3 className="font-bold text-slate-500">No products listed yet</h3>
                  <p className="text-slate-400 text-sm">Be the first exporter to list!</p>
               </div>
            )}

          </div>
        </div>
      </section>
    
</main>

      {/* 6. TRUST FOOTER - FULL WIDTH */}
      <Footer />
    </div>
  );
};

export default LandingPage;