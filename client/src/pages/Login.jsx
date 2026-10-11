import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/UserContext";

const Login = ({ expectedRole = "user" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        import.meta.env.VITE_BASE_URL + "/auth/api/login",
        { email, password }
      );
      if (!res.data?.token || !res.data?.user) {
        throw new Error("The server returned an incomplete login response");
      }
      const accountRole = res.data.user.role || "user";
      if (accountRole !== expectedRole) {
        const message = expectedRole === "admin"
          ? "This account does not have administrator access. Sign in with an admin account."
          : "This is an admin account. Use the Admin sign-in option instead.";
        setError(message);
        toast.error(message);
        return;
      }
      toast.success("Login successful");
      setAuth({ ...auth, user: res.data.user, token: res.data.token });
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate(expectedRole === "admin" ? "/admin/details" : location.state?.from?.pathname || location.state || "/");
    } catch (error) {
      const message = error.response?.data?.error ||
        (error.response
          ? error.message
          : "Cannot reach the server. Start the backend and check its database connection.");
      setError(message);
      toast.error(message);
    }
  };

  return (
    <main className="px-5 py-12 sm:px-8 sm:py-16">
      <div className={`mx-auto grid gap-5 ${expectedRole === "user" ? "max-w-6xl lg:grid-cols-[minmax(0,1fr)_300px]" : "max-w-5xl"}`}>
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">
        <div className="relative hidden min-h-[560px] overflow-hidden bg-slate-900 md:block">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=85" alt="Sunlit mountain lake" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-blue-900/10" />
          <div className="absolute bottom-0 p-10 text-white"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-100">Travel starts here</p><h2 className="mt-3 text-3xl font-bold leading-tight">Your next favourite place is waiting.</h2><p className="mt-3 max-w-sm leading-7 text-white/80">Sign in to keep your stays and plans together.</p></div>
        </div>
        <div className="flex items-center p-7 sm:p-10 lg:p-12">
          <div className="w-full">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">{expectedRole === "admin" ? "Workspace access" : "Welcome back"}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{expectedRole === "admin" ? "Admin sign in" : "Sign in to your account"}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{expectedRole === "admin" ? "Use your administrator account to manage stays and bookings." : "Pick up where you left off and get back to planning."}</p>
            {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <label className="block text-sm font-semibold text-slate-700">Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <div className="flex items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="h-4 w-4 rounded accent-blue-600" />Keep me signed in</label><Link to="/contact" className="font-medium text-blue-700 hover:text-blue-900">Need help?</Link></div>
              <button type="submit" className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-200">Sign in</button>
            </form>
            {expectedRole === "user" && <p className="mt-7 text-center text-sm text-slate-600">New to My Dream Place? <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-900">Create an account</Link></p>}
          </div>
        </div>
      </div>
      {expectedRole === "user" && <aside className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg sm:p-8"><div><span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-lg">✦</span><p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-blue-200">For the people behind the stays</p><h2 className="mt-2 text-2xl font-bold">Administrator access</h2><p className="mt-3 text-sm leading-6 text-slate-300">Manage listings, destinations, and guest bookings from your workspace.</p></div><div className="mt-8"><Link to="/admin-login" className="inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-blue-50">Sign in as admin <span className="ml-2" aria-hidden="true">→</span></Link><p className="mt-3 text-xs leading-5 text-slate-400">Admin access is assigned by the site owner. Traveler accounts can’t grant themselves admin permissions.</p></div></aside>}
      </div>
    </main>
  );
};

export default Login;
