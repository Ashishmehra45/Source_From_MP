import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import GIGalleryFull from "../pages/Gi";
import ODOP from "../pages/ODOP";
import ExporterRegistration from "../pages/seller_Dashbord/Register";
import Login from "../pages/seller_Dashbord/Login";
import SellerDashboard from "../pages/seller_Dashbord/SellerDashbord";

// ✅ Step 1: ProtectedRoute ko import kar (path check kar lena)
import ProtectedRoute from "../components/ProtectedRoute"; // Agar components folder me banaya hai

function Approutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/gi" element={<GIGalleryFull />} />
      <Route path="/odop" element={<ODOP />} />
      <Route path="/register" element={<ExporterRegistration />} />
      <Route path="/login" element={<Login />} />
      
     
      <Route 
        path="/seller/dashboard" 
        element={
          <ProtectedRoute>
            <SellerDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default Approutes;