import React from "react";
import { useAuth } from "../../context/UserContext";

const UserDetails = () => {
  const [auth] = useAuth();
  const user = {
    name: auth?.user?.name || "N/A",
    email: auth?.user?.email || "N/A",
  };

  return (
    <section className="min-w-0 flex-1 p-6 sm:p-10 lg:p-12">
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Account overview</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your profile</h1>
      <p className="mt-2 text-slate-600">Your account details, all in one place.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Full name</span><p className="mt-2 break-words font-semibold text-slate-900">{user.name}</p></div>
        <div className="rounded-2xl bg-slate-50 p-5"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email address</span><p className="mt-2 break-words font-semibold text-slate-900">{user.email}</p></div>
      </div>
    </section>
  );
};

export default UserDetails;
