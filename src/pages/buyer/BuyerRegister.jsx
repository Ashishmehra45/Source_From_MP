import React, { useState } from 'react';
import api from '../../api/axios'; 
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // ✅ Swal import kiya
import Header from '../../components/Header'; 

const BuyerRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        country: '',
        state: '',
        city: '',
        interests: []
    });

    const productCategories = [
        "Sarees & Ethnic Wear", "Textiles & Fabrics", "Apparel & Garments",
        "Agriculture & Grains", "Spices & Condiments", "Fruits & Vegetables",
        "Handicrafts & Decor", "Leather & Footwear", "Gems & Jewellery",
        "Herbal & Ayurveda", "Processed Food", "Engineering Goods", "Other"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInterestChange = (category) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(category)
                ? prev.interests.filter(i => i !== category)
                : [...prev.interests, category]
        }));
    };

    const handleSubmit = async () => {
        // Step 2 validation check
        if (formData.interests.length === 0) {
            return toast.error("Please select at least one interest!");
        }

        setLoading(true);
        try {
            const { data } = await api.post("/buyers/register", formData);
            
            // ✅ Success SweetAlert
            Swal.fire({
                title: 'Registration Successful!',
                text: 'Welcome to Source From MP. Please login to continue.',
                icon: 'success',
                confirmButtonColor: '#001D4C',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/buyer/login');
                }
            });

        } catch (error) {
            console.log("❌ Backend Error Detail:", error.response?.data);
            
            // 🔥 Error SweetAlert (600 Bad Request handle karne ke liye)
            const backendError = error.response?.data?.message || "Something went wrong. Please check all fields.";
            
            Swal.fire({
                title: 'Error!',
                text: backendError,
                icon: 'error',
                confirmButtonColor: '#d33',
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="sticky top-0 z-[100] shadow-sm">
                <Header />
            </div>

            <div className="flex flex-col items-center justify-center p-6 mt-10">
                <div className="text-center mb-10 max-w-2xl">
                    <h1 className="text-4xl font-extrabold text-[#000F29] mb-4">
                        Grow Your Business with <span className="text-blue-600">Source From Madhya Pradesh</span>
                    </h1>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Join thousands of global buyers sourcing authentic products directly from Madhya Pradesh. 
                    </p>
                </div>

                {/* Stepper UI */}
                <div className="flex items-center mb-12 w-full max-w-md justify-between relative px-4">
                    <div className="flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= 1 ? 'bg-[#001D4C] text-white' : 'bg-white text-gray-600 border'}`}>1</div>
                        <span className="text-[10px] uppercase mt-2 font-bold tracking-widest text-[#001D4C]">Identity</span>
                    </div>
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-0"></div>
                    <div className="flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step === 2 ? 'bg-[#001D4C] text-white' : 'bg-white text-gray-600 border'}`}>2</div>
                        <span className="text-[10px] uppercase mt-2 font-bold tracking-widest text-gray-600">Verification</span>
                    </div>
                </div>

                {/* Main Registration Card */}
                <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-14 w-full max-w-4xl border border-gray-50 mb-10">
                    <h2 className="text-[#000F29] text-2xl font-black mb-10 flex items-center tracking-tight">
                        <span className="w-1.5 h-8 bg-blue-600 mr-4 rounded-full"></span>
                        {step === 1 ? 'COMPANY IDENTITY' : 'LOCATION & INTERESTS'}
                    </h2>

                    {step === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Malwa Textiles" className="bg-[#F4F7FA] p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 font-medium" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">Authorized Person</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="bg-[#F4F7FA] p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 font-medium" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">Business Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" className="bg-[#F4F7FA] p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 font-medium" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">Create Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="********" className="bg-[#F4F7FA] p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 font-medium" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">Country</label>
                                    <input type="text" name="country" placeholder="e.g. India" value={formData.country} onChange={handleChange} className="bg-[#F4F7FA] p-4 rounded-xl outline-none border-none focus:ring-2 focus:ring-blue-100" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">State</label>
                                    <input type="text" name="state" placeholder="e.g. MP" value={formData.state} onChange={handleChange} className="bg-[#F4F7FA] p-4 rounded-xl outline-none border-none focus:ring-2 focus:ring-blue-100" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-gray-600 uppercase mb-2 ml-1 tracking-widest">City</label>
                                    <input type="text" name="city" placeholder="e.g. Bhopal" value={formData.city} onChange={handleChange} className="bg-[#F4F7FA] p-4 rounded-xl outline-none border-none focus:ring-2 focus:ring-blue-100" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-600 uppercase mb-5 block tracking-widest underline underline-offset-8">What are you looking for?</label>
                                <div className="flex flex-wrap gap-3">
                                    {productCategories.map(cat => (
                                        <button 
                                            key={cat} 
                                            type="button"
                                            onClick={() => handleInterestChange(cat)} 
                                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${formData.interests.includes(cat) ? 'bg-[#001D4C] text-white border-[#001D4C] shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-600'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-14 flex justify-between items-center w-full">
                        <div className="flex-1">
                            {step === 2 && (
                                <button onClick={() => setStep(1)} className="text-gray-600 font-bold uppercase tracking-widest text-xs hover:text-[#001D4C] transition-colors">
                                    ← Back to Identity
                                </button>
                            )}
                        </div>
                        
                        <div className="flex-none">
                            {step === 1 ? (
                                <button 
                                    onClick={() => setStep(2)} 
                                    className="bg-[#001D4C] text-white px-12 py-4 rounded-2xl font-bold flex items-center hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 uppercase tracking-[0.15em] text-xs"
                                >
                                    Continue <span className="ml-3 text-lg">→</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={loading} 
                                    className="bg-[#001D4C] text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 uppercase tracking-[0.15em] text-xs disabled:opacity-50"
                                >
                                    {loading ? 'Creating Account...' : 'Finish Registration'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-20">
                    <p className="text-[11px] font-bold text-gray-600 tracking-[0.25em] uppercase">
                        Already have an account? <Link to="/buyer/login" className="text-blue-600 ml-2 hover:underline font-black">Login Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BuyerRegister;