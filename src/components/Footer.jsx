import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="w-full bg-slate-900 text-white mt-24 py-20 px-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h4 className="font-black text-2xl tracking-tighter italic">Madhya Pradesh PORTAL</h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              An initiative of Federation of Indian Export Organisations (FIEO). The apex body of government recognized export organizations in India.
            </p>
          </div>
          <div className="space-y-6 text-sm font-bold text-slate-400">
             <h5 className="text-white uppercase tracking-widest text-xs">Marketplace</h5>
             <p className="hover:text-white cursor-pointer transition">Browse GI Products</p>
             <p className="hover:text-white cursor-pointer transition">Verified Suppliers</p>
             <p className="hover:text-white cursor-pointer transition">B2B Enquiries</p>
          </div>
          <div className="space-y-6 text-sm font-bold text-slate-400">
             <h5 className="text-white uppercase tracking-widest text-xs">Policies</h5>
             <p className="hover:text-white cursor-pointer transition">Trade Policy 2026</p>
             <p className="hover:text-white cursor-pointer transition">Privacy & Compliance</p>
             <p className="hover:text-white cursor-pointer transition">Cookie Settings</p>
          </div>
          <div className="space-y-6">
             <h5 className="text-white uppercase tracking-widest text-xs mb-4">Connect with FIEO</h5>
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition cursor-pointer"></div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition cursor-pointer"></div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition cursor-pointer"></div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
