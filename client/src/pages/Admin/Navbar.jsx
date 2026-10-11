import { FaUser, FaPlus, FaList, FaFolder, FaMap } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const navbarMenu = [
  { name: "Admin details", link: "/admin/details", icon: <FaUser /> },
  { name: "Create stay", link: "/admin/create-post", icon: <FaPlus /> },
  { name: "All stays", link: "/admin/all-post", icon: <FaList /> },
  { name: "Categories", link: "/admin/create-category", icon: <FaFolder /> },
  { name: "Bookings", link: "/admin/all-booking", icon: <FaMap /> },
];

const Navbar = () => (
  <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-3 lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:p-5">
    <p className="hidden px-3 pb-3 text-xs font-bold uppercase tracking-[.18em] text-slate-400 lg:block">Workspace</p>
    {navbarMenu.map((item) => <NavLink key={item.link} to={item.link} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><span className="text-base">{item.icon}</span>{item.name}</NavLink>)}
  </nav>
);

export default Navbar;
