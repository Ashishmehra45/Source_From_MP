import React, { useState } from 'react';
import { Globe, Search, User, ChevronRight, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 🔥 AUTH CHECK LOGIC ---
  const handleAuthNavigation = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Agar Token hai -> Dashboard par bhejo
      navigate('/seller/dashboard');
    } else {
      // Agar Token nahi hai -> Login par bhejo
      navigate('/login');
    }
  };

  return (
    <div className="w-full">
      {/* 1. TOP UTILITY BAR - Hidden on small mobile for space */}
      <div className="hidden sm:flex bg-white border-b border-slate-100 md:px-12 py-2 justify-between items-center text-[10px] md:text-[11px] font-semibold text-slate-500 tracking-wider">
        <div className="flex gap-4 md:gap-8">
          <span className="cursor-pointer hover:text-[#0B184A] uppercase">Currency: USD $</span>
          <span className="cursor-pointer hover:text-[#0B184A] uppercase">Language: EN</span>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          <span className="hidden md:inline cursor-pointer hover:text-[#0B184A] uppercase">Help Center</span>
          
          {/* ✅ UPDATED: Account Click Logic */}
          <div 
            onClick={handleAuthNavigation} 
            className="flex items-center gap-1.5 cursor-pointer hover:text-[#0B184A] group"
          >
            <User size={14} className="text-slate-600 group-hover:text-[#0B184A]" />
            <span className="uppercase">Account</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-50 bg-white md:px-12 py-3 md:py-5 flex items-center justify-between gap-4 border-b border-slate-100 shadow-sm md:shadow-none">
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 md:w-12 md:h-12 bg-[#0B184A] rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md">
            <Globe size={20} className="md:w-7 md:h-7" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-lg md:text-2xl tracking-tighter uppercase leading-none text-[#0B184A]">
              Source From
            </h1>
            <span className="text-[8px] md:text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5 md:mt-1">
              Madhya Pradesh
            </span>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile, visible on LG+ */}
        <div className="flex-1 max-w-4xl hidden lg:block">
          <div className="flex items-center bg-[#F1F5F9] rounded-2xl p-1 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-all">
            <div className="flex items-center px-4 gap-2 cursor-pointer border-r border-slate-300">
              <span className="text-sm font-bold text-slate-700">Products</span>
              <ChevronDown size={16} className="text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search for GI products..." 
              className="bg-transparent w-full px-5 py-2.5 text-sm outline-none font-medium text-slate-600" 
            />
            <button className="bg-[#0B184A] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-white hover:text-[#0B184A] border-2 border-[#0B184A] transition flex items-center gap-2 shrink-0 shadow-lg">
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Right Actions - Desktop Only */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="bg-white border-2 border-[#0B184A] text-[#0B184A] px-7 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition">
            Post Requirement
          </button>
          
          {/* ✅ UPDATED: Sell Products Button Logic */}
          <button 
            onClick={handleAuthNavigation} 
            className="bg-[#0B184A] text-white px-7 py-3 rounded-xl text-xs font-bold hover:bg-[white] border-2 border-[#0B184A] hover:text-[#0B184A] transition shadow-lg"
          >
            Sell Products
          </button>
        </div>

        {/* Mobile Search Icon - Visible only on mobile */}
        <button className="lg:hidden p-2 text-[#0B184A]">
          <Search size={22} />
        </button>
      </header>

      {/* 3. MOBILE OVERLAY MENU */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 h-[52vh] z-[100] bg-[#2b3a79] px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center">
            <span className="font-black text-[#dcdcdc]">MENU</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-4">
            {/* ✅ UPDATED: Mobile Menu Button Logic */}
            <button 
              onClick={() => {
                handleAuthNavigation();
                setIsMenuOpen(false); // Menu close bhi kar diya
              }}
              className="w-full bg-[#0B184A] text-[#dcdcdc] p-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Sell Your Products
            </button>

            <button className="w-full border-2 border-[#0B184A] text-[#dcdcdc] p-4 rounded-xl font-bold">
              Post Buying Requirement
            </button>
            <div className="h-[1px] bg-slate-100 my-2" />
            
            {/* ✅ UPDATED: My Account Logic */}
            <button 
                onClick={() => {
                    handleAuthNavigation();
                    setIsMenuOpen(false);
                }} 
                className="text-lg font-bold text-[#dcdcdc] py-2 border-b border-slate-50 text-left"
            >
                My Account
            </button>
            
            <a href="#" className="text-lg font-bold text-[#dcdcdc] py-2 border-b border-slate-50">Help Center</a>
            <a href="#" className="text-lg font-bold text-[#dcdcdc] py-2 border-b border-slate-50">Language: EN</a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;