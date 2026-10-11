import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Clear error and submit form
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/api/register`,
        {
          name,
          email,
          password,
        }
      );
      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.error ||
        (err.response
          ? "Registration failed. Please try again."
          : "Cannot reach the server. Start the backend and check its database connection.");
      setError(message);
      toast.error(message);
      console.error(err);
    }
  };

  return (
    <main className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-slate-900 md:block">
          <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85" alt="Mountain lake surrounded by forest" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-blue-900/10" />
          <div className="absolute bottom-0 p-10 text-white"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-100">Make it a trip to remember</p><h2 className="mt-3 text-3xl font-bold leading-tight">Find a stay that feels like yours.</h2><p className="mt-3 max-w-sm leading-7 text-white/80">Save the places you love and make planning your next escape a little easier.</p></div>
        </div>
        <div className="flex items-center p-7 sm:p-10 lg:p-12">
          <div className="w-full">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Join the journey</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Save stays and keep your travel plans close at hand.</p>
            {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">Your name<input type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <label className="block text-sm font-semibold text-slate-700">Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <label className="block text-sm font-semibold text-slate-700">Password<input type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <button type="submit" className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-200">Create account</button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-900">Sign in</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
