import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import GIGalleryFull from "../pages/Gi";
import ODOP from "../pages/ODOP";
import ExporterRegistration from "../pages/seller_Dashbord/Register";
import Login from "../pages/seller_Dashbord/Login";
import SellerDashboard from "../pages/seller_Dashbord/SellerDashbord";

function Approutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/gi" element={<GIGalleryFull />} />
      <Route path="/odop" element={<ODOP />} />
      <Route path="/register" element={<ExporterRegistration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
    </Routes>
  );
}

export default Approutes;
