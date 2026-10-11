import { useId } from "react";

const BrandLogo = ({ className = "", compact = false }) => {
  const gradientId = `dream-place-mark-${useId().replace(/:/g, "")}`;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 44 44" aria-hidden="true" className="h-10 w-10 shrink-0 drop-shadow-sm">
        <defs><linearGradient id={gradientId} x1="5" y1="4" x2="39" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#1d4ed8"/></linearGradient></defs>
        <rect x="1" y="1" width="42" height="42" rx="14" fill={`url(#${gradientId})`} />
        <path d="M22 8.5c-6.1 0-11 4.8-11 10.8 0 8 11 16.2 11 16.2s11-8.2 11-16.2c0-6-4.9-10.8-11-10.8Z" fill="white" fillOpacity=".97" />
        <circle cx="22" cy="19.5" r="4.1" fill="#2563eb" />
        <path d="m14.4 30.4 3.2-2.1 2.5 1.2 2.4-1.2 3 2.1-5.5 3.5-5.6-3.5Z" fill="#bfdbfe" />
      </svg>
      {!compact && <span className="flex flex-col leading-none"><span className="text-[17px] font-extrabold tracking-tight text-slate-900">my dream place</span><span className="mt-1 text-[9px] font-bold uppercase tracking-[.22em] text-blue-600">stay curious</span></span>}
    </span>
  );
};

export default BrandLogo;
