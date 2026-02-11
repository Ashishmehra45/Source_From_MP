import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, CheckCircle } from 'lucide-react';
import Header from '../components/Header';   
import GIBanner from '../assets/GI_Banner.jpeg'; // Ensure you have this image in your assets folder

const GIGalleryFull = () => {
  // Complete 33 GI Products Data extracted from your PDF
  const giProducts = [
    { name: "Balaghat Chinnor", type: "Agricultural", origin: "Balaghat", icon: "🌾", theme: "emerald" },
    { name: "Sharbati Gehu", type: "Agricultural", origin: "Sehore/Vidisha", icon: "🍞", theme: "amber" },
    { name: "Rewa Sunderja Mango", type: "Agricultural", origin: "Rewa", icon: "🥭", theme: "orange" },
    { name: "Ratlam Riyawan Lahsun", type: "Agricultural", origin: "Ratlam", icon: "🧄", theme: "lime" },
    { name: "Nagpur Orange", type: "Agricultural", origin: "Shared (MH/MP)", icon: "🍊", theme: "sunset" },
    { name: "Bundelkhand Kathiya Gehu", type: "Agricultural", origin: "Shared (UP/MP)", icon: "🌾", theme: "gold" },
    { name: "Mahoba Desawari Pan", type: "Agricultural", origin: "Shared (UP/MP)", icon: "🍃", theme: "green" },
    { name: "Ratlami Sev", type: "Food Stuff", origin: "Ratlam", icon: "🥨", theme: "red" },
    { name: "Morena Gajak", type: "Food Stuff", origin: "Morena", icon: "🍬", theme: "warm" },
    { name: "Jhabua Kadaknath Chicken", type: "Food Stuff", origin: "Jhabua", icon: "🍗", theme: "dark" },
    { name: "Chanderi Sarees", type: "Handicraft", origin: "Ashoknagar", icon: "🧵", theme: "indigo" },
    { name: "Bagh Prints", type: "Handicraft", origin: "Dhar", icon: "🎨", theme: "rose" },
    { name: "Maheshwar Fabric", type: "Handicraft", origin: "Khargone", icon: "👗", theme: "violet" },
    { name: "Gond Painting", type: "Handicraft", origin: "Dindori", icon: "🖼️", theme: "fuchsia" },
    { name: "Leather Toys of Indore", type: "Handicraft", origin: "Indore", icon: "🧸", theme: "cyan" },
    { name: "Bell Metal Ware", type: "Handicraft", origin: "Datia/Tikamgarh", icon: "🏺", theme: "bronze" },
    { name: "Wrought Iron Craft", type: "Handicraft", origin: "Dindori", icon: "⚒️", theme: "slate" },
    { name: "Ujjain Batik Print", type: "Handicraft", origin: "Ujjain", icon: "🧣", theme: "blue" },
    { name: "Gwalior Handmade Carpet", type: "Handicraft", origin: "Gwalior", icon: "🧶", theme: "teal" },
    { name: "Waraseoni Handloom", type: "Handicraft", origin: "Balaghat", icon: "🧵", theme: "pink" },
    { name: "Jabalpur Stone Craft", type: "Handicraft", origin: "Jabalpur", icon: "🗿", theme: "stone" },
    { name: "Chhatarpur Furniture", type: "Handicraft", origin: "Chhatarpur", icon: "🪑", theme: "wood" },
    { name: "Khajuraho Stone Craft", type: "Handicraft", origin: "Chhatarpur", icon: "🏛️", theme: "earth" },
    { name: "Betul Bharewa Metal Craft", type: "Handicraft", origin: "Betul", icon: "⚜️", theme: "brass" },
    { name: "Gwalior Papier Mache", type: "Handicraft", origin: "Gwalior", icon: "🎨", theme: "lavender" },
    { name: "Gwalior Stone Craft", type: "Handicraft", origin: "Gwalior", icon: "🗿", theme: "silver" },
    { name: "Bhopal Zardozi", type: "Handicraft", origin: "Bhopal", icon: "✨", theme: "royal" },
    { name: "Tikamgarh Metal Ware", type: "Handicraft", origin: "Tikamgarh", icon: "🏺", theme: "coffee" },
    { name: "Panna Diamond", type: "Manufactured", origin: "Panna", icon: "💎", theme: "sky" }
  ];

  const themeConfig = {
    emerald: { gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
    amber: { gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-200" },
    orange: { gradient: "from-orange-400 to-red-500", shadow: "shadow-orange-200" },
    lime: { gradient: "from-lime-400 to-green-600", shadow: "shadow-lime-200" },
    sunset: { gradient: "from-orange-500 to-rose-600", shadow: "shadow-rose-200" },
    gold: { gradient: "from-yellow-400 to-amber-600", shadow: "shadow-yellow-200" },
    green: { gradient: "from-green-500 to-emerald-700", shadow: "shadow-green-200" },
    red: { gradient: "from-red-500 to-rose-700", shadow: "shadow-red-200" },
    warm: { gradient: "from-orange-300 to-amber-500", shadow: "shadow-amber-100" },
    dark: { gradient: "from-slate-700 to-slate-900", shadow: "shadow-slate-400" },
    indigo: { gradient: "from-indigo-500 to-blue-700", shadow: "shadow-indigo-200" },
    rose: { gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-200" },
    violet: { gradient: "from-violet-500 to-purple-700", shadow: "shadow-violet-200" },
    fuchsia: { gradient: "from-fuchsia-500 to-pink-600", shadow: "shadow-fuchsia-200" },
    cyan: { gradient: "from-cyan-400 to-blue-500", shadow: "shadow-cyan-200" },
    bronze: { gradient: "from-orange-600 to-yellow-800", shadow: "shadow-orange-300" },
    slate: { gradient: "from-slate-500 to-slate-700", shadow: "shadow-slate-300" },
    blue: { gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200" },
    teal: { gradient: "from-teal-500 to-emerald-600", shadow: "shadow-teal-200" },
    pink: { gradient: "from-pink-400 to-rose-500", shadow: "shadow-pink-200" },
    stone: { gradient: "from-stone-400 to-stone-600", shadow: "shadow-stone-200" },
    wood: { gradient: "from-orange-800 to-amber-900", shadow: "shadow-orange-900" },
    earth: { gradient: "from-amber-700 to-orange-900", shadow: "shadow-amber-800" },
    brass: { gradient: "from-yellow-600 to-amber-700", shadow: "shadow-yellow-600" },
    lavender: { gradient: "from-indigo-300 to-purple-400", shadow: "shadow-indigo-100" },
    silver: { gradient: "from-slate-300 to-slate-500", shadow: "shadow-slate-200" },
    royal: { gradient: "from-blue-800 to-indigo-950", shadow: "shadow-blue-900" },
    coffee: { gradient: "from-stone-600 to-orange-900", shadow: "shadow-stone-800" },
    sky: { gradient: "from-sky-400 to-blue-600", shadow: "shadow-sky-200" }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="sticky top-0 z-[100]">
        <Header />
      </div>

    {/* 1. TOP BANNER IMAGE SECTION - Fully Mobile Responsive */}
<motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  /* Mobile (default): h-[200px] ya aspect-video (auto height)
     Tablet (sm): h-[300px]
     Desktop (md): h-[450px] 
  */
  className="w-full h-[200px] sm:h-[300px] md:h-[450px] lg:h-[500px] overflow-hidden"
>
  <img 
    src={GIBanner}
    alt="Madhya Pradesh GI Banner" 
    /* object-cover: Image poore area ko cover karegi
       object-center: Image ka center part focus mein rahega
    */
    className="w-full h-full object-cover object-center"
  />
</motion.div>
      <div className="max-w-[1800px] py-12 px-6 md:px-12 mx-auto">
        
        {/* 2. HEADER CONTENT - CENTERED AS REQUESTED */}
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-slate-100"
          >
            <Award className="text-orange-500" size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">GI Tagged</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-[#0B184A] tracking-tighter mb-4"
          >
            Madhya Pradesh's <br/> <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Heritage Products</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 font-medium text-lg max-w-2xl mx-auto mb-10"
          >
            Celebrating the rich cultural and artisanal legacy with Geographical Indication recognition.
          </motion.p>

          {/* Stats Row - Center Aligned */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-12 border-t border-b border-slate-100 py-8 mb-12"
          >
            <div className="text-center">
              <p className="text-4xl font-black text-[#0B184A]">15+</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">GI Products</p>
            </div>
            <div className="w-[1px] h-12 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-4xl font-black text-[#0B184A] flex items-center justify-center gap-2">
                100% <CheckCircle className="text-emerald-500" size={28} />
              </p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authentic</p>
            </div>
          </motion.div>
        </div>

        {/* 3. DYNAMIC COMPACT GRID - CENTERED CARDS */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
        >
          {giProducts.map((product, idx) => {
            const config = themeConfig[product.theme] || themeConfig.emerald;
            return (
              <motion.div
                key={idx}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative overflow-hidden px-5 py-8 rounded-[2.5rem] text-white bg-gradient-to-br ${config.gradient} ${config.shadow} group cursor-pointer h-full min-h-[200px] flex flex-col items-center text-center shadow-lg transition-all`}
              >
                {/* Logo Center Me Bda */}
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl border border-white/30 shadow-inner mb-4 transition-transform group-hover:scale-110">
                  {product.icon}
                </div>

                <div className="flex flex-col items-center flex-grow w-full">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest border border-white/10 mb-3">
                    {product.type}
                  </span>

                  <h3 className="text-lg font-black leading-tight mb-2 tracking-tight line-clamp-2 px-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1.5 text-white/80">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{product.origin}</span>
                  </div>
                </div>

                {/* Subtle Decorative Pattern */}
                <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default GIGalleryFull;