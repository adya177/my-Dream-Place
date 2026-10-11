import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/UserContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const navItems = [["Home", "/"], ["Discover", "/discover"], ["Activities", "/activities"], ["About", "/about"], ["Contact", "/contact"]];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const redirectDashboard = () => {
    setIsDropdownOpen(false);
    navigate(auth?.user?.role === "admin" ? "/admin/details" : "/user");
  };

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    setIsDropdownOpen(false);
    toast.success("Logout Successfully");
    navigate("/");
  };

  const navLinkClass = ({ isActive }) => `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${isActive ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-slate-950"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 py-3 sm:px-8 lg:px-10">
        <Link to="/" aria-label="My Dream Place home" className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <BrandLogo />
        </Link>
        <div className="order-3 flex w-full items-center gap-1 overflow-x-auto rounded-full bg-slate-100 p-1 pb-1 md:order-2 md:w-auto">
          {navItems.map(([label, to]) => <NavLink key={to} to={to} end={to === "/"} className={navLinkClass}>{label}</NavLink>)}
        </div>
        <div className="relative order-2 flex items-center gap-2 md:order-3">
          <Link to="/search" className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:inline-flex">Find a stay</Link>
          <button type="button" aria-label="Open saved trips" onClick={() => navigate("/cart")} className="rounded-full p-2 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            <IoIosHeartEmpty size={22} />
          </button>
          <button type="button" aria-label="Open profile menu" aria-expanded={isDropdownOpen} onClick={() => setIsDropdownOpen((open) => !open)} className="rounded-full bg-slate-100 p-2.5 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            <FaUser size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
              <button type="button" className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50" onClick={redirectDashboard}>Your profile</button>
              {auth?.user ? (
                <button type="button" className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50" onClick={handleLogout}>Sign out</button>
              ) : (
                <button type="button" className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50" onClick={() => { setIsDropdownOpen(false); navigate("/login"); }}>Sign in</button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
