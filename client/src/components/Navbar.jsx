import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import logo from "../assets/logo (2).png";
import { useAuth } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosHeartEmpty } from "react-icons/io";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const redirectDashboard = (e) => {
    e.stopPropagation();
    navigate(auth?.user?.role === "admin" ? "/admin/details" : "/user");
  };

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <nav className="grid grid-cols-[1fr_auto] items-center gap-y-3 p-4 md:flex md:justify-between">
      <Link to="/" aria-label="My Dream Place home" className="flex items-center space-x-2">
        <img src={logo} alt="My Dream Place" className="ml-0 md:ml-[7rem]" />
      </Link>
      <div className="col-span-2 row-start-2 flex justify-center gap-x-4 text-xs sm:text-sm md:col-span-1 md:row-auto md:gap-x-6 md:text-base">
        <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
        <Link to="/discover" className="text-gray-600 hover:text-gray-900">Discover</Link>
        <Link to="/activities" className="text-gray-600 hover:text-gray-900">Activities</Link>
        <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
        <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
      </div>
      <div className="relative col-start-2 row-start-1 mr-0 flex items-center space-x-4 md:mr-[9rem] md:row-auto">
        <button type="button" aria-label="Open saved trips" onClick={() => navigate("/cart")} className="cursor-pointer">
          <IoIosHeartEmpty size={20} />
        </button>
        <button type="button" aria-label="Open profile menu" onClick={() => setIsDropdownOpen((open) => !open)} className="cursor-pointer">
          <FaUser size={20} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 top-8 z-50 w-48 rounded border border-gray-200 bg-white shadow-lg" onMouseLeave={() => setIsDropdownOpen(false)}>
            <ul>
              <li className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={redirectDashboard}>Your Profile</li>
              {auth?.user ? (
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>Sign Out</li>
              ) : (
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={() => navigate("/login")}>Sign In</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
