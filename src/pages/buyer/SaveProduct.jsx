import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; // ✅ Added for SweetAlert
import { X, ArrowRight } from "lucide-react"; // ✅ Added for Modal Icons
import {
  FaHeart,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaShoppingBag,
  FaSpinner,
  FaTrashAlt,
} from "react-icons/fa";

const SavedItems = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const BACKEND_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://source-from-mp-backend.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("buyerToken");
    const userInfo = JSON.parse(localStorage.getItem("buyerInfo"));

    if (!token || !userInfo || userInfo.role !== "buyer") {
      navigate("/buyer/login");
      return;
    }

    const fetchSavedItems = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/buyers/saved-items");
        setSavedItems(data);
      } catch (error) {
        console.error("Error fetching saved items:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, [navigate]);

  const removeSavedItem = async (productId) => {
    try {
      await api.post(`/buyers/toggle-save/${productId}`);
      setSavedItems(savedItems.filter((item) => item._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ==========================================
  // 🔥 INQUIRY FORM LOGIC
  // ==========================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const buyerData = JSON.parse(localStorage.getItem("buyerInfo"));

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
        Swal.fire("Success!", "Your inquiry has been sent to the seller.", "success");
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

  // ✅ Check pending inquiry after login
  useEffect(() => {
    const pendingProductId = localStorage.getItem("pendingInquiryProductId");
    const buyerData = localStorage.getItem("buyerInfo");

    if (pendingProductId && buyerData && savedItems.length > 0) {
      const product = savedItems.find((p) => p._id === pendingProductId);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
        localStorage.removeItem("pendingInquiryProductId");
      }
    }
  }, [savedItems]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white text-[#001D4C]">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="sticky top-0 z-[50] shadow-sm">
        <Header />
      </div>

      {/* --- 📝 INQUIRY MODAL OVERLAY --- */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            {/* LEFT PANEL */}
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
                {selectedProduct.description || "Standard export quality product."}
              </p>
              <div className="mt-auto bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  HS Code
                </p>
                <p className="text-sm font-mono font-bold text-[#0B184A]">
                  {selectedProduct.hscode || selectedProduct.hsCode || "Not Specified"}
                </p>
              </div>
            </div>

            {/* RIGHT PANEL: FORM */}
            <div className="flex-1 p-8 md:p-10 bg-white relative overflow-y-auto max-h-[85vh]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-[#0B184A]">Send Inquiry</h2>
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
                    isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 active:scale-[0.98]"
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

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/buyer/dashboard")}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#001D4C] shadow-sm hover:shadow-md border border-gray-100"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[#000F29] tracking-tight">
                Saved Items
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                {savedItems.length} Products in wishlist
              </p>
            </div>
          </div>
        </div>

        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedItems.map(
              (product) =>
                product && (
                  <div
                    key={product._id}
                    className="bg-white rounded-[40px] shadow-md border border-gray-50 p-5 flex flex-col group hover:shadow-2xl transition-all duration-500 relative h-full"
                  >
                    {/* --- 🖼️ Image Section --- */}
                    <div className="bg-[#F4F7FA] h-48 rounded-[30px] mb-5 flex items-center justify-center overflow-hidden relative">
                      <img
                        src={
                          product.images?.[0] || product.image 
                            ? product.images?.[0] || product.image 
                            : "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300";
                        }}
                      />

                      {/* 🟢 Live Pulse Badge for Consistency */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-gray-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Live</span>
                      </div>

                      {/* 🗑️ Removal Logic (Untouched as requested) */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => removeSavedItem(product._id)}
                          className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </div>

                    {/* --- 📝 Content Section --- */}
                    <div className="px-2 flex-grow flex flex-col">
                      <span className="text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] mb-2 block">
                        {product.category || "General"}
                      </span>
                      
                      <h3 className="text-[#000F29] text-lg font-black mb-1 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-400 text-[10px] mb-3 font-bold uppercase tracking-wider">
                        <FaMapMarkerAlt className="mr-1 text-blue-500" />{" "}
                        {product.location || "MP, India"}
                      </div>

                      {/* Description without cutting */}
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-auto pb-4">
                        {product.description || "Premium export-ready product from the heart of India."}
                      </p>
                    </div>

                    {/* --- 🚀 Action Footer (Price replaced with HS Code) --- */}
                    <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-50 px-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          HS Code
                        </span>
                        <span className="font-mono font-bold text-slate-700 text-sm">
                          {product.hscode || "---"}
                        </span>
                      </div>
                      
                      {/* 🔥 INQUIRY MODAL TRIGGER */}
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="bg-[#001D4C] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10"
                      >
                        <FaShoppingBag size={12} /> Enquire
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[50px] p-20 text-center shadow-sm border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300 text-4xl">
              <FaHeart />
            </div>
            <h2 className="text-2xl font-black text-[#000F29] mb-2">
              Wishlist is Empty
            </h2>
            <Link
              to="/products"
              className="bg-[#001D4C] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg inline-block mt-4"
            >
              Explore Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedItems;