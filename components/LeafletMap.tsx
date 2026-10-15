'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Asset } from '@/types/asset';

const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapProps {
  assets: Asset[];
}

export default function LeafletMap({ assets }: LeafletMapProps) {
  const defaultCenter: [number, number] = [-42.2, 146.8];

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-800 shadow-xl z-0 relative">
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
        {assets.map((asset, index) => {
          const lat = parseFloat(String(asset.Latitude));
          const lon = parseFloat(String(asset.Longitude));

          if (isNaN(lat) || isNaN(lon)) return null;

          return (
            <Marker 
              key={`marker-${asset.Object || 'bridge'}-${index}`} 
              position={[lat, lon]} 
              icon={customIcon}
            >
              <Popup>
                <div className="text-slate-900 text-xs space-y-1">
                  <span className="font-mono text-sky-600 font-bold">{asset.Bridge_Number}</span>
                  <h4 className="font-bold text-sm text-slate-900">{asset.Bridge_Name}</h4>
                  <p><strong>Route:</strong> {asset.Road_Name}</p>
                  <p><strong>Owner:</strong> {asset.Asset_Owner}</p>
                  <p><strong>Limit Band:</strong> <span className="font-semibold text-rose-600">{asset.Load_Limit_Band}</span></p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}