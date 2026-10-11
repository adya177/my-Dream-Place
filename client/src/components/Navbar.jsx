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
  console.log("This is the auth user", auth?.user);


  // Redirect logic
  const redirectDashboard = (e) => {
    e.stopPropagation();
    if (auth?.user?.role === "admin") {
      navigate("/admin/details");
    } else {
      navigate("/user");
    }
  };


  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };


  // Close dropdown when mouse leaves
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };


  // Handle logout logic
  const handleLogout = () => {
