const BrandLogo = ({ className = "", compact = false }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-11 w-11 shrink-0">
      <rect x="1" y="1" width="46" height="46" rx="15" fill="#122A3A" />
      <circle cx="31.5" cy="14.5" r="3.6" fill="#E7B96A" />
      <path d="M12.5 35V22a11.5 11.5 0 0 1 23 0v13" fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16.5 29.3c3.5-2 6.1-2 9.3 0 2.3 1.5 4.1 1.7 6.2.8M16.5 33.1c3.4-1.7 6.1-1.7 9.1 0 2.1 1.2 4.2 1.3 6.4.4" fill="none" stroke="#85D0CA" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m12.5 17.1 1.1 2.4 2.5 1.1-2.5 1.1-1.1 2.5-1.1-2.5-2.5-1.1 2.5-1.1 1.1-2.4Z" fill="#E7B96A" />
    </svg>
    {!compact && <span className="flex flex-col leading-none"><span className="text-[17px] font-extrabold tracking-[-.04em] text-slate-900">my dream place</span><span className="mt-1.5 text-[8px] font-bold uppercase tracking-[.2em] text-slate-500">Stays · stories · places</span></span>}
  </span>
);

export default BrandLogo;
