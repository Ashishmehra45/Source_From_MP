import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Swal from "sweetalert2"; // ✅ Added for SweetAlert
import { X } from "lucide-react"; // ✅ Added for Modal Close
import {
  FaUserCircle,
  FaBoxOpen,
  FaHeart,
  FaMapMarkerAlt,
  FaComments,
  FaArrowRight,
  FaStar,
  FaSignOutAlt,
  FaSpinner,
  FaRegHeart,
  FaHashtag,
} from "react-icons/fa";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]); // 🔥 Real State
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("buyerToken");
    localStorage.removeItem("buyerInfo");
    navigate("/buyer/login");
  };

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
        // Optional: Update enquiries count immediately
        const { data: latestEnquiries } = await api.get("/buyers/my-enquiries");
        setEnquiries(latestEnquiries);
      }
    } catch (error) {
      console.error("Inquiry Error:", error);
      const msg = error.response?.data?.message || "Failed to send inquiry";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("buyerToken");
    const userInfo = JSON.parse(localStorage.getItem("buyerInfo"));

    if (!token || !userInfo || userInfo.role !== "buyer") {
      handleLogout();
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Profile load karo
        const { data: profileData } = await api.get("/buyers/profile");
        setBuyer(profileData);

        // 2. Saved Items load karo
        const { data: savedItemsData } = await api.get("/buyers/saved-items");
        setSavedProducts(savedItemsData);

        // 3. 🔥 REAL ENQUIRIES LOAD KARO
        const { data: enquiryData } = await api.get("/buyers/my-enquiries");
        setEnquiries(enquiryData);

        // 4. Recommendations
        if (profileData.interests?.length > 0) {
          setProdLoading(true);
          const { data: products } = await api.get("/buyers/recommendations", {
            params: { categories: profileData.interests.join(",") },
          });
          setRecommendedProducts(products);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
        setProdLoading(false);
      }
    };

    fetchDashboardData();

    // Polling for real-time updates
    const intervalId = setInterval(async () => {
      try {
        const { data: latestEnquiries } = await api.get("/buyers/my-enquiries");
        setEnquiries(latestEnquiries);
      } catch (error) {
        console.error("Background Inquiries Fetch Error:", error);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [navigate]);

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
                  {!isSubmitting && <FaArrowRight size={14} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* --- Welcome Card --- */}
        <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-gray-50 flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#001D4C] text-4xl shadow-inner">
              <FaUserCircle />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                Verified Buyer
              </p>
              <h1 className="text-3xl font-black text-[#000F29]">
                Welcome, {buyer?.name}!
              </h1>
              <div className="flex items-center text-gray-500 text-sm mt-1 font-medium">
                <FaMapMarkerAlt className="mr-2 text-blue-500" /> {buyer?.city},{" "}
                {buyer?.country}
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <button className="bg-[#001D4C] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg">
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 border-2 border-red-50 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[40px] shadow-lg p-8 border border-gray-50">
              <h2 className="text-[#000F29] text-xl font-black mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-blue-600 mr-3 rounded-full"></span>{" "}
                YOUR INTERESTS
              </h2>
              <div className="flex flex-wrap gap-2">
                {buyer?.interests?.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-lg p-8 border border-gray-50">
              <h2 className="text-[#000F29] text-xl font-black mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-green-500 mr-3 rounded-full"></span>{" "}
                DASHBOARD STATS
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 font-bold text-gray-600 text-sm">
                    <FaComments className="text-green-500" />{" "}
                    <Link to="/buyer/inquiries">My Enquiries</Link>
                  </div>
                  <span className="text-xl font-black text-[#001D4C]">
                    {enquiries.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 font-bold text-gray-600 text-sm">
                    <FaStar className="text-yellow-500" />{" "}
                    <Link to="/buyer/saved-items">Saved Items</Link>
                  </div>
                  <span className="text-xl font-black text-[#001D4C]">
                    {savedProducts?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Recommended Products */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-[#000F29] text-3xl font-black tracking-tight">
                    Recommended For You
                  </h2>
                  <p className="text-gray-400 text-sm font-medium mt-1">
                    Based on your interests
                  </p>
                </div>
                <Link
                  to="/products"
                  className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline flex items-center"
                >
                  Explore More <FaArrowRight className="ml-2 text-[10px]" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prodLoading ? (
                  <div className="col-span-2 text-center py-20">
                    <FaSpinner className="animate-spin inline mr-3 text-blue-600" />{" "}
                    Finding best matches...
                  </div>
                ) : recommendedProducts.length > 0 ? (
                  recommendedProducts.map((product) => {
                    const isSaved = savedProducts.some(
                      (p) => p._id === product._id,
                    );

                    return (
                      <div
                        key={product._id}
                        className="bg-white rounded-[40px] shadow-md border border-gray-50 p-6 flex flex-col group hover:shadow-2xl transition-all duration-500"
                      >
                        {/* --- Image Section --- */}
                        <div className="bg-[#F4F7FA] h-52 rounded-[30px] mb-5 flex items-center justify-center overflow-hidden relative">
                          <img
                            src={
                              product.image
                                ? product.image.startsWith("http")
                                  ? product.image
                                  : `${BACKEND_URL}/${product.image}`
                                : "https://via.placeholder.com/300"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Live Badge like your dashboard */}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-gray-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                              Live
                            </span>
                          </div>

                          <div className="absolute top-4 right-4">
                            <button
                              onClick={() => toggleSaveProduct(product)}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                                isSaved
                                  ? "bg-red-50 text-red-500"
                                  : "bg-white/80 text-gray-400"
                              }`}
                            >
                              {isSaved ? <FaHeart /> : <FaRegHeart />}
                            </button>
                          </div>
                        </div>

                        {/* --- Content Section --- */}
                        <div className="flex-1 px-1">
                          <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
                            {product.category || "General"}
                          </span>

                          <h3 className="text-[#000F29] text-xl font-black mb-2 truncate group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-slate-500 text-xs font-medium leading-relaxed mb-auto ">
                            {product.description ||
                              "Premium quality export-ready product from Madhya Pradesh."}
                          </p>
                        </div>

                        {/* --- Footer Section (Price removed, HS Code added) --- */}
                        <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              HS Code
                            </span>
                            <span className="font-mono font-bold text-slate-700 text-sm italic">
                              {product.hscode || product.hsCode || "---"}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="bg-[#000F29] text-white px-7 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                          >
                            Enquire Now
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 bg-white p-12 text-center text-gray-400 rounded-[40px] border border-dashed border-gray-200">
                    No products found for your interests.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;