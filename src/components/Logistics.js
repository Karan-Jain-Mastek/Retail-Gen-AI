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

  const vendorData = [
    // Vendors for New York (positions are encircling around the target warehouse)
    { vendorName: 'Vendor A', latitude: 40.710610, longitude: -74.035242, warehouse: 'New York', state: 'New Jersey', vendorType: 'Raw Material Supplier' }, // South-West of New York
    { vendorName: 'Vendor B', latitude: 40.650002, longitude: -74.049997, warehouse: 'New York', state: 'New Jersey', vendorType: 'Raw Material Supplier' }, // West of New York
    { vendorName: 'Vendor C', latitude: 40.7831, longitude: -73.9512, warehouse: 'New York', state: 'New York', vendorType: 'Wholesale Distributor' }, // North-West of New York
    { vendorName: 'Vendor D', latitude: 40.900000, longitude: -73.935000, warehouse: 'New York', state: 'New York', vendorType: 'Contract Manufacturer' }, // North of New York
    
    // Vendors for Chicago (positions are encircling around the target warehouse)
    { vendorName: 'Vendor E', latitude: 41.9300, longitude: -87.7100, warehouse: 'Chicago', state: 'Illinois', vendorType: 'Raw Material Supplier' }, // South-West of Chicago
    { vendorName: 'Vendor F', latitude: 41.8600, longitude: -87.7500, warehouse: 'Chicago', state: 'Illinois', vendorType: 'Wholesale Distributor' }, // West of Chicago
    { vendorName: 'Vendor G', latitude: 41.8000, longitude: -87.6700, warehouse: 'Chicago', state: 'Illinois', vendorType: 'Contract Manufacturer' }, // North-West of Chicago
    { vendorName: 'Vendor H', latitude: 41.7550, longitude: -87.6250, warehouse: 'Chicago', state: 'Indiana', vendorType: 'Retail Distributor' }, // South of Chicago
    
    // Vendors for Mumbai (positions are encircling around the target warehouse)
    { vendorName: 'Vendor I', latitude: 19.1460, longitude: 72.9077, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Raw Material Supplier' }, // South-West of Mumbai
    { vendorName: 'Vendor J', latitude: 19.0800, longitude: 72.9300, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Raw Material Supplier' }, // West of Mumbai
    { vendorName: 'Vendor K', latitude: 19.1260, longitude: 72.8777, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Raw Material Supplier' }, // North-West of Mumbai
    { vendorName: 'Vendor L', latitude: 19.1100, longitude: 72.9500, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Wholesale Distributor' }, // North-East of Mumbai
    
    // Vendors for London (positions are encircling around the target warehouse)
    { vendorName: 'Vendor M', latitude: 51.5074, longitude: -0.2178, warehouse: 'London', state: 'England', vendorType: 'Retail Distributor' }, // South-West of London
    { vendorName: 'Vendor N', latitude: 51.5400, longitude: -0.1200, warehouse: 'London', state: 'England', vendorType: 'Wholesale Distributor' }, // West of London
    { vendorName: 'Vendor O', latitude: 51.5350, longitude: -0.0800, warehouse: 'London', state: 'England', vendorType: 'Raw Material Supplier' }, // North-West of London
    { vendorName: 'Vendor P', latitude: 51.4550, longitude: -0.1278, warehouse: 'London', state: 'England', vendorType: 'Raw Material Supplier' }  // North of London
  ];  
  
  // Mapbox access token
  const mapboxAccessToken = 'pk.eyJ1Ijoia2FyYW4tamFpbiIsImEiOiJjbTNpb3E3N2UwMzlxMmlzOGt1d3k1dmVsIn0.DXTx9XN00quR83ilqD1M8w'; 
  mapboxgl.accessToken = mapboxAccessToken;

  // Function to initialize the map and add vendor markers
  const initializeMap = (containerId) => {
    const map = new mapboxgl.Map({
      container: containerId, // Container ID
      style: 'mapbox://styles/mapbox/navigation-night-v1', 
      center: [vendorData[0].longitude, vendorData[0].latitude], // Center the map on the first vendor (New York)
      zoom: 4, // Initial zoom level (adjust for visibility)
      attributionControl: false, // Ensure Mapbox attribution is not visible
    });

    // Convert vendor data into GeoJSON format
    const geoJsonData = {
      type: 'FeatureCollection',
      features: vendorData.map((vendor) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [vendor.longitude, vendor.latitude],
        },
        properties: {
          vendorName: vendor.vendorName,
          warehouse: vendor.warehouse,
          state: vendor.state,
          vendorType: vendor.vendorType,
        },
      })),
    };

    // Add GeoJSON source to the map
    map.on('load', () => {
      map.addSource('vendors', {
        type: 'geojson',
        data: geoJsonData, // The GeoJSON data you created above
      });

      // Add a layer to visualize the vendor markers using the default Mapbox icon
      map.addLayer({
        id: 'vendor-markers',
        type: 'symbol',
        source: 'vendors',
        layout: {
          'icon-image': 'rocket-15', // Default Mapbox marker icon (circle)
          'icon-size': 1, // Adjust the size of the vendor icon (optional)
        },
      });

      // Add popups on click
      map.on('click', 'vendor-markers', (e) => {
        const { vendorName, warehouse, state, vendorType } = e.features[0].properties;
        new mapboxgl.Popup({
            anchor: 'bottom', 
            offset: 10,
            closeButton: true, 
            closeOnClick: false, 
            maxWidth: 'none',
            autoPan: true, // Ensures the map is panned if popup overflows
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="popup-content">
              <h4 class="popup-title">${vendorName}</h4>
              <p><strong>Warehouse:</strong> ${warehouse}</p>
              <p><strong>State:</strong> ${state}</p>
              <p><strong>Vendor Type:</strong> ${vendorType}</p>
            </div>
          `)
          .addTo(map);
      });
    });

    return map;
  };

  // Initialize map for Tab 1 (Transit Logistics) when it becomes active
  useEffect(() => {
    if (activeTab === 0 && !mapRefTab1.current) {
      mapRefTab1.current = initializeMap('logistics-map-tab1');
    } else if (mapRefTab1.current) {
      mapRefTab1.current.flyTo({
        center: [vendorData[0].longitude, vendorData[0].latitude],
        zoom: 4,
        speed: 1.5,
        curve: 1,
        easing: (t) => t,
      });
    }

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
    } else if (mapRefTab2.current) {
      mapRefTab2.current.flyTo({
        center: [vendorData[1].longitude, vendorData[1].latitude],
        zoom: 4,
        speed: 1.5,
        curve: 1,
        easing: (t) => t,
      });
    }

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
        <h3>Logistics Overview - Vendor Locations</h3>
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

        <div className="logistics-chart-container">
          {activeTab === 0 && (
            <div id="logistics-map-tab1" className="map" style={{ height: '500px', width: '100%' }}></div>
          )}
          {activeTab === 1 && (
            <div id="logistics-map-tab2" className="map" style={{ height: '500px', width: '100%' }}></div>
          )}
        </div>
      </div>

      <Link to="/" className="logistics-back-button">Back to Home</Link>
    </div>
  );
};

export default Logistics;
