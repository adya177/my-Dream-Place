import { FaUser, FaEnvelope } from "react-icons/fa";
import Navbar from "./Navbar";
import { useAuth } from "../../context/UserContext";

const Details = () => {
  const [auth] = useAuth();
  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-8 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:flex">
        <Navbar />
        <section className="min-w-0 flex-1 p-6 sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Admin profile</h1>
          <p className="mt-2 text-slate-600">Manage stays, categories, and guest bookings from the workspace.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><FaUser /></span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Name</p><p className="mt-1 break-words font-semibold text-slate-900">{auth?.user?.name || "Admin"}</p></div></div>
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><FaEnvelope /></span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</p><p className="mt-1 break-words font-semibold text-slate-900">{auth?.user?.email || "—"}</p></div></div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Details;
