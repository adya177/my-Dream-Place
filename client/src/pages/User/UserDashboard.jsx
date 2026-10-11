import React from "react";
import Navbar from "./Navbar";
import UserDetails from "./UserDetails";

const UserDashboard = () => {
  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-8 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:flex">
        <Navbar />
        <UserDetails />
      </div>
    </main>
  );
};

export default UserDashboard;
