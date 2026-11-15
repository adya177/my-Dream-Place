import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const fromKey = (key) => { const [year, month, day] = key.split("-").map(Number); return new Date(year, month - 1, day); };
const monthLabel = (date) => date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

function Month({ month, monthIndex, checkIn, checkOut, preview, disabledDates, onPick, onHover, onPointerStart, onPointerEnd, dragging }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return <section className="range-calendar-month" aria-label={monthLabel(month)}>
    <h3>{monthLabel(month)}</h3>
    <div className="range-calendar-grid range-calendar-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
    <div className="range-calendar-grid">
      {Array.from({ length: offset }, (_, index) => <span key={`blank-${monthIndex}-${index}`} />)}
      {Array.from({ length: days }, (_, index) => {
        const day = index + 1;
        const value = dateKey(new Date(month.getFullYear(), month.getMonth(), day));
        const past = value < dateKey(new Date());
        const pickingCheckout = checkIn && !checkOut && value > checkIn;
        const disabled = past || (disabledDates.has(value) && !pickingCheckout) || (checkIn && !checkOut && value <= checkIn);
        const end = checkOut || preview;
        const inRange = checkIn && end && value > checkIn && value < end;
        const selected = value === checkIn || value === checkOut;
        return <button key={value} type="button" className={`range-calendar-day${selected ? " is-selected" : ""}${inRange ? " is-in-range" : ""}`} disabled={disabled} aria-pressed={selected} aria-label={new Date(month.getFullYear(), month.getMonth(), day).toLocaleDateString(undefined, { dateStyle: "full" })} onPointerDown={(event) => onPointerStart(value, event)} onPointerEnter={() => onHover(value)} onPointerUp={() => onPointerEnd(value)} onClick={(event) => { if (event.detail === 0) onPick(value); }}>{day}</button>;
      })}
    </div>
    {dragging && <span className="sr-only">Drag across dates to select your stay</span>}
  </section>;
}

Month.propTypes = {
  month: PropTypes.instanceOf(Date).isRequired,
  monthIndex: PropTypes.number.isRequired,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  preview: PropTypes.string,
  disabledDates: PropTypes.instanceOf(Set).isRequired,
  onPick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onPointerStart: PropTypes.func.isRequired,
  onPointerEnd: PropTypes.func.isRequired,
  dragging: PropTypes.bool,
};

export default function DateRangePicker({ checkIn, checkOut, onChange, onOpenChange, disabledDates = new Set() }) {
  const [open, setOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [preview, setPreview] = useState("");
  const dragStart = useRef("");
  const monthBase = useMemo(() => {
    const current = checkIn ? fromKey(checkIn) : new Date();
    current.setDate(1);
    current.setMonth(current.getMonth() + monthOffset);
    return current;
  }, [checkIn, monthOffset]);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") { setOpen(false); onOpenChange?.(false); } };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onOpenChange, open]);
  const close = () => { setOpen(false); onOpenChange?.(false); };
  const select = (value) => {
    if (!checkIn || checkOut || value <= checkIn) { onChange(value, ""); setPreview(""); return; }
    onChange(checkIn, value); setPreview(""); close();
  };
  const pointerStart = (value, event) => { if (event.pointerType === "mouse" && event.button !== 0) return; dragStart.current = value; setPreview(value); };
  const pointerEnd = (value) => {
    if (!dragStart.current) return;
    const start = dragStart.current;
    dragStart.current = "";
    if (value > start) { onChange(start, value); setOpen(false); setPreview(""); }
    else select(start);
  };
  const label = checkIn && checkOut
    ? `${fromKey(checkIn).toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${fromKey(checkOut).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
    : checkIn ? `${fromKey(checkIn).toLocaleDateString(undefined, { month: "short", day: "numeric" })} - Add checkout` : "Add dates";
  return <div className="date-range-picker">
    <button type="button" className="date-range-trigger" aria-expanded={open} aria-haspopup="dialog" onClick={() => { const nextOpen = !open; setOpen(nextOpen); onOpenChange?.(nextOpen); }}><CalendarDays size={17} /><span><small>Dates</small><strong>{label}</strong></span></button>
    {open && <><button type="button" className="range-picker-dismiss" aria-label="Close calendar" onClick={close} /><motion.div className="range-calendar-popover" role="dialog" aria-label="Choose check-in and check-out dates" initial={{ opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 28 }}><div className="range-calendar-toolbar"><p>{checkIn && !checkOut ? "Choose a checkout date" : "Select your stay dates"}</p><div><button type="button" className="range-calendar-nav" aria-label="Previous month" disabled={new Date(monthBase.getFullYear(), monthBase.getMonth() - 1, 1) < new Date(new Date().getFullYear(), new Date().getMonth(), 1)} onClick={() => setMonthOffset((value) => value - 1)}><ChevronLeft size={18} /></button><button type="button" className="range-calendar-nav" aria-label="Next month" onClick={() => setMonthOffset((value) => value + 1)}><ChevronRight size={18} /></button><button type="button" className="range-calendar-close" aria-label="Close date picker" onClick={close}><X size={18} /></button></div></div><div className="range-calendar-months">{[0, 1].map((index) => { const month = new Date(monthBase.getFullYear(), monthBase.getMonth() + index, 1); return <Month key={month.toISOString()} month={month} monthIndex={index} checkIn={checkIn} checkOut={checkOut} preview={preview} disabledDates={disabledDates} onPick={select} onHover={(value) => { if (dragStart.current) setPreview(value); }} onPointerStart={pointerStart} onPointerEnd={pointerEnd} dragging={Boolean(dragStart.current)} />; })}</div><div className="range-calendar-legend"><span className="range-calendar-dot" />Dates unavailable for all stays in this search</div></motion.div></>}
  </div>;
}

DateRangePicker.propTypes = {
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onOpenChange: PropTypes.func,
  disabledDates: PropTypes.instanceOf(Set),
};
