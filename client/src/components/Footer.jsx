import logo from "../assets/logo (2).png";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkClass = "text-slate-600 transition hover:text-blue-700";
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" aria-label="My Dream Place home"><img src={logo} alt="My Dream Place" className="h-9 w-auto" /></Link>
            <p className="mt-4 max-w-xs leading-6 text-slate-600">Your next go-to companion for discovering places and planning memorable stays.</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Company</h2>
            <ul className="mt-4 space-y-3">
              <li><Link className={linkClass} to="/about">About us</Link></li>
              <li><Link className={linkClass} to="/activities">Travel inspiration</Link></li>
              <li><Link className={linkClass} to="/contact">Contact and help</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Explore</h2>
            <ul className="mt-4 space-y-3">
              <li><Link className={linkClass} to="/discover">Destinations</Link></li>
              <li><Link className={linkClass} to="/search">Find a stay</Link></li>
              <li><Link className={linkClass} to="/activities">Trip ideas</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Your account</h2>
            <ul className="mt-4 space-y-3">
              <li><Link className={linkClass} to="/login">Sign in</Link></li>
              <li><Link className={linkClass} to="/register">Create an account</Link></li>
              <li><Link className={linkClass} to="/cart">Saved trips</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">Explore the world with My Dream Place.</div>
      </div>
    </footer>
  );
};

export default Footer;
