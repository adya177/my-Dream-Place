import logo from "../assets/logo (2).png";
import { Link } from "react-router-dom";

const groups = [
  { title: "Company", links: [["About us", "/about"], ["Travel inspiration", "/activities"], ["Contact and help", "/contact"]] },
  { title: "Explore", links: [["Destinations", "/discover"], ["Find a stay", "/search"], ["Trip ideas", "/activities"]] },
  { title: "Your account", links: [["Sign in", "/login"], ["Create an account", "/register"], ["Saved trips", "/cart"]] },
];

const Footer = () => (
  <footer className="mt-20 border-t border-slate-200 bg-white">
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label="My Dream Place home" className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            <img src={logo} alt="My Dream Place" className="h-10 w-auto" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">Your companion for discovering places and planning memorable stays.</p>
          <Link to="/search" className="mt-5 inline-flex font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Find your next stay <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.links.map(([label, to]) => <li key={to + label}><Link className="inline-flex rounded text-sm text-slate-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" to={to}>{label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} My Dream Place</span>
        <span>Explore the world, one stay at a time.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
