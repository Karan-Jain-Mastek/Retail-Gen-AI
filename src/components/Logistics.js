import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importing Link for navigation
import './Logistics.css';
import mapboxgl from 'mapbox-gl';

// Logistics component
const Logistics = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Sample shipment data
  const shipmentData = [
    { id: 1, source: 'Warehouse 1', destination: 'Warehouse Target', lat: 40.712776, lng: -74.005974, temperature: 72, humidity: 50, vibration: 0, alert: false },
    { id: 2, source: 'Warehouse 2', destination: 'Warehouse Target', lat: 34.052235, lng: -118.243683, temperature: 68, humidity: 45, vibration: 0, alert: false },
    { id: 3, source: 'Warehouse 3', destination: 'Warehouse Target', lat: 41.878113, lng: -87.629799, temperature: 70, humidity: 60, vibration: 1, alert: true },
  ];

  // Mapbox access token
  const mapboxAccessToken = 'pk.eyJ1Ijoia2FyYW4tamFpbiIsImEiOiJjbTNpb3E3N2UwMzlxMmlzOGt1d3k1dmVsIn0.DXTx9XN00quR83ilqD1M8w'; // Replace with your actual token
  mapboxgl.accessToken = mapboxAccessToken;

  const initializeMap = (containerId) => {
    const newMap = new mapboxgl.Map({
      container: containerId, // Container ID
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [shipmentData[0].lng, shipmentData[0].lat], // Default map center from first shipment
      zoom: 10, // Default zoom
    });

    // Add markers for shipments
    shipmentData.forEach((shipment) => {
      new mapboxgl.Marker({
        color: shipment.alert ? 'red' : 'green', // Red for alert, green for normal
      })
        .setLngLat([shipment.lng, shipment.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <h4>Shipment Info</h4>
            <p>Source: ${shipment.source}</p>
            <p>Destination: ${shipment.destination}</p>
            <p>Temperature: ${shipment.temperature}°F</p>
            <p>Humidity: ${shipment.humidity}%</p>
            <p>Vibration: ${shipment.vibration}</p>
            <p>Status: ${shipment.alert ? '<strong style="color:red;">Alert</strong>' : 'Normal'}</p>
          `)
        )
        .addTo(newMap);
    });
  };

  // Initialize map for Tab 1 (Transit Logistics) when it becomes active
  useEffect(() => {
    if (activeTab === 0) {
      initializeMap('logistics-map-tab1');
    }
    return () => {
      const map1 = document.getElementById('logistics-map-tab1');
      if (map1) {
        map1.innerHTML = ''; // Clean up map container
      }
    };
  }, [activeTab]);

  // Initialize map for Tab 2 (In-Place Logistics) when it becomes active
  useEffect(() => {
    if (activeTab === 1) {
      initializeMap('logistics-map-tab2');
    }
    return () => {
      const map2 = document.getElementById('logistics-map-tab2');
      if (map2) {
        map2.innerHTML = ''; // Clean up map container
      }
    };
  }, [activeTab]);

  const switchTab = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="logistics-container">
      <div className="logistics-chart-card">
        <h3>Logistics Overview</h3>

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
