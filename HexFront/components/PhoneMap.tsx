"use client"

import { useEffect, useRef } from "react"
import { Globe } from "lucide-react"


interface PhoneGeoData {
  lat: number
  lon: number
  city: string
  state: string
  country: string
  country_code: string
  display_name: string
  address?: string
  postcode?: string
}

interface PhoneMapProps {
  number: string
  formatted: string
  region: string
  carrier: string
  line_type: string
  timezones: string[]
  geo: PhoneGeoData
}

export default function PhoneMap({ number, formatted, region, carrier, line_type, timezones, geo }: PhoneMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (geo?.lat === undefined || geo?.lon === undefined) return

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      let map = mapInstanceRef.current

      if (!map) {
        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        map = L.map(mapRef.current!, {
          center: [geo.lat, geo.lon],
          zoom: (geo.lat === 0 && geo.lon === 0) ? 2 : 14,
          zoomControl: true,
          attributionControl: false,
        })

        mapInstanceRef.current = map

        // Dark tile layer (CartoDB Dark Matter - matches Hex Stalcke theme)
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
        }).addTo(map)
      }

      const isInitial = geo.lat === 0 && geo.lon === 0
      map.setView([geo.lat, geo.lon], isInitial ? 2 : 10)

      // Clear existing markers and circles from previous renders
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          map.removeLayer(layer)
        }
      })

      if (!isInitial) {
        // Custom red marker icon
        const redIcon = L.divIcon({
          html: `
            <div style="
              width: 18px; height: 18px;
              background: #cc0000;
              border: 2px solid #ff4444;
              border-radius: 50%;
              box-shadow: 0 0 12px #cc0000, 0 0 24px rgba(204,0,0,0.5);
              position: relative;
            ">
              <div style="
                width: 6px; height: 6px;
                background: #ff8888;
                border-radius: 50%;
                position: absolute;
                top: 4px; left: 4px;
              "></div>
            </div>
            <div style="
              width: 2px; height: 20px;
              background: linear-gradient(to bottom, #cc0000, transparent);
              margin: 0 auto;
            "></div>
          `,
          className: "",
          iconSize: [18, 38],
          iconAnchor: [9, 38],
          popupAnchor: [0, -40],
        })

        const locationLabel = [geo.city, geo.state, geo.country].filter(Boolean).join(", ")
        const preciseAddress = geo.address || locationLabel

        const marker = L.marker([geo.lat, geo.lon], { icon: redIcon }).addTo(map)
        marker.bindPopup(`
          <div style="
            font-family: monospace;
            background: #0a0a0a;
            border: 1px solid #cc0000;
            border-radius: 6px;
            padding: 8px 12px;
            min-width: 240px;
            color: #e0e0e0;
          ">
            <div style="color: #cc0000; font-weight: bold; font-size: 11px; margin-bottom: 6px;">📱 ALVO LOCALIZADO</div>
            <div style="font-size: 11px; color: #aaa;">${formatted}</div>
            <div style="font-size: 12px; color: #fff; margin-top: 4px; font-weight: bold;">${preciseAddress}</div>
            <div style="font-size: 10px; color: #666; margin-top: 4px;">LAT/LON: ${geo.lat.toFixed(6)}, ${geo.lon.toFixed(6)}</div>
            <div style="font-size: 9px; color: #cc0000; margin-top: 6px; border-top: 1px solid #333; padding-top: 4px;">MÉTODO: ${(geo as any).intercept_method || 'TRIANGULAÇÃO'}</div>
          </div>
        `, {
          className: "hex-popup",
        }).openPopup()

        // Pulse circle effect
        L.circle([geo.lat, geo.lon], {
          radius: 15000,
          color: "#cc0000",
          fillColor: "#cc0000",
          fillOpacity: 0.08,
          weight: 1,
          dashArray: "4 4",
        }).addTo(map)

        L.circle([geo.lat, geo.lon], {
          radius: 40000,
          color: "#cc0000",
          fillColor: "#cc0000",
          fillOpacity: 0.03,
          weight: 0.5,
          dashArray: "2 6",
        }).addTo(map)
      }
    })

    // Return cleanup in a way that doesn't trigger on every re-render
    // Leaflet cleanup on unmount only would be better, but we leave it for now
  }, [geo, formatted])

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const hasCoords = geo?.lat !== undefined && geo?.lon !== undefined && (geo.lat !== 0 || geo.lon !== 0)
  const locationParts = [geo?.city, geo?.state, geo?.country].filter(Boolean)

  return (
    <div className="h-full rounded-xl overflow-hidden border border-red-900/40 bg-[#0a0a0a] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-500 relative min-h-[400px] flex flex-col">
      {/* Radar Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-500/30 rounded-full animate-ping duration-[3000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-red-500/20 rounded-full animate-ping duration-[4000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[400px] bg-gradient-to-t from-red-600 to-transparent origin-bottom animate-[radar_4s_linear_infinite]" />
      </div>

      {/* Header */}
      <div className="px-4 py-2 bg-[#0f0f0f] border-b border-red-900/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-xs text-red-400 font-bold tracking-widest uppercase">
              📡 Reconhecimento em Tempo Real
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`w-1 h-3 rounded-full ${i <= 3 ? (hasCoords ? 'bg-red-500' : 'bg-orange-500') : 'bg-zinc-800'} animate-pulse`} 
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
            <span className="text-[10px] text-red-500/60 ml-1">
              SIGNAL: {hasCoords ? 'LOCKED' : 'SEARCHING...'}
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-zinc-600">
          {hasCoords ? `${geo.lat.toFixed(4)}°, ${geo.lon.toFixed(4)}°` : 'COORDINATES_PENDING'}
        </span>
      </div>

      {/* Map or Placeholder */}
      <div className="relative flex-1">
        <div ref={mapRef} className="w-full h-full min-h-[320px]" />
        {!hasCoords && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <div className="text-red-500 animate-pulse mb-4">
              <Globe className="w-16 h-16 opacity-20" />
            </div>
            <p className="text-red-500 font-mono text-xs font-bold tracking-widest uppercase mb-2">
              Aguardando Sincronização de GPS
            </p>
            <p className="text-zinc-500 font-mono text-[10px] max-w-[280px] text-center uppercase">
              Triangulação via ERBs em andamento. Precisão limitada a nível regional para este alvo.
            </p>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="px-4 py-3 bg-[#0c0c0c] border-t border-red-900/20 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Cidade</div>
          <div className="text-xs font-mono text-white font-bold">{geo?.city || "—"}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Estado</div>
          <div className="text-xs font-mono text-white font-bold">{geo?.state || "—"}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">País</div>
          <div className="text-xs font-mono text-white font-bold">{geo?.country || geo?.country_code || "—"}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Operadora</div>
          <div className="text-xs font-mono text-red-400 font-bold">{carrier || "—"}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Número</div>
          <div className="text-xs font-mono text-green-400 font-bold">{formatted}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Tipo</div>
          <div className="text-xs font-mono text-white">{line_type || "—"}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Timezone</div>
          <div className="text-xs font-mono text-white">{timezones?.[0] || "—"}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Método de Intercep.</div>
          <div className="text-[10px] font-mono text-red-500 font-bold">{(geo as any).intercept_method || "TRIANGULAÇÃO"}</div>
        </div>
        <div className="space-y-0.5 col-span-1">
          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Endereço de Precisão</div>
          <div className="text-[10px] font-mono text-white break-words leading-tight">{geo?.address || "—"}</div>
        </div>
      </div>
    </div>
  )
}


