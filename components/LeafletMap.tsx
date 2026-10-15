'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Asset } from '@/types/asset';

// Fix mặc định icon của Leaflet trong Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBoundsAutoZoom({ assets }: { assets: Asset[] }) {
  const map = useMap();

  useEffect(() => {
    const validCoords: [number, number][] = assets
      .map((a) => [parseFloat(String(a.Latitude)), parseFloat(String(a.Longitude))] as [number, number])
      .filter(([lat, lon]) => !isNaN(lat) && !isNaN(lon));

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [assets, map]);

  return null;
}

const getMarkerColor = (band: string) => {
  const b = band.toLowerCase();
  if (b.includes('severe')) return '#f43f5e'; // Rose
  if (b.includes('moderate')) return '#f59e0b'; // Amber
  return '#10b981'; // Emerald
};

interface LeafletMapProps {
  assets: Asset[];
}

export default function LeafletMap({ assets }: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-sm">
        Initializing map canvas...
      </div>
    );
  }

  const defaultCenter: [number, number] = [-42.2, 146.8];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-800 shadow-xl relative z-0">
      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[400] bg-slate-950/90 border border-slate-800 p-3 rounded-lg text-xs space-y-1 backdrop-blur-sm shadow-lg">
        <div className="font-bold text-slate-200 mb-1">Load Limit Bands</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Severe (&le; 5t)</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Moderate (6–20t)</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Light (&gt; 20t)</div>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={7} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsAutoZoom assets={assets} />

        {assets.map((asset, index) => {
          const lat = parseFloat(String(asset.Latitude));
          const lon = parseFloat(String(asset.Longitude));
          if (isNaN(lat) || isNaN(lon)) return null;

          const color = getMarkerColor(asset.Load_Limit_Band ?? '');
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });

          return (
            <Marker key={`marker-${index}`} position={[lat, lon]} icon={customIcon}>
              <Popup>
                <div className="text-slate-900 text-xs space-y-1">
                  <span className="font-mono text-sky-600 font-bold">{asset.Bridge_Number}</span>
                  <h4 className="font-bold text-sm text-slate-900">{asset.Bridge_Name}</h4>
                  <p><strong>Route:</strong> {asset.Road_Name}</p>
                  <p><strong>Owner:</strong> {asset.Asset_Owner}</p>
                  <p><strong>Limit:</strong> <span className="font-semibold text-rose-600">{asset.Load_Limit_Tonnes}t ({asset.Load_Limit_Band})</span></p>
                  {asset.Notes && <p><strong>Notes:</strong> {asset.Notes}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}