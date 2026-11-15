import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const knownCities = {
  sydney: [-33.8688, 151.2093], "byron bay": [-28.6474, 153.602], kyoto: [35.0116, 135.7681], tokyo: [35.6762, 139.6503],
  "lake tekapo": [-44.0047, 170.477], queenstown: [-45.0312, 168.6626], santorini: [36.3932, 25.4615], chania: [35.5138, 24.018],
  ubud: [-8.5069, 115.2625], paris: [48.8566, 2.3522], maldives: [4.1755, 73.5093], ravello: [40.6494, 14.6113],
  london: [51.5072, -0.1276], bangalore: [12.9716, 77.5946], bengaluru: [12.9716, 77.5946], delhi: [28.6139, 77.209], mumbai: [19.076, 72.8777],
  newyork: [40.7128, -74.006], "new york": [40.7128, -74.006], rome: [41.9028, 12.4964], "los angeles": [34.0522, -118.2437],
};
const geocodeCache = new Map();
const priceIcon = (price) => L.divIcon({ className: "stay-price-pin-wrap", html: `<span class="stay-price-pin">₹${Number(price || 0).toLocaleString("en-IN")}</span>`, iconSize: [1, 1], iconAnchor: [0, 18] });
const cityName = (value = "") => value.split(",")[0].trim();
const keyName = (value = "") => cityName(value).toLowerCase();

async function resolveStay(stay) {
  if (Number.isFinite(Number(stay.latitude)) && Number.isFinite(Number(stay.longitude))) return [Number(stay.latitude), Number(stay.longitude)];
  const key = keyName(stay.hotelLocation);
  const normalized = key.replace(/\s+/g, "");
  if (knownCities[key] || knownCities[normalized]) return knownCities[key] || knownCities[normalized];
  if (!key) return null;
  if (!geocodeCache.has(key)) geocodeCache.set(key, fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(key)}&count=1&language=en&format=json`).then((response) => response.ok ? response.json() : null).then((data) => data?.results?.[0] ? [data.results[0].latitude, data.results[0].longitude] : null).catch(() => null));
  return geocodeCache.get(key);
}

function MapViewport({ pins }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 1) map.setView(pins[0].position, 11, { animate: true });
    else if (pins.length > 1) map.fitBounds(L.latLngBounds(pins.map((pin) => pin.position)), { padding: [36, 36], maxZoom: 11, animate: true });
  }, [map, pins]);
  return null;
}

export default function StayMap({ stays, checkIn, checkOut }) {
  const [coordinates, setCoordinates] = useState({});
  const [geocoding, setGeocoding] = useState(false);
  useEffect(() => {
    let active = true;
    const missing = stays.filter((stay) => coordinates[stay._id] === undefined);
    if (!missing.length) return undefined;
    setGeocoding(true);
    Promise.all(missing.map(async (stay) => [stay._id, await resolveStay(stay)]))
      .then((entries) => { if (active) setCoordinates((current) => ({ ...current, ...Object.fromEntries(entries) })); })
      .finally(() => active && setGeocoding(false));
    return () => { active = false; };
  }, [stays, coordinates]);
  const pins = useMemo(() => stays.flatMap((stay) => coordinates[stay._id] ? [{ stay, position: coordinates[stay._id] }] : []), [coordinates, stays]);
  const dateParams = new URLSearchParams();
  if (checkIn) dateParams.set("checkIn", checkIn);
  if (checkOut) dateParams.set("checkOut", checkOut);
  const center = pins[0]?.position || [20, 0];
  return <div className="stay-map" aria-label="Interactive map with hotel price markers"><MapContainer center={center} zoom={2} scrollWheelZoom className="stay-map__canvas"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapViewport pins={pins} />{pins.map(({ stay, position }) => <Marker key={stay._id} position={position} icon={priceIcon(stay.price)}><Popup><div className="stay-map-popup"><strong>{stay.title}</strong><span>₹{Number(stay.price || 0).toLocaleString("en-IN")} / night</span><Link to={`/product/${stay.slug}${dateParams.size ? `?${dateParams}` : ""}`}>View stay</Link></div></Popup></Marker>)}</MapContainer>{!pins.length && <div className="stay-map__status">{geocoding ? "Locating stays on the map…" : "No locations could be mapped for these stays."}</div>}<small className="stay-map__attribution">Map data &copy; OpenStreetMap</small></div>;
}
