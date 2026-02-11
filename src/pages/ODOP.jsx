import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Award, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
// Banner import (Same path as before)
import ODOpBanner from '../assets/GI_Banner.jpeg'; 

const ODOPGallery = () => {
  const odopProducts = [
    { city: "AgarMalwa", product: "Orange", icon: "🍊", theme: "orange" },
    { city: "Alirajpur", product: "Mahua", icon: "🍃", theme: "emerald" },
    { city: "Anuppur", product: "Kodu Kutki", icon: "🌾", theme: "amber" },
    { city: "AshokNagar", product: "Chanderi Handloom", icon: "🧵", theme: "indigo" },
    { city: "Balaghat", product: "Chinnor Rice", icon: "🌾", theme: "emerald" },
    { city: "Barwani", product: "Ginger", icon: "🫚", theme: "warm" },
    { city: "Betul", product: "Teak", icon: "🪵", theme: "wood" },
    { city: "Bhind", product: "Mustard", icon: "🌻", theme: "gold" },
    { city: "Bhopal", product: "Bhojpatra & Jute", icon: "👜", theme: "stone" },
    { city: "Burhanpur", product: "Banana", icon: "🍌", theme: "amber" },
    { city: "Chhatarpur", product: "Wooden Furniture", icon: "🪑", theme: "wood" },
    { city: "Chhindwara", product: "Orange", icon: "🍊", theme: "orange" },
    { city: "Damoh", product: "Gram", icon: "🌱", theme: "green" },
    { city: "Datia", product: "Jaggery", icon: "🍯", theme: "warm" },
    { city: "Dewas", product: "Bamboo", icon: "🎍", theme: "emerald" },
    { city: "Dhar", product: "Bagh Print", icon: "🎨", theme: "rose" },
    { city: "Dindori", product: "Kodu Kutki", icon: "🌾", theme: "amber" },
    { city: "Guna", product: "Coriander", icon: "🌿", theme: "lime" },
    { city: "Gwalior", product: "Sandstone Tiles", icon: "🧱", theme: "silver" },
    { city: "Narmadapuram", product: "Tourism", icon: "🏞️", theme: "sky" },
    { city: "Indore", product: "Potato", icon: "🥔", theme: "warm" },
    { city: "Jabalpur", product: "Pea", icon: "🫛", theme: "green" },
    { city: "Jhabua", product: "Kadaknath Chicken", icon: "🍗", theme: "dark" },
    { city: "Katni", product: "Katni Stone", icon: "🗿", theme: "stone" },
    { city: "Khandwa", product: "Onion", icon: "🧅", theme: "pink" },
    { city: "Khargone", product: "Chilli", icon: "🌶️", theme: "red" },
    { city: "Mandla", product: "Kodu Kutki", icon: "🌾", theme: "amber" },
    { city: "Mandsaur", product: "Garlic", icon: "🧄", theme: "silver" },
    { city: "Morena", product: "Mustard", icon: "🌻", theme: "gold" },
    { city: "Narsinghpur", product: "Toor Dal", icon: "🥣", theme: "amber" },
    { city: "Seoni", product: "Custard Apple", icon: "🍈", theme: "emerald" },
    { city: "Panna", product: "Gooseberry", icon: "🍏", theme: "lime" },
    { city: "Raisen", product: "Basmati Rice", icon: "🌾", theme: "emerald" },
    { city: "Rajgarh", product: "Orange", icon: "🍊", theme: "orange" },
    { city: "Ratlam", product: "Ratlam Sev", icon: "🥨", theme: "red" },
    { city: "Rewa", product: "Bamboo", icon: "🎍", theme: "emerald" },
    { city: "Sagar", product: "Farm Equipments", icon: "🚜", theme: "slate" },
    { city: "Satna", product: "Tomato", icon: "🍅", theme: "red" },
    { city: "Sehore", product: "Wooden Handicrafts", icon: "🪵", theme: "wood" },
    { city: "Shahdol", product: "Turmeric", icon: "🧂", theme: "gold" },
    { city: "Shajapur", product: "Onion", icon: "🧅", theme: "pink" },
    { city: "Sheopur", product: "Guava", icon: "🍐", theme: "green" },
    { city: "Shivpuri", product: "Cloth Jacket", icon: "🧥", theme: "blue" },
    { city: "Sidhi", product: "Carpet", icon: "🧶", theme: "indigo" },
    { city: "Singrauli", product: "Kodu Kutki", icon: "🌾", theme: "amber" },
    { city: "Tikamgarh", product: "Ginger", icon: "🫚", theme: "warm" },
    { city: "Ujjain", product: "Batik Print", icon: "🧣", theme: "violet" },
    { city: "Umaria", product: "Mahua", icon: "🍃", theme: "emerald" },
    { city: "Vidisha", product: "Farm Equipments", icon: "🚜", theme: "slate" }
  ];

  const themeConfig = {
    emerald: { gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
    orange: { gradient: "from-orange-400 to-red-500", shadow: "shadow-orange-200" },
    amber: { gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-200" },
    indigo: { gradient: "from-indigo-500 to-blue-700", shadow: "shadow-indigo-200" },
    warm: { gradient: "from-orange-300 to-amber-500", shadow: "shadow-amber-100" },
    wood: { gradient: "from-orange-800 to-amber-900", shadow: "shadow-orange-900" },
    gold: { gradient: "from-yellow-400 to-amber-600", shadow: "shadow-yellow-200" },
    stone: { gradient: "from-stone-400 to-stone-600", shadow: "shadow-stone-200" },
    green: { gradient: "from-green-500 to-emerald-700", shadow: "shadow-green-200" },
    rose: { gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-200" },
    lime: { gradient: "from-lime-400 to-green-600", shadow: "shadow-lime-200" },
    silver: { gradient: "from-slate-300 to-slate-500", shadow: "shadow-slate-200" },
    sky: { gradient: "from-sky-400 to-blue-600", shadow: "shadow-sky-200" },
    dark: { gradient: "from-slate-700 to-slate-900", shadow: "shadow-slate-400" },
    pink: { gradient: "from-pink-400 to-rose-500", shadow: "shadow-pink-200" },
    red: { gradient: "from-red-500 to-rose-700", shadow: "shadow-red-200" },
    slate: { gradient: "from-slate-500 to-slate-700", shadow: "shadow-slate-300" },
    blue: { gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200" },
    violet: { gradient: "from-violet-500 to-purple-700", shadow: "shadow-violet-200" }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="sticky top-0 z-[100]">
        <Header />
      </div>

      {/* 1. TOP BANNER - MOBILE RESPONSIVE */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[200px] sm:h-[300px] md:h-[450px] overflow-hidden"
      >
        <img src={ODOpBanner} alt="MP ODOP Banner" className="w-full h-full object-cover object-center" />
      </motion.div>

      <div className="max-w-[1800px] py-8 md:py-12 px-4 md:px-12 mx-auto">
        
        {/* 2. HEADER CONTENT */}
        <div className="mb-12 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm mb-6 border border-slate-100">
            <Award className="text-blue-600" size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">One District One Product</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-7xl font-black text-[#0B184A] tracking-tighter mb-4">
            Madhya Pradesh's <br/> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4 md:underline-offset-8">Heritage ODOPs</span>
          </h2>
          
          <p className="text-slate-500 font-medium text-sm md:text-lg max-w-2xl mx-auto mb-8">
            Unique products from each district of Madhya Pradesh, showcasing regional excellence.
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-6 md:gap-12 border-t border-b border-slate-100 py-6 mb-8 md:mb-12">
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-black text-[#0B184A]">55</p>
              <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Districts</p>
            </div>
            <div className="w-[1px] h-10 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-black text-[#0B184A] flex items-center justify-center gap-1">
                100% <CheckCircle className="text-emerald-500" size={20} md:size={28} />
              </p>
              <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authentic</p>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC SYMMETRIC GRID */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4"
        >
          {odopProducts.map((item, idx) => {
            const config = themeConfig[item.theme] || themeConfig.emerald;
            return (
              <motion.div
                key={idx}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative overflow-hidden px-3 py-6 md:px-5 md:py-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white bg-gradient-to-br ${config.gradient} ${config.shadow} group cursor-pointer h-full min-h-[160px] md:min-h-[200px] flex flex-col items-center text-center shadow-lg transition-all`}
              >
                {/* Center Icon */}
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl md:text-3xl border border-white/30 mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                <div className="flex flex-col items-center flex-grow w-full">
                  <h3 className="text-xs md:text-lg font-black leading-tight mb-1 md:mb-2 line-clamp-2 px-1">
                    {item.product}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-white/80">
                    <MapPin size={8} md:size={12} />
                    <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest">{item.city}</span>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 p-1.5 bg-white/20 rounded-lg group-hover:bg-white group-hover:text-[#0B184A] transition-all">
                  <ArrowUpRight size={12} md:size={16} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ODOPGallery;