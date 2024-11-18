import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Importing Link for navigation
import './Logistics.css';
import mapboxgl from 'mapbox-gl';

// Logistics component
const Logistics = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Refs to hold map instances for each tab
  const mapRefTab1 = useRef(null);
  const mapRefTab2 = useRef(null);

  // Sample shipment data with fixed coordinates for New York, San Francisco, and Chicago
  const shipmentData = [
    { id: 1, source: 'Warehouse 1', destination: 'Warehouse Target', lat: 40.712776, lng: -74.005974, temperature: 72, humidity: 50, vibration: 0, alert: false }, // New York
    { id: 2, source: 'Warehouse 2', destination: 'Warehouse Target', lat: 37.774929, lng: -122.419418, temperature: 68, humidity: 45, vibration: 0, alert: false }, // San Francisco
    { id: 3, source: 'Warehouse 3', destination: 'Warehouse Target', lat: 41.878113, lng: -87.629799, temperature: 70, humidity: 60, vibration: 1, alert: true }, // Chicago
  ];

  // Mapbox access token
  const mapboxAccessToken = 'pk.eyJ1Ijoia2FyYW4tamFpbiIsImEiOiJjbTNpb3E3N2UwMzlxMmlzOGt1d3k1dmVsIn0.DXTx9XN00quR83ilqD1M8w'; 
  mapboxgl.accessToken = mapboxAccessToken;

  // Function to initialize the map and add markers
  const initializeMap = (containerId) => {
    const map = new mapboxgl.Map({
      container: containerId, // Container ID
      style: 'mapbox://styles/mapbox/navigation-night-v1', 
      // Used the Navigation Night Style URL 
      center: [shipmentData[0].lng, shipmentData[0].lat], // Center the map on New York initially
      zoom: 4, // Initial zoom level (adjust for visibility)
      attributionControl: true, // Ensure Mapbox attribution is visible
    });

    // Add markers for shipments
    shipmentData.forEach((shipment) => {
      new mapboxgl.Marker({
        color: shipment.alert ? 'red' : 'green', // Red for alert, green for normal
      })
        .setLngLat([shipment.lng, shipment.lat]) // Set the correct latitude and longitude for each marker
        .setPopup(
          new mapboxgl.Popup({ closeButton: false, closeOnClick: false }) // Customizing popup behavior
            .setHTML(`
              <h4>Shipment Info</h4>
              <p>Source: ${shipment.source}</p>
              <p>Destination: ${shipment.destination}</p>
              <p>Temperature: ${shipment.temperature}°F</p>
              <p>Humidity: ${shipment.humidity}%</p>
              <p>Vibration: ${shipment.vibration}</p>
              <p>Status: ${shipment.alert ? '<strong style="color:red;">Alert</strong>' : 'Normal'}</p>
            `)
        )
        .addTo(map); // Add the marker to the map
    });

    // After markers are added, the map should stay centered around the first marker (New York)
    // No fitBounds needed, just center the map correctly at first load
    return map;
  };

  // Initialize map for Tab 1 (Transit Logistics) when it becomes active
  useEffect(() => {
    if (activeTab === 0 && !mapRefTab1.current) {
      mapRefTab1.current = initializeMap('logistics-map-tab1');
    }

    // Clean up the map instance when switching away from this tab
    return () => {
      if (mapRefTab1.current) {
        mapRefTab1.current.remove();
        mapRefTab1.current = null;
      }
    };
  }, [activeTab]);

  // Initialize map for Tab 2 (In-Place Logistics) when it becomes active
  useEffect(() => {
    if (activeTab === 1 && !mapRefTab2.current) {
      mapRefTab2.current = initializeMap('logistics-map-tab2');
    }

    // Clean up the map instance when switching away from this tab
    return () => {
      if (mapRefTab2.current) {
        mapRefTab2.current.remove();
        mapRefTab2.current = null;
      }
    };
  }, [activeTab]);

  const switchTab = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="logistics-container">
      <div className="logistics-chart-card">
        <h3>Logistics Overview - Supply Chain Alerts and Optimization</h3>

        {/* Tabs */}
        <div className="logistics-tabs">
          <div
            className={`logistics-tab ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => switchTab(0)}
          >
            Transit Logistics
          </div>
          <div
            className={`logistics-tab ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => switchTab(1)}
          >
            In-Place Logistics
          </div>
        </div>

        {/* Tab Content */}
        <div className="logistics-chart-container">
          {activeTab === 0 && (
            <div id="logistics-map-tab1" style={{ height: '500px', width: '100%' }}></div>
          )}
          {activeTab === 1 && (
            <div id="logistics-map-tab2" style={{ height: '500px', width: '100%' }}></div>
          )}
        </div>
      </div>

      <Link to="/" className="logistics-back-button">Back to Home</Link>
    </div>
  );
};

export default Logistics;
