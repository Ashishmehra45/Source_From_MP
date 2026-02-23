import React from 'react';
import { 
  FaLinkedinIn, 
  FaTwitter, 
  FaFacebookF, 
  FaGlobeAsia, // ✅ Fixed: 'FaGlobeCentralAsia' ko 'FaGlobeAsia' se badal diya
  FaCheckCircle, 
  FaComments,
  FaFileContract,
  FaShieldAlt,
  FaCookieBite
} from "react-icons/fa";

function Footer() {
  return (
    <div>
      <footer className="w-full bg-slate-900 text-white mt-24 py-20 px-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h4 className="font-black text-2xl tracking-tighter ">
              Madhya Pradesh <span className="text-blue-500 underline decoration-2 underline-offset-4">PORTAL</span>
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              An initiative of Federation of Indian Export Organisations (FIEO). The apex body of government recognized export organizations in India.
            </p>
          </div>

          <div className="space-y-6 text-sm font-bold text-slate-400">
             <h5 className="text-white uppercase tracking-widest text-xs border-b border-slate-800 pb-2">Marketplace</h5>
             <p className="hover:text-white cursor-pointer transition flex items-center gap-3 group">
               <FaGlobeAsia className="group-hover:text-blue-400 transition" /> Browse GI Products
             </p>
             <p className="hover:text-white cursor-pointer transition flex items-center gap-3 group">
               <FaCheckCircle className="group-hover:text-green-400 transition" /> Verified Suppliers
             </p>
             <p className="hover:text-white cursor-pointer transition flex items-center gap-3 group">
               <FaComments className="group-hover:text-yellow-400 transition" /> B2B Enquiries
             </p>
          </div>

          <div className="space-y-6 text-sm font-bold text-slate-400">
             <h5 className="text-white uppercase tracking-widest text-xs border-b border-slate-800 pb-2">Policies</h5>
             <p className="hover:text-white cursor-pointer transition flex items-center gap-3 group">
               <FaFileContract className="group-hover:text-blue-400 transition" /> Trade Policy 2026
             </p>
             <p className="hover:text-white cursor-pointer transition flex items-center gap-3 group">
               <FaShieldAlt className="group-hover:text-blue-400 transition" /> Privacy & Compliance
             </p>
             <p className="hover:text-white cursor-pointer transition flex items-center gap-3 group">
               <FaCookieBite className="group-hover:text-orange-400 transition" /> Cookie Settings
             </p>
          </div>

          <div className="space-y-6">
             <h5 className="text-white uppercase tracking-widest text-xs mb-4">Connect with FIEO</h5>
             <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition flex items-center justify-center text-lg shadow-lg shadow-black/20">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-sky-500 transition flex items-center justify-center text-lg shadow-lg shadow-black/20">
                  <FaTwitter />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-lg shadow-lg shadow-black/20">
                  <FaFacebookF />
                </a>
             </div>
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest pt-4">
               © 2026 FIEO India | MP Chapter
             </p>
          </div>

        </div>
      </footer>
    </div>
  )
}

export default Footer;