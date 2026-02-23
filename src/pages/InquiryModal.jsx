import React from "react";
import { 
  FaBarcode, FaWhatsapp, FaBox, FaPaperPlane, 
  FaTimes, FaChevronDown, FaLayerGroup, FaGlobeAsia // 👈 Isse change kar diya
} from "react-icons/fa";
import Header from "../components/Header";

const InquiryModal = ({ onClose }) => {
  // Static Dummy Data for Preview
  const product = {
    name: "Premium Chanderi Silk Saree",
    category: "Sarees & Ethnic Wear",
    hsCode: "5007.20",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600",
    origin: "Chanderi, Madhya Pradesh"
  };

  return (
    <div className=" flex flex-col items-center justify-center ">
        <Header />
      {/* Main Container */}
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500 border border-white/50">
        
        {/* --- 🟦 LEFT PANEL: Product Showcase --- */}
        <div className="md:w-5/12 bg-[#0B184A] relative p-8 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <FaLayerGroup /> Product Details
            </div>
            
            <div className="aspect-square w-full rounded-[32px] overflow-hidden border-4 border-white/10 shadow-2xl mb-8 group">
              <img 
                src={product.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt="Product Preview"
              />
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-2">{product.name}</h2>
            <p className="text-blue-200/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               <FaGlobeAsia className="text-blue-400" /> {product.origin}
            </p>
          </div>

          <div className="mt-12 space-y-3 relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-blue-200/40 text-[10px] font-black uppercase tracking-tighter">Category</span>
              <span className="text-white text-xs font-bold uppercase tracking-wider">{product.category}</span>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-500/20">
              <span className="text-blue-100/60 text-[10px] font-black uppercase tracking-tighter">HS Code</span>
              <span className="text-white text-xs font-black tracking-[0.2em]">{product.hsCode}</span>
            </div>
          </div>
        </div>

        {/* --- ⬜ RIGHT PANEL: Business Form --- */}
        <div className="md:w-7/12 p-8 md:p-12 relative">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 text-gray-300 hover:text-[#0B184A] transition-colors p-2"
          >
            <FaTimes size={24} />
          </button>

          <div className="mb-10">
            <h3 className="text-[#0B184A] text-3xl font-black tracking-tighter">Send Inquiry</h3>
            <p className="text-gray-400 text-sm mt-1 font-medium italic">Fill in your requirements for a direct merchant response.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0B184A] uppercase tracking-widest ml-1">Quantity Needed</label>
                <div className="relative">
                  <FaBox className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={12}/>
                  <input 
                    type="text" 
                    placeholder="e.g. 500 Units"
                    className="w-full bg-gray-50 border-b-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#0B184A] transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0B184A] uppercase tracking-widest ml-1">Inquiry Type</label>
                <div className="relative">
                  <select className="w-full bg-gray-50 border-b-2 border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-[#0B184A] outline-none appearance-none cursor-pointer focus:border-[#0B184A]">
                    <option>Bulk Order</option>
                    <option>Sample Request</option>
                    <option>Price Quote</option>
                  </select>
                  <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0B184A]/30 pointer-events-none" size={10} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-[#0B184A] uppercase tracking-widest">WhatsApp Contact</label>
                <span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic">Recommended</span>
              </div>
              <div className="relative">
                <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={16}/>
                <input 
                  type="text" 
                  placeholder="+91 00000 00000"
                  className="w-full bg-gray-50 border-b-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#0B184A] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0B184A] uppercase tracking-widest ml-1">Detailed Requirements</label>
              <textarea 
                rows="5"
                className="w-full bg-gray-50 border-b-2 border-gray-100 rounded-3xl p-6 text-sm font-medium resize-none outline-none focus:border-[#0B184A] transition-all placeholder:text-gray-300"
                placeholder="I would like to discuss bulk pricing and shipping timelines for this specific product..."
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                className="group w-full bg-[#0B184A] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-900 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                Send Official Inquiry 
                <FaPaperPlane size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;