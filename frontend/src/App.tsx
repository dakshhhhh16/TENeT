import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Alaska-specific coordinates - Geographic center of Alaska
const ALASKA_CENTER: [number, number] = [64.2008, -149.4937];
const ALASKA_ZOOM = 5;

// Alaska boundary coordinates to restrict map view
const ALASKA_BOUNDS: [[number, number], [number, number]] = [
  [51.0, -180.0], // Southwest (includes Aleutian Islands)
  [71.5, -129.0]  // Northeast
];

function App() {
  return (
    <div style={{ height: '100vh', width: '100%', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#1e40af', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          TENeT - Telehealth Effectiveness and Necessity Tracker
        </h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
          Identifying healthcare deserts and assessing network feasibility for telehealth in Alaska
        </p>
      </div>

      {/* Map Container */}
      <MapContainer
        center={ALASKA_CENTER}
        zoom={ALASKA_ZOOM}
        maxBounds={ALASKA_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={4}
        style={{ flex: 1, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Anchorage - Largest city */}
        <Marker position={[61.2181, -149.9003]}>
          <Popup>
            <strong>Anchorage</strong><br />
            Population: ~290,000<br />
            <em>Demo location</em>
          </Popup>
        </Marker>

        {/* Fairbanks - Interior Alaska */}
        <Marker position={[64.8378, -147.7164]}>
          <Popup>
            <strong>Fairbanks</strong><br />
            Population: ~32,000<br />
            <em>Demo location</em>
          </Popup>
        </Marker>

        {/* Juneau - State Capital */}
        <Marker position={[58.3019, -134.4197]}>
          <Popup>
            <strong>Juneau</strong><br />
            State Capital<br />
            <em>Demo location</em>
          </Popup>
        </Marker>

        {/* Nome - Remote coastal community */}
        <Marker position={[64.5011, -165.4064]}>
          <Popup>
            <strong>Nome</strong><br />
            Remote coastal village<br />
            <em>Demo location</em>
          </Popup>
        </Marker>

        {/* Utqiaġvik (Barrow) - Northernmost city */}
        <Marker position={[71.2906, -156.7886]}>
          <Popup>
            <strong>Utqiaġvik (Barrow)</strong><br />
            Northernmost US city<br />
            <em>Demo location</em>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Footer */}
      <div style={{ 
        padding: '12px 20px', 
        backgroundColor: '#1f2937', 
        color: '#9ca3af',
        fontSize: '12px',
        borderTop: '1px solid #374151'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ color: '#e5e7eb' }}>Mentors:</strong> Pradeeban Kathiravelu & David Moxley | 
            <span style={{ marginLeft: '10px' }}>University of Alaska</span>
          </div>
          <div>
            <a 
              href="https://github.com/KathiraveluLab/TENeT" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', textDecoration: 'none' }}
            >
              GitHub
            </a>
            {' | '}
            <a 
              href="https://github.com/KathiraveluLab/TENeT/discussions" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', textDecoration: 'none' }}
            >
              Discussions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
