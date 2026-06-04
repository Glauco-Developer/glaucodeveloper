"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const pins = [
  { label: "Ireland", lat: 53.4, lng: -8.2 },
  { label: "United Kingdom", lat: 51.5, lng: -0.13 },
  { label: "Belgium", lat: 50.85, lng: 4.35 },
  { label: "Switzerland", lat: 46.8, lng: 8.2 },
  { label: "United States", lat: 38.8, lng: -96.0 },
  { label: "Brazil", lat: -14.2, lng: -51.9 },
]

const DARK_TILES =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
const LIGHT_TILES =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

function makeIcon(label: string, isDark: boolean) {
  const dot = isDark ? "#f0f0f0" : "#0a0a0a"
  const ring = isDark ? "rgba(240,240,240,0.13)" : "rgba(10,10,10,0.1)"
  const bg = isDark ? "rgba(6,6,6,0.62)" : "rgba(255,255,255,0.72)"
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"
  const text = isDark ? "#d4d4d4" : "#2a2a2a"

  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;pointer-events:none">
        <div style="
          width:10px;height:10px;border-radius:50%;
          background:${dot};
          box-shadow:0 0 0 5px ${ring},0 0 12px 2px ${ring};
        "></div>
        <div style="
          padding:3px 9px;border-radius:99px;
          background:${bg};border:1px solid ${border};
          font-size:9px;font-family:ui-monospace,monospace;
          letter-spacing:0.14em;text-transform:uppercase;
          color:${text};white-space:nowrap;
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
        ">${label}</div>
      </div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })
}

export function MapClient() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    setIsDark(html.classList.contains("dark"))

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"))
    })
    observer.observe(html, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <MapContainer
      center={[44, -28]}
      zoom={4}
      minZoom={2}
      maxZoom={8}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={true}
      className="h-full w-full"
      style={{ background: isDark ? "#060606" : "#f0efe9" }}
    >
      <TileLayer
        key={isDark ? "dark" : "light"}
        url={isDark ? DARK_TILES : LIGHT_TILES}
        attribution='&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OSM</a>'
        subdomains="abcd"
        maxZoom={20}
      />
      {pins.map((pin) => (
        <Marker
          key={pin.label}
          position={[pin.lat, pin.lng]}
          icon={makeIcon(pin.label, isDark)}
        />
      ))}
    </MapContainer>
  )
}
