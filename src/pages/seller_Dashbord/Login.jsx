import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, MapPin, LogIn, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Loading Alert
    Swal.fire({
      title: 'Verifying...',
      text: 'Checking your credentials',
      allowOutsideClick: false,
      didOpen: () => { 
        Swal.showLoading(); 
      }
    });

    try {
      const response = await api.post('/sellers/login', formData);

      if (response.status === 200) {
        
        // 🚨 FIX: Token ka naam change kiya 'token' -> 'sellerToken'
        localStorage.setItem('sellerToken', response.data.token); 
        localStorage.setItem('companyName', response.data.companyName);
        
        // 2. Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: `Logged in as ${response.data.companyName}`,
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Go to Dashboard',
          timer: 2000,
          timerProgressBar: true
        }).then((result) => {
          navigate('/seller/dashboard');
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || "Invalid Email or Password",
        confirmButtonColor: '#0B184A'
      });
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans overflow-x-hidden">
      <div className="sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-sm">
        <Header />
      </div>

      <div className="max-w-md mx-auto mb-20 md:pt-24 px-6">
        
        {/* --- BRANDING HEADER --- */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            <MapPin size={14} className="text-blue-600" />
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest text-center">Official Trade Portal of MP</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0B184A] tracking-tighter uppercase">
            Portal <span className="text-blue-600">Login</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2 italic">Access your exporter dashboard</p>
        </div>

        {/* --- LOGIN FORM BOX --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden"
        >
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-50"></div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[12px] font-black uppercase text-slate-400 ml-1 tracking-widest">Registered Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  required 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none transition-all shadow-inner" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[12px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                <Link to="/forgot-password" size={14} className="text-blue-600 text-[10px] font-black uppercase hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  required 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none transition-all shadow-inner" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 bg-[#0B184A] shadow-blue-100 hover:bg-blue-600 mt-4"
            >
              Sign In <LogIn size={18} />
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                New to the portal? {' '}
                <Link to="/seller/register" className="text-blue-600 hover:underline">Register Now</Link>
              </p>
            </div>

          </form>
        </motion.div>

        {/* Footer Info */}
        <p className="text-center text-slate-400 text-[10px] font-medium mt-10 uppercase tracking-[0.2em]">
          Secure Access • MP Trade Portal • 2026
        </p>
      </div>
    </div>
  );
};

export default Login;