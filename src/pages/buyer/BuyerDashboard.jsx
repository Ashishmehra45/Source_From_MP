import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  FaUserCircle, FaBoxOpen, FaHeart, FaMapMarkerAlt, FaComments,
  FaArrowRight, FaStar, FaSignOutAlt, FaSpinner, FaRegHeart, FaHashtag
} from "react-icons/fa";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]); // 🔥 Real state from DB
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(false);

  // 🚨 Backend URL logic
  const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://source-from-mp-backend.onrender.com";

  const dummyEnquiries = [
    { _id: "1", productName: "Chanderi Silk Saree", sellerName: "Malwa Textiles", status: "replied", createdAt: "2026-02-15T10:00:00Z" },
    { _id: "2", productName: "Organic Wheat Grains", sellerName: "MP Agro Farms", status: "pending", createdAt: "2026-02-17T08:30:00Z" },
  ];

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
        const { data: profileData } = await api.get("/buyers/profile");
        setBuyer(profileData);

        const { data: savedItemsData } = await api.get("/buyers/saved-items");
        setSavedProducts(savedItemsData);

        if (profileData.interests && profileData.interests.length > 0) {
          setProdLoading(true);
          const { data: products } = await api.get("/buyers/recommendations", {
            params: { categories: profileData.interests.join(",") },
          });
          setRecommendedProducts(products);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        if (error.response?.status === 401) handleLogout();
      } finally {
        setLoading(false);
        setProdLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white text-[#001D4C]">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="sticky top-0 z-[100] shadow-sm">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* --- Welcome Card --- */}
        <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-gray-50 flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#001D4C] text-4xl shadow-inner">
              <FaUserCircle />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Verified Buyer</p>
              <h1 className="text-3xl font-black text-[#000F29]">Welcome, {buyer?.name}!</h1>
              <div className="flex items-center text-gray-500 text-sm mt-1 font-medium">
                <FaMapMarkerAlt className="mr-2 text-blue-500" /> {buyer?.city}, {buyer?.country}
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <button className="bg-[#001D4C] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg">Edit Profile</button>
            <button onClick={handleLogout} className="bg-white text-red-600 border-2 border-red-50 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"><FaSignOutAlt /> Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[40px] shadow-lg p-8 border border-gray-50">
              <h2 className="text-[#000F29] text-xl font-black mb-6 flex items-center"><span className="w-1.5 h-6 bg-blue-600 mr-3 rounded-full"></span> YOUR INTERESTS</h2>
              <div className="flex flex-wrap gap-2">
                {buyer?.interests?.map((interest, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">{interest}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-lg p-8 border border-gray-50">
              <h2 className="text-[#000F29] text-xl font-black mb-6 flex items-center"><span className="w-1.5 h-6 bg-green-500 mr-3 rounded-full"></span> DASHBOARD STATS</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 font-bold text-gray-600 text-sm"><FaComments className="text-green-500" /> Enquiries</div>
                  <span className="text-xl font-black text-[#001D4C]">{dummyEnquiries.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 font-bold text-gray-600 text-sm"><FaStar className="text-yellow-500" /> <Link to="/buyer/saved-items">Saved Items</Link></div>
                  <span className="text-xl font-black text-[#001D4C]">{savedProducts?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-[#000F29] text-3xl font-black tracking-tight">Recommended For You</h2>
                  <p className="text-gray-400 text-sm font-medium mt-1">Based on your interests</p>
                </div>
                <Link to="/products" className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline flex items-center"> <Link to="/products">Explore More</Link>  <FaArrowRight className="ml-2 text-[10px]" /></Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prodLoading ? (
                  <div className="col-span-2 text-center py-20 text-gray-400 font-bold tracking-widest uppercase text-xs">
                    <FaSpinner className="animate-spin inline mr-3 text-blue-600" /> Finding best matches...
                  </div>
                ) : recommendedProducts.length > 0 ? (
                  recommendedProducts.map((product) => {
                    const isSaved = savedProducts.some((p) => p._id === product._id);
                    return (
                      <div key={product._id} className="bg-white rounded-[40px] shadow-md border border-gray-50 p-6 flex flex-col group hover:shadow-2xl transition-all duration-500">
                        <div className="bg-[#F4F7FA] h-52 rounded-[30px] mb-5 flex items-center justify-center overflow-hidden relative">
                          <img
                            src={product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${BACKEND_URL}/${product.images[0]}`) : product.image ? (product.image.startsWith('http') ? product.image : `${BACKEND_URL}/${product.image}`) : "https://via.placeholder.com/300"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                          />
                          <div className="absolute top-4 right-4">
                            <button 
                                onClick={() => toggleSaveProduct(product)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${isSaved ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
                            >
                              {isSaved ? <FaHeart /> : <FaRegHeart />}
                            </button>
                          </div>
                        </div>

                        {/* --- Category & HS Code --- */}
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.category}</p>
                           {product.hscode && (
                             <span className="bg-gray-100 text-gray-500 text-[12px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                               <FaHashtag size={8}/> HS: {product.hscode}
                             </span>
                           )}
                        </div>

                        <h3 className="text-[#000F29] text-lg font-bold mb-1 truncate">{product.name}</h3>
                        
                        <div className="flex items-center text-gray-400 text-xs mb-3 font-bold">
                          <FaMapMarkerAlt className="mr-1 text-blue-500" /> {product.location || "MP, India"}
                        </div>

                        {/* --- Description (Line Clamp 2) --- */}
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 italic">
                          {product.description || "Authentic high-quality product sourced directly from the heart of Madhya Pradesh."}
                        </p>

                        <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-50">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting Price</p>
                            <span className="text-[#000F29] font-black text-lg">₹ {product.price}</span>
                          </div>
                          <button className="bg-gray-100 text-[#001D4C] px-5 py-3 rounded-xl font-bold text-[10px] uppercase hover:bg-[#001D4C] hover:text-white transition-all">Enquire</button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 bg-white p-12 rounded-[40px] border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold italic text-sm">No products found matching your current interests.</div>
                )}
              </div>
            </section>

            {/* Recent Enquiries */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#000F29] text-2xl font-black tracking-tight">Recent Enquiries</h2>
                <button className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-blue-600">History</button>
              </div>
              <div className="space-y-4">
                {dummyEnquiries.map((enq) => (
                  <div key={enq._id} className="bg-white p-5 rounded-[30px] border border-gray-50 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#F4F7FA] rounded-2xl flex items-center justify-center text-gray-300"><FaBoxOpen className="text-xl" /></div>
                      <div>
                        <h4 className="text-[#000F29] font-bold text-sm">{enq.productName}</h4>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">To: {enq.sellerName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] ${enq.status === "replied" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>{enq.status}</span>
                      <span className="text-[10px] text-gray-300 mt-2 font-bold">{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;