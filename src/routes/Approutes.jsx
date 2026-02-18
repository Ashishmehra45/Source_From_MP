import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import GIGalleryFull from "../pages/Gi";
import ODOP from "../pages/ODOP";
import ExporterRegistration from "../pages/seller_Dashbord/Register";
import Login from "../pages/seller_Dashbord/Login";
import SellerDashboard from "../pages/seller_Dashbord/SellerDashbord";

// ✅ Step 1: ProtectedRoute ko import kar (path check kar lena)
import ProtectedRoute from "../components/ProtectedRoute"; // Agar components folder me banaya hai
import BuyerRegister from "../pages/buyer/BuyerRegister";
import BuyerLogin from "../pages/buyer/buyerLogin"; // Buyer login page import karna
import BuyerDashboard from "../pages/buyer/BuyerDashbord"; // Buyer dashboard page import karna

function Approutes() {
  return (
    <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/gi" element={<GIGalleryFull />} />
  <Route path="/odop" element={<ODOP />} />
  <Route path="/seller/register" element={<ExporterRegistration />} />
  <Route path="/seller/login" element={<Login />} />

  <Route path="/buyer/register" element={<BuyerRegister />} />
  <Route path="/buyer/login" element={<BuyerLogin />} />

  {/* ✅ BUYER DASHBOARD - Role added */}
  <Route
    path="/buyer/dashboard"
    element={
      <ProtectedRoute role="buyer">
        <BuyerDashboard />
      </ProtectedRoute>
    }
  />

  {/* ✅ SELLER DASHBOARD - Role added */}
  <Route
    path="/seller/dashboard"
    element={
      <ProtectedRoute role="seller">
        <SellerDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
  );
}

export default Approutes;
