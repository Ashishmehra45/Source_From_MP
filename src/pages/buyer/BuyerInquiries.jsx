import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  FaBoxOpen, FaSpinner, FaArrowLeft, FaComments, FaCalendarAlt, FaInfoCircle
} from "react-icons/fa";

const BuyerInquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL logic for images
  const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://source-from-mp-backend.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("buyerToken");
    const userInfo = JSON.parse(localStorage.getItem("buyerInfo"));

    if (!token || !userInfo || userInfo.role !== "buyer") {
      navigate("/buyer/login");
      return;
    }

    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/buyers/my-enquiries");
        setEnquiries(data);
      } catch (error) {
        console.error("Fetch Enquiries Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC] text-[#001D4C]">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <div className="sticky top-0 z-[100] shadow-sm">
        <Header />
      </div>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* --- Top Navigation & Title --- */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/buyer/dashboard" className="inline-flex items-center text-gray-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[#000F29] tracking-tight flex items-center gap-3">
              <FaComments className="text-blue-500" /> My Inquiries
            </h1>
            <p className="text-gray-400 text-sm font-medium mt-2">Track the status of all your product inquiries</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <span className="text-xl font-black text-[#001D4C]">{enquiries.length}</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Total Sent</span>
          </div>
        </div>

        {/* --- Inquiries List --- */}
        <div className="space-y-6">
          {enquiries.length > 0 ? (
            enquiries.map((enq) => (
              <div key={enq._id} className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Product Image */}
                <div className="w-full md:w-48 h-40 bg-[#F4F7FA] rounded-[20px] flex items-center justify-center overflow-hidden shrink-0 border border-gray-50">
                  {enq.productImage ? (
                    <img 
                      src={enq.productImage.startsWith('http') ? enq.productImage : `${BACKEND_URL}/${enq.productImage}`} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                      alt={enq.productName} 
                    />
                  ) : (
                    <FaBoxOpen className="text-4xl text-gray-300" />
                  )}
                </div>

                {/* Inquiry Details */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
                    <h3 className="text-xl font-black text-[#000F29]">{enq.productName}</h3>
                    
                    {/* Status Badge */}
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      enq.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : 
                      enq.status === "Closed" ? "bg-slate-100 text-slate-500 border-slate-200" : 
                      "bg-orange-50 text-orange-500 border-orange-200"
                    }`}>
                      {enq.status || "Pending"}
                    </span>
                  </div>

                  {/* Quantity & Date */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <FaBoxOpen className="text-blue-500" /> Qty Req: <span className="text-[#001D4C]">{enq.quantity}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <FaCalendarAlt className="text-blue-500" /> {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Message Sent */}
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100 relative">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <FaInfoCircle /> Your Message
                    </p>
                    <p className="text-sm text-gray-600  leading-relaxed">
                      "{enq.message}"
                    </p>
                  </div>

                  {/* WhatsApp/Email info (Optional) */}
                  <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-medium text-gray-400 flex gap-4">
                     <p>Provided Contact: <span className="text-gray-600 font-bold">{enq.email}</span></p>
                     {enq.whatsapp && <p>WhatsApp: <span className="text-gray-600 font-bold">{enq.whatsapp}</span></p>}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white p-16 rounded-[40px] text-center border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
              <FaComments className="text-6xl text-gray-200 mb-4" />
              <h2 className="text-xl font-black text-[#000F29] mb-2">No Inquiries Found</h2>
              <p className="text-gray-400 text-sm font-medium mb-6">You haven't sent any product inquiries to sellers yet.</p>
              <Link to="/products" className="bg-[#001D4C] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg">
                Explore Products
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuyerInquiries;