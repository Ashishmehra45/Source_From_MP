import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; 
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header'; 
import { FaUserCircle, FaBoxOpen, FaHeart, FaMapMarkerAlt, FaComments, FaArrowRight, FaStar } from 'react-icons/fa';

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const [buyer, setBuyer] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ DUMMY DATA FOR ENQUIRIES (Same as before)
    const dummyEnquiries = [
        {
            _id: '1',
            productName: 'Chanderi Silk Saree',
            sellerName: 'Malwa Textiles',
            status: 'replied',
            createdAt: '2026-02-15T10:00:00Z'
        },
        {
            _id: '2',
            productName: 'Organic Wheat Grains',
            sellerName: 'MP Agro Farms',
            status: 'pending',
            createdAt: '2026-02-17T08:30:00Z'
        }
    ];

    // ✅ DUMMY DATA FOR RECOMMENDATIONS (Same as before)
    const dummyRecommendations = [
        {
            _id: '101',
            name: 'Handcrafted Teak Wood Decor',
            category: 'Handicrafts & Decor',
            price: '2,500',
            location: 'Bhopal, MP',
            images: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=500']
        },
        {
            _id: '102',
            name: 'Premium Sharbati Wheat',
            category: 'Agriculture & Grains',
            price: '1,800',
            location: 'Sehore, MP',
            images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=500']
        }
    ];

    useEffect(() => {
        // ✅ FIX 1: Dono cheezein check karo - Token aur Info
        const token = localStorage.getItem('buyerToken');
        const userInfo = JSON.parse(localStorage.getItem('buyerInfo'));

        // 🚨 Role Verification: Strict security check
        if (!token || !userInfo || userInfo.role !== 'buyer') {
            console.log("Unauthorized access to Buyer Dashboard, redirecting...");
            localStorage.removeItem('buyerToken'); 
            localStorage.removeItem('buyerInfo'); 
            navigate('/buyer/login', { replace: true });
            return;
        }

        const fetchProfile = async () => {
            try {
                // ✅ FIX 2: Use explicitly retrieved buyerToken for API call
                const { data } = await api.get('/buyers/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                }); 
                setBuyer(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Agar token expire ho gaya ho (401)
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('buyerToken');
                    localStorage.removeItem('buyerInfo');
                    navigate('/buyer/login', { replace: true });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="sticky top-0 z-[100] shadow-sm">
                <Header />
            </div>

            <main className="max-w-7xl mx-auto p-6 md:p-10">
                
                {/* --- Welcome Section --- */}
                <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-gray-50 flex flex-col md:flex-row justify-between items-center mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#001D4C] text-4xl shadow-inner">
                            <FaUserCircle />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Buyer Account</p>
                            <h1 className="text-3xl font-black text-[#000F29]">Welcome, {buyer?.name || 'Guest Buyer'}!</h1>
                            <div className="flex items-center text-gray-500 text-sm mt-1 font-medium">
                                <FaMapMarkerAlt className="mr-2 text-blue-500" /> {buyer?.city || 'Bhopal'}, {buyer?.country || 'India'}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 flex gap-4">
                        <button className="bg-[#001D4C] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg shadow-blue-100">
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* --- Left Column --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[40px] shadow-lg p-8 border border-gray-50">
                            <h2 className="text-[#000F29] text-xl font-black mb-6 flex items-center">
                                <span className="w-1.5 h-6 bg-blue-600 mr-3 rounded-full"></span>
                                YOUR INTERESTS
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {(buyer?.interests?.length > 0 ? buyer.interests : ["Agriculture & Grains", "Textiles & Fabrics"]).map((interest, index) => (
                                    <span key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] shadow-lg p-8 border border-gray-50">
                            <h2 className="text-[#000F29] text-xl font-black mb-6 flex items-center">
                                <span className="w-1.5 h-6 bg-green-500 mr-3 rounded-full"></span>
                                DASHBOARD STATS
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3 font-bold text-gray-600 text-sm">
                                        <FaComments className="text-green-500" /> Enquiries
                                    </div>
                                    <span className="text-xl font-black text-[#001D4C]">{dummyEnquiries.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3 font-bold text-gray-600 text-sm">
                                        <FaStar className="text-yellow-500" /> Saved Items
                                    </div>
                                    <span className="text-xl font-black text-[#001D4C]">12</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column --- */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* RECOMMENDED PRODUCTS */}
                        <section>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-[#000F29] text-3xl font-black tracking-tight">Recommended For You</h2>
                                    <p className="text-gray-400 text-sm font-medium mt-1">Based on your sourcing interests</p>
                                </div>
                                <Link to="/products" className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline flex items-center">
                                    Explore More <FaArrowRight className="ml-2 text-[10px]" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {dummyRecommendations.map((product) => (
                                    <div key={product._id} className="bg-white rounded-[40px] shadow-md border border-gray-50 p-6 flex flex-col group hover:shadow-2xl transition-all duration-500">
                                        <div className="bg-[#F4F7FA] h-52 rounded-[30px] mb-5 flex items-center justify-center overflow-hidden relative">
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 right-4">
                                                <button className="w-10 h-10 bg-white/80 backdrop-blur-md text-gray-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-colors shadow-sm">
                                                    <FaHeart />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{product.category}</p>
                                        <h3 className="text-[#000F29] text-lg font-bold mb-1 truncate">{product.name}</h3>
                                        <div className="flex items-center text-gray-400 text-xs mb-4 font-bold">
                                            <FaMapMarkerAlt className="mr-1 text-blue-500" /> {product.location}
                                        </div>
                                        <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-50">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting Price</p>
                                                <span className="text-[#000F29] font-black text-lg">₹ {product.price}</span>
                                            </div>
                                            <button className="bg-gray-100 text-[#001D4C] px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#001D4C] hover:text-white transition-all">
                                                Enquire
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* RECENT ENQUIRIES */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-[#000F29] text-2xl font-black tracking-tight">Recent Enquiries</h2>
                                <button className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-blue-600">History</button>
                            </div>
                            <div className="space-y-4">
                                {dummyEnquiries.map((enq) => (
                                    <div key={enq._id} className="bg-white p-5 rounded-[30px] border border-gray-50 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-[#F4F7FA] rounded-2xl flex items-center justify-center text-gray-300">
                                                <FaBoxOpen className="text-xl" />
                                            </div>
                                            <div>
                                                <h4 className="text-[#000F29] font-bold text-sm">{enq.productName}</h4>
                                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">To: {enq.sellerName}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] ${enq.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {enq.status}
                                            </span>
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