import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const urgencyColors = {
  CRITIQUE: '#ef4444',
  HAUTE: '#f97316',
  NORMALE: '#22c55e',
};

function CustomMarker({ position, color, children }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || markerRef.current) return;

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 28px; height: 28px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 12px; font-weight: bold;
        ">
          ${children || '📍'}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });

    markerRef.current = L.marker(position, { icon }).addTo(map);

    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [map, position, color, children]);

  return null;
}

export default function MapView({
  center = [31.7917, -7.0926],
  zoom = 6,
  markers = [],
  height = '400px',
  readonly = false,
  onClick,
}) {
  const [map, setMap] = useState(null);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={!readonly}
        whenCreated={setMap}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>
              <div className="p-1">
                <p className="font-medium text-slate-900">{marker.popup || 'Localisation'}</p>
                {marker.onClick && (
                  <button
                    onClick={() => marker.onClick(marker)}
                    className="mt-2 text-sm text-cyan-700 hover:underline"
                  >
                    Voir détails
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {markers.map((marker, index) => (
          marker.urgency && (
            <CustomMarker
              key={`custom-${index}`}
              position={[marker.lat, marker.lng]}
              color={urgencyColors[marker.urgency] || urgencyColors.NORMALE}
            />
          )
        ))}
      </MapContainer>
    </div>
  );
}