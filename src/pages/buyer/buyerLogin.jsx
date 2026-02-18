import React, { useState } from 'react';
import api from '../../api/axios'; 
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../../components/Header'; 

const BuyerLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data } = await api.post("/buyers/login", formData); 

        if (data && data.token) {
            // 🧹 STEP 1: Purana Seller data delete karo (Conflict hatane ke liye)
            localStorage.removeItem('sellerToken'); 
            localStorage.removeItem('sellerInfo');

            // 🔐 STEP 2: Buyer data save karo
            const buyerData = { 
                ...data, 
                role: data.role || 'buyer' 
            };

            localStorage.setItem('buyerToken', data.token);
            localStorage.setItem('buyerInfo', JSON.stringify(buyerData));

            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome back, ${data.name || 'buyer'}!`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // ✅ Spelling check: 'Dashboard' vs 'Dashbord'
                navigate('/buyer/dashboard');
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        const backendError = error.response?.data?.message || "Invalid Email or Password";
        Swal.fire({ title: 'Login Failed', text: backendError, icon: 'error' });
    } finally {
        setLoading(false);
    }
};

// ... baaki component same rahega ...
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="sticky top-0 z-[100] shadow-sm">
                <Header />
            </div>

            <div className="flex flex-col items-center justify-center p-6 mt-16">
                
                {/* Text Section */}
                <div className="text-center mb-10 max-w-2xl">
                    <h1 className="text-4xl font-extrabold text-[#000F29] mb-4">
                        Welcome Back to <span className="text-blue-600">Source From MP</span>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">
                        Login to access your personalized dashboard, manage sourcing interests, 
                        and connect with verified exporters.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-14 w-full max-w-lg border border-gray-50 mb-10">
                    <h2 className="text-[#000F29] text-2xl font-black mb-10 flex items-center tracking-tight">
                        <span className="w-1.5 h-8 bg-blue-600 mr-4 rounded-full"></span>
                        BUYER LOGIN
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Field */}
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">Business Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="email@domain.com" 
                                required
                                className="bg-[#F4F7FA] p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 font-medium placeholder:text-gray-300 transition-all" 
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-bold text-gray-600 uppercase ml-1 tracking-widest">Password</label>
                                <Link to="/forgot-password" size="xs" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                            </div>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="********" 
                                required
                                className="bg-[#F4F7FA] p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 font-medium placeholder:text-gray-300 transition-all" 
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-[#001D4C] text-white py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Login Securely'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ✅ UPDATED BOTTOM SECTION */}
                <div className="mb-20 text-center">
                    <p className="text-[11px] font-bold text-dark-600 tracking-[0.25em] uppercase mb-2">
                        Don't have an account?  <Link to="/buyer/register" className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs hover:underline">
                        Register Now
                    </Link>
                    </p>
                   
                </div>
            </div>
        </div>
    );
};

export default BuyerLogin;