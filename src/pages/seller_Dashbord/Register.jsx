import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, FileText, CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, MapPin, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom'; // 1. Link import kiya
import Header from '../../components/Header';
import api from '../../api/axios' // 2. Axios instance import kiya  

const ExporterRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: '',
    authorizedPerson: '',
    mobileNumber: '',
    email: '',
    password: '',
    companyHeritage: '',
    hasIECode: false,
    iecNumber: '',
    exportCountries: ''
  });

  const steps = [{ id: 1, title: "Identity" }, { id: 2, title: "Verification" }];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(2);
  };

  const prevStep = () => setCurrentStep(1);

  const handleUploadClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

 const handleFinalSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Processing...',
      text: 'Creating your exporter profile',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedFile) data.append('catalog', selectedFile);

    try {
      const response = await api.post('/sellers/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        // ✅ Success Alert confirm hone ke baad hi redirect hoga
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Registration Submitted Successfully.',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Login Now' 
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/seller/login'); // Redirect to login
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || "Internal Server Error",
        confirmButtonColor: '#0B184A'
      });
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans overflow-x-hidden">
      <div className="sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-sm">
        <Header />
      </div>

      <div className="max-w-3xl mx-auto pt-8 md:pt-12 px-4 md:px-6">
        
        {/* BRANDING HEADER */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            <MapPin size={14} className="text-blue-600" />
            <span className="text-blue-600 font-black text-[12px] uppercase tracking-widest text-center">Official Trade Portal of MP</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0B184A] tracking-tighter uppercase mb-2">
            Exporter <span className="text-blue-600">Registration</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 italic">Source From MP Global Network</p>
        </div>

        {/* STEPPER COMPONENT */}
        <div className="relative flex justify-between items-center mb-16 max-w-sm mx-auto px-5">
          <div className="absolute top-5 left-5 right-5 h-[2px] bg-slate-200 z-0" />
          <motion.div 
            className="absolute top-5 left-5 h-[2px] z-0 origin-left" 
            initial={{ width: "0%" }}
            animate={{ 
              width: currentStep === 2 ? "calc(100% - 10px)" : "0%", 
              backgroundColor: currentStep === 2 ? "#10b981" : "#0B184A",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <motion.div 
                  animate={{ 
                    backgroundColor: isCompleted ? "#10b981" : (isActive ? "#0B184A" : "#ffffff"),
                    borderColor: isCompleted ? "#10b981" : (isActive ? "#0B184A" : "#e2e8f0"),
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 bg-white transition-all duration-300"
                >
                  {isCompleted ? <CheckCircle2 size={20} className="text-white" /> : <span className={isActive ? "text-white" : "text-slate-400"}>{step.id}</span>}
                </motion.div>
                <motion.span animate={{ color: isActive || isCompleted ? "#0B184A" : "#94a3b8" }} className="absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-center">{step.title}</motion.span>
              </div>
            );
          })}
        </div>

        {/* FORM SECTION */}
        <form onSubmit={handleFinalSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 min-h-[450px] flex flex-col transition-all overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-black text-[#0B184A] border-l-4 border-blue-600 pl-3 uppercase">Company Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5"><label className="text-[12px] font-black uppercase text-slate-400 ml-1">Company Name</label><input required name="companyName" value={formData.companyName} onChange={handleInputChange} type="text" placeholder="e.g. Malwa Textiles" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none shadow-inner" /></div>
                  <div className="space-y-1.5"><label className="text-[12px] font-black uppercase text-slate-400 ml-1">Authorized Person</label><input required name="authorizedPerson" value={formData.authorizedPerson} onChange={handleInputChange} type="text" placeholder="Full Name" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none shadow-inner" /></div>
                  <div className="space-y-1.5"><label className="text-[12px] font-black uppercase text-slate-400 ml-1">Mobile Number</label><input required name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} type="tel" placeholder="+91" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none shadow-inner" /></div>
                  <div className="space-y-1.5"><label className="text-[12px] font-black uppercase text-slate-400 ml-1">Business Email</label><input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="email@domain.com" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none shadow-inner" /></div>
                  <div className="p-1 md:col-span-2"><label className="text-[12px] font-black uppercase text-slate-400 ml-1">Create Password</label><div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input required name="password" value={formData.password} onChange={handleInputChange} type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none shadow-inner" /></div></div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-xl font-black text-[#0B184A] border-l-4 border-blue-600 pl-3 uppercase">Verification</h3>
                <div className="space-y-6">
                  <div className="space-y-1.5"><label className="text-[12px] font-black uppercase text-slate-400">Company Description</label><textarea required name="companyHeritage" value={formData.companyHeritage} onChange={handleInputChange} rows="3" placeholder="Describe legacy..." className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-sm outline-none shadow-inner" /></div>
                  <div className="p-5 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                    <p className="text-[12px] font-black uppercase text-[#0B184A]">You Have a Import Export Code?</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="button" onClick={() => setFormData({...formData, hasIECode: true})} className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase transition-all ${formData.hasIECode === true ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}> Yes, I have IE Code </button>
                      <button type="button" onClick={() => setFormData({...formData, hasIECode: false})} className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase transition-all ${formData.hasIECode === false ? 'bg-[#0B184A] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}> No, Not yet </button>
                    </div>
                    <AnimatePresence>{formData.hasIECode && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 20 }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 overflow-hidden"><input required name="iecNumber" value={formData.iecNumber} onChange={handleInputChange} type="text" placeholder="10-digit IEC Number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none" /><input required name="exportCountries" value={formData.exportCountries} onChange={handleInputChange} type="text" placeholder="Export Countries" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none" /></motion.div>)}</AnimatePresence>
                  </div>
                  <div onClick={handleUploadClick} className={`p-8 border-2 border-dashed rounded-[2rem] text-center transition-all cursor-pointer bg-slate-50 group ${selectedFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-400'}`}>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                    {selectedFile ? (<div className="flex flex-col items-center"><CheckCircle2 className="text-emerald-500 mb-2" size={32} /><p className="font-black text-xs text-[#0B184A] truncate max-w-full px-4">{selectedFile.name}</p><p className="text-[10px] text-emerald-600 font-black uppercase mt-1 italic tracking-widest underline">Attached</p></div>) : (<div className="flex flex-col items-center gap-1"><UploadCloud className="text-slate-300 mb-2" size={36} /><p className="font-black text-[12px] text-slate-400 uppercase tracking-widest">Upload Catalog (PDF/DOC)</p></div>)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER NAVIGATION */}
          <div className="mt-auto pt-8 md:pt-10 flex justify-between items-center border-t border-slate-50 z-10">
            <button type="button" onClick={prevStep} className={`px-6 py-3 rounded-xl border border-slate-200 font-black text-[11px] md:text-[12px] uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2 ${currentStep === 1 ? 'invisible' : 'text-slate-500'}`}>
              <ChevronLeft size={16} /> Back
            </button>
            
            {currentStep === 1 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-[12px] uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 bg-[#0B184A] shadow-blue-100 hover:bg-blue-600"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-[12px] uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700"
              >
                Final Submit <ChevronRight size={16} />
              </button>
            )}
          </div>
        </form>

        {/* 2. LOGIN LINK ADDED HERE */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
            Already have an Account?{' '}
            <Link to="/seller/login" className="text-blue-600 hover:text-blue-800 transition-colors ml-1 decoration-2 hover:underline underline-offset-4">
              Login Now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ExporterRegistration;