import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaShoppingBag,
  FaSpinner,
  FaTrashAlt,
} from "react-icons/fa";

const SavedItems = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const token = localStorage.getItem("buyerToken");
    const userInfo = JSON.parse(localStorage.getItem("buyerInfo"));

    if (!token || !userInfo || userInfo.role !== "buyer") {
      navigate("/buyer/login");
      return;
    }

    const fetchSavedItems = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/buyers/saved-items");
        setSavedItems(data);
      } catch (error) {
        console.error("Error fetching saved items:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, [navigate]);

  const removeSavedItem = async (productId) => {
    try {
      await api.post(`/buyers/toggle-save/${productId}`);
      setSavedItems(savedItems.filter((item) => item._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

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
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/buyer/dashboard")}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#001D4C] shadow-sm hover:shadow-md border border-gray-100"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[#000F29] tracking-tight">
                Saved Items
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                {savedItems.length} Products in wishlist
              </p>
            </div>
          </div>
        </div>

        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedItems.map(
              (product) =>
                product && (
                  <div
                    key={product._id}
                    className="bg-white rounded-[40px] shadow-md border border-gray-50 p-5 flex flex-col group hover:shadow-2xl transition-all duration-500 relative"
                  >
                    <div className="bg-[#F4F7FA] h-48 rounded-[30px] mb-5 flex items-center justify-center overflow-hidden relative">
                      <img
                        // 🔥 Dashboard wala exact logic: Pehle images check karo, fir image
                        src={
                          product.images?.[0] || product.image // Pehle plural check karo, fir singular
                            ? product.images?.[0] || product.image // Jo bhi mil jaye wo uthao
                            : "https://via.placeholder.com/300" // Warna placeholder
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300";
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => removeSavedItem(product._id)}
                          className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="px-2 flex-grow">
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-[#000F29] text-lg font-bold mb-1 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center text-gray-400 text-xs mb-4 font-bold">
                        <FaMapMarkerAlt className="mr-1 text-blue-500" />{" "}
                        {product.location || "MP, India"}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-50 px-2">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Price
                        </p>
                        <span className="text-[#000F29] font-black text-lg">
                          ₹ {product.price}
                        </span>
                      </div>
                      <button className="bg-[#001D4C] text-white px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase hover:bg-blue-900 transition-all flex items-center gap-2">
                        <FaShoppingBag /> Enquire
                      </button>
                    </div>
                  </div>
                ),
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[50px] p-20 text-center shadow-sm border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300 text-4xl">
              <FaHeart />
            </div>
            <h2 className="text-2xl font-black text-[#000F29] mb-2">
              Wishlist is Empty
            </h2>
            <Link
              to="/products"
              className="bg-[#001D4C] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg inline-block mt-4"
            >
              Explore Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedItems;
