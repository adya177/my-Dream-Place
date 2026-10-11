import { FaUser, FaClipboardList } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const navbarMenu = [
  { name: "Profile", link: "/user", icon: <FaUser /> },
  { name: "Your orders", link: "/user/your-order", icon: <FaClipboardList /> },
];

const Navbar = () => (
  <nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-3 lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:p-5">
    <p className="hidden px-3 pb-3 text-xs font-bold uppercase tracking-[.18em] text-slate-400 lg:block">Your account</p>
    {navbarMenu.map((item) => <NavLink key={item.link} to={item.link} end={item.link === "/user"} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><span className="text-base">{item.icon}</span>{item.name}</NavLink>)}
  </nav>
);

export default Navbar;
