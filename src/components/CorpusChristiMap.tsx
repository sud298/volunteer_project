import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

// Define a custom marker icon (optional)
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Define location coordinates and status
const locations = [
  { name: "Ingleside (Air)", lat: 27.8775, lng: -97.2114, status: "On" },
  { name: "IOB Sandpiper (Air)", lat: 27.8000, lng: -97.4000, status: "On" },
  { name: "IOB Sunset (Air)", lat: 27.8100, lng: -97.4100, status: "On" },
  { name: "Gregory (Air)", lat: 27.9200, lng: -97.2900, status: "Off" },
  { name: "Hillcrest (Air)", lat: 27.8500, lng: -97.2200, status: "Off" },
  { name: "NorthExxon-Sabic (Air)", lat: 27.8300, lng: -97.5000, status: "On" },
  { name: "SouthExxon-Sabic (Air)", lat: 27.8200, lng: -97.5100, status: "Off" },
  { name: "Port Aransas (Air)", lat: 27.8336, lng: -97.0611, status: "On" },
  { name: "Ingleside (Water)", lat: 27.8775, lng: -97.2114, status: "Off" },
];

const CorpusChristiMap = () => {
  // Coordinates for Corpus Christi, TX (approximate center)
  const center = [27.8006, -97.3964];

  return (
    <div style={{ position: "relative", margin: "20px 0" }}>
      <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }}>
        {/* Use CartoDB Positron tiles for a light/grey theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {/* Render markers for all locations */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={customIcon}
          >
            <Popup>
              <strong>{location.name}</strong>
              <br />
              Status: {location.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Air Quality Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 1000,
          fontSize: "0.9rem",
          lineHeight: "1.4rem",
        }}
      >
        <strong>Air Quality Legend</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
          <li>
            <span style={{ background: "green", display: "inline-block", width: "15px", height: "15px", marginRight: "5px" }}></span>
            Good
          </li>
          <li>
            <span style={{ background: "yellow", display: "inline-block", width: "15px", height: "15px", marginRight: "5px" }}></span>
            Moderate
          </li>
          <li>
            <span style={{ background: "orange", display: "inline-block", width: "15px", height: "15px", marginRight: "5px" }}></span>
            Unhealthy for Sensitive Groups
          </li>
          <li>
            <span style={{ background: "red", display: "inline-block", width: "15px", height: "15px", marginRight: "5px" }}></span>
            Unhealthy
          </li>
          <li>
            <span style={{ background: "purple", display: "inline-block", width: "15px", height: "15px", marginRight: "5px" }}></span>
            Very Unhealthy
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CorpusChristiMap;