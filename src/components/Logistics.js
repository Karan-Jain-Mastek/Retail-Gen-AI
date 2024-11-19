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
    { vendorName: 'Vendor A', latitude: 40.710610, longitude: -74.065242, warehouse: 'New York', state: 'New Jersey', vendorType: 'Raw Material Supplier' },
    { vendorName: 'Vendor B', latitude: 40.550002, longitude: -74.159997, warehouse: 'New York', state: 'New Jersey', vendorType: 'Raw Material Supplier' },
    { vendorName: 'Vendor C', latitude: 40.7831, longitude: -73.9512, warehouse: 'New York', state: 'New York', vendorType: 'Wholesale Distributor' },
    { vendorName: 'Vendor D', latitude: 40.900000, longitude: -73.985000, warehouse: 'New York', state: 'New York', vendorType: 'Contract Manufacturer' },
    
    // Vendors for Chicago
    { vendorName: 'Vendor E', latitude: 41.9300, longitude: -87.7100, warehouse: 'Chicago', state: 'Illinois', vendorType: 'Raw Material Supplier' },
    { vendorName: 'Vendor F', latitude: 41.8600, longitude: -87.7500, warehouse: 'Chicago', state: 'Illinois', vendorType: 'Wholesale Distributor' },
    { vendorName: 'Vendor G', latitude: 41.8000, longitude: -87.6700, warehouse: 'Chicago', state: 'Illinois', vendorType: 'Contract Manufacturer' },
    { vendorName: 'Vendor H', latitude: 41.7550, longitude: -87.6250, warehouse: 'Chicago', state: 'Indiana', vendorType: 'Retail Distributor' },
    
    // Vendors for Mumbai
    { vendorName: 'Vendor I', latitude: 19.1160, longitude: 72.9077, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Raw Material Supplier' },
    { vendorName: 'Vendor J', latitude: 19.0800, longitude: 72.9100, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Raw Material Supplier' },
    { vendorName: 'Vendor K', latitude: 19.1260, longitude: 72.8777, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Raw Material Supplier' },
    { vendorName: 'Vendor L', latitude: 19.0100, longitude: 72.8500, warehouse: 'Mumbai', state: 'Maharashtra', vendorType: 'Wholesale Distributor' },
    
    // Vendors for London
    { vendorName: 'Vendor M', latitude: 51.5074, longitude: -0.2178, warehouse: 'London', state: 'England', vendorType: 'Retail Distributor' },
    { vendorName: 'Vendor N', latitude: 51.5400, longitude: -0.1200, warehouse: 'London', state: 'England', vendorType: 'Wholesale Distributor' },
    { vendorName: 'Vendor O', latitude: 51.5350, longitude: -0.0800, warehouse: 'London', state: 'England', vendorType: 'Raw Material Supplier' },
    { vendorName: 'Vendor P', latitude: 51.4550, longitude: -0.1278, warehouse: 'London', state: 'England', vendorType: 'Raw Material Supplier' }
  ];

  const warehouseData = [
    { warehouseName: 'Warehouse New York', latitude: 40.712776, longitude: -74.005974, warehouseType: 'Distribution Center', currentInventoryLevels: 12000, operationalStatus: 'Active', numberOfVendors: 4 },
    { warehouseName: 'Warehouse Chicago', latitude: 41.878113, longitude: -87.629799, warehouseType: 'Fulfillment Center', currentInventoryLevels: 9500, operationalStatus: 'Active', numberOfVendors: 4 },
    { warehouseName: 'Warehouse Mumbai', latitude: 19.0760, longitude: 72.8777, warehouseType: 'Logistics Hub', currentInventoryLevels: 14500, operationalStatus: 'Active', numberOfVendors: 4 },
    { warehouseName: 'Warehouse London', latitude: 51.5074, longitude: -0.1278, warehouseType: 'Warehouse & Distribution', currentInventoryLevels: 8000, operationalStatus: 'Active', numberOfVendors: 4 }
  ];

  const truckData = [
    { truckNumber: 'TX123', vendor: 'Vendor A', rawMaterialSku: 'SKU001', latitude: 40.730610, longitude: -74.045242, destinationName: 'Warehouse New York', inventoryUnits: 500, temperature: 65, humidity: 60, vibration: 0.4, airCooling: 'Yes', alert: false },
    { truckNumber: 'TX124', vendor: 'Vendor B', rawMaterialSku: 'SKU002', latitude: 40.610002, longitude: -74.139997, destinationName: 'Warehouse New York', inventoryUnits: 450, temperature: 103, humidity: 65, vibration: 0.7, airCooling: 'No', alert: true },
    { truckNumber: 'TX125', vendor: 'Vendor C', rawMaterialSku: 'SKU003', latitude: 40.7531, longitude: -73.9730, destinationName: 'Warehouse New York', inventoryUnits: 600, temperature: 69, humidity: 55, vibration: 0.3, airCooling: 'No', alert: false },
    { truckNumber: 'TX126', vendor: 'Vendor D', rawMaterialSku: 'SKU004', latitude: 40.830000, longitude: -73.985000, destinationName: 'Warehouse New York', inventoryUnits: 300, temperature: 82, humidity: 58, vibration: 0.1, airCooling: 'No', alert: false },
    
    { truckNumber: 'TX127', vendor: 'Vendor E', rawMaterialSku: 'SKU005', latitude: 41.9000, longitude: -87.6650, destinationName: 'Warehouse Chicago', inventoryUnits: 550, temperature: 90, humidity: 50, vibration: 0.8, airCooling: 'Yes', alert: true },
    { truckNumber: 'TX128', vendor: 'Vendor F', rawMaterialSku: 'SKU006', latitude: 41.8680, longitude: -87.6730, destinationName: 'Warehouse Chicago', inventoryUnits: 400, temperature: 80, humidity: 62, vibration: 0.2, airCooling: 'No', alert: false },
    { truckNumber: 'TX129', vendor: 'Vendor G', rawMaterialSku: 'SKU007', latitude: 41.8350, longitude: -87.6550, destinationName: 'Warehouse Chicago', inventoryUnits: 700, temperature: 101, humidity: 59, vibration: 0.6, airCooling: 'No', alert: true },   
    { truckNumber: 'TX130', vendor: 'Vendor H', rawMaterialSku: 'SKU008', latitude: 41.8050, longitude: -87.6250, destinationName: 'Warehouse Chicago', inventoryUnits: 350, temperature: 95, humidity: 66, vibration: 0.4, airCooling: 'Yes', alert: false },
    
    { truckNumber: 'TX131', vendor: 'Vendor I', rawMaterialSku: 'SKU009', latitude: 19.1000, longitude: 72.8977, destinationName: 'Warehouse Mumbai', inventoryUnits: 1000, temperature: 98, humidity: 70, vibration: 0.5, airCooling: 'Yes', alert: false },
    { truckNumber: 'TX132', vendor: 'Vendor J', rawMaterialSku: 'SKU010', latitude: 19.0765, longitude: 72.8960, destinationName: 'Warehouse Mumbai', inventoryUnits: 1200, temperature: 110, humidity: 55, vibration: 0.9, airCooling: 'No', alert: true },
    { truckNumber: 'TX133', vendor: 'Vendor K', rawMaterialSku: 'SKU011', latitude: 19.1060, longitude: 72.8777, destinationName: 'Warehouse Mumbai', inventoryUnits: 650, temperature: 66, humidity: 60, vibration: 0.1, airCooling: 'Yes', alert: false },
    { truckNumber: 'TX134', vendor: 'Vendor L', rawMaterialSku: 'SKU012', latitude: 19.0400, longitude: 72.8600, destinationName: 'Warehouse Mumbai', inventoryUnits: 500, temperature: 50, humidity: 62, vibration: 0.4, airCooling: 'Yes', alert: false },
    
    { truckNumber: 'TX135', vendor: 'Vendor M', rawMaterialSku: 'SKU013', latitude: 51.5144, longitude: -0.1578, destinationName: 'Warehouse London', inventoryUnits: 300, temperature: 105, humidity: 52, vibration: 0.3, airCooling: 'No', alert: true },
    { truckNumber: 'TX136', vendor: 'Vendor N', rawMaterialSku: 'SKU014', latitude: 51.5230, longitude: -0.1250, destinationName: 'Warehouse London', inventoryUnits: 400, temperature: 99, humidity: 63, vibration: 0.2, airCooling: 'Yes', alert: false },
    { truckNumber: 'TX137', vendor: 'Vendor O', rawMaterialSku: 'SKU015', latitude: 51.5150, longitude: -0.1100, destinationName: 'Warehouse London', inventoryUnits: 450, temperature: 96, humidity: 55, vibration: 0.1, airCooling: 'Yes', alert: false },
    { truckNumber: 'TX138', vendor: 'Vendor P', rawMaterialSku: 'SKU016', latitude: 51.4800, longitude: -0.1278, destinationName: 'Warehouse London', inventoryUnits: 550, temperature: 104, humidity: 60, vibration: 0.5, airCooling: 'Yes', alert: true }
  ];  

  // Mapbox access token
  const mapboxAccessToken = 'pk.eyJ1Ijoia2FyYW4tamFpbiIsImEiOiJjbTNpb3E3N2UwMzlxMmlzOGt1d3k1dmVsIn0.DXTx9XN00quR83ilqD1M8w'; 
  mapboxgl.accessToken = mapboxAccessToken;

  // Function to initialize the map and add vendor, warehouse, and truck markers
  const initializeMap = (containerId) => {
    const map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [vendorData[0].longitude, vendorData[0].latitude], // Center on the first vendor
      zoom: 4,
      attributionControl: false,
    });

    // Convert vendor data to GeoJSON format
    const geoJsonDataVendors = {
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

    // Convert warehouse data to GeoJSON format
    const geoJsonDataWarehouses = {
      type: 'FeatureCollection',
      features: warehouseData.map((warehouse) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [warehouse.longitude, warehouse.latitude],
        },
        properties: {
          warehouseName: warehouse.warehouseName,
          warehouseType: warehouse.warehouseType,
          currentInventoryLevels: warehouse.currentInventoryLevels,
          operationalStatus: warehouse.operationalStatus,
          numberOfVendors: warehouse.numberOfVendors,
        },
      })),
    };

    // Convert truck data to GeoJSON format
    const geoJsonDataTrucks = {
      type: 'FeatureCollection',
      features: truckData.map((truck) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [truck.longitude, truck.latitude],
        },
        properties: {
          truckNumber: truck.truckNumber,
          vendor: truck.vendor,
          destinationName: truck.destinationName,
          inventoryUnits: truck.inventoryUnits,
          temperature: truck.temperature,
          humidity: truck.humidity,
          vibration: truck.vibration,
          airCooling: truck.airCooling,
          alert: truck.alert,
        },
      })),
    };

    // Load the map and add markers when it's ready
    map.on('load', () => {
      // Add GeoJSON sources for vendors, warehouses, and trucks
      map.addSource('vendors', {
        type: 'geojson',
        data: geoJsonDataVendors,
      });
      map.addSource('warehouses', {
        type: 'geojson',
        data: geoJsonDataWarehouses,
      });
      map.addSource('trucks', {
        type: 'geojson',
        data: geoJsonDataTrucks,
      });

      // Add layer for vendor markers (using a custom icon)
      map.addLayer({
        id: 'vendor-markers',
        type: 'symbol',
        source: 'vendors',
        layout: {
          'icon-image': 'grocery-15', // Marker icon
          'icon-size': 1, // Size of the marker icon
        },
      });

      // Add layer for warehouse markers (using a custom icon)
      map.addLayer({
        id: 'warehouse-markers',
        type: 'symbol',
        source: 'warehouses',
        layout: {
          'icon-image': 'museum-15', // Different marker icon for warehouses
          'icon-size': 1, // Size of the marker icon
        },
      });

      // Add layer for truck markers (using custom icons with conditional coloring based on alert)
      map.addLayer({
        id: 'truck-markers',
        type: 'symbol',
        source: 'trucks',
        layout: {
          'icon-image': 'car-15', // Truck icon
          'icon-size': 1, // Size of the marker icon
        },
        paint: {
          'icon-color': ['case', ['boolean', ['get', 'alert'], false], 'red', 'green'], // Red for trucks with alert, green otherwise
        },
      });

      // Click event for vendor markers to show popup
      map.on('click', 'vendor-markers', (e) => {
        const feature = e.features[0];
        const popup = new mapboxgl.Popup({ offset: [0, -25] })
          .setLngLat(feature.geometry.coordinates)
          .setHTML(`
            <div class="popup-content">
              <h4 class="popup-title">${feature.properties.vendorName}</h4>
              <p><strong>Warehouse:</strong> ${feature.properties.warehouse}</p>
              <p><strong>State:</strong> ${feature.properties.state}</p>
              <p><strong>Vendor Type:</strong> ${feature.properties.vendorType}</p>
            </div>
          `)
          .addTo(map);
      });

      // Click event for warehouse markers to show popup
      map.on('click', 'warehouse-markers', (e) => {
        const feature = e.features[0];
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(feature.geometry.coordinates)
          .setHTML(`
            <div class="popup-content">
              <h4 class="popup-title">${feature.properties.warehouseName}</h4>
              <p><strong>Warehouse Type:</strong> ${feature.properties.warehouseType}</p>
              <p><strong>Inventory Levels:</strong> ${feature.properties.currentInventoryLevels}</p>
              <p><strong>Operational Status:</strong> ${feature.properties.operationalStatus}</p>
              <p><strong>Number of Vendors:</strong> ${feature.properties.numberOfVendors}</p>
            </div>
          `)
          .addTo(map);
      });

      // Click event for truck markers to show popup
      map.on('click', 'truck-markers', (e) => {
        const feature = e.features[0];
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(feature.geometry.coordinates)
          .setHTML(`
            <div class="popup-content">
              <h4 class="popup-title">${feature.properties.truckNumber}</h4>
              <p><strong>Vendor:</strong> ${feature.properties.vendor}</p>
              <p><strong>Destination:</strong> ${feature.properties.destinationName}</p>
              <p><strong>Inventory Units:</strong> ${feature.properties.inventoryUnits}</p>
              <p><strong>Temperature:</strong> ${feature.properties.temperature}°F</p>
              <p><strong>Humidity:</strong> ${feature.properties.humidity}%</p>
              <p><strong>Vibration:</strong> ${feature.properties.vibration}</p>
              <p><strong>Air Cooling:</strong> ${feature.properties.airCooling}</p>
              <p><strong>Alert:</strong> ${feature.properties.alert ? 'Yes' : 'No'}</p>
            </div>
          `)
          .addTo(map);
      });

      // Optional: Set up a hover effect for markers (for better UX)
      map.on('mouseenter', 'vendor-markers', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'vendor-markers', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('mouseenter', 'warehouse-markers', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'warehouse-markers', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('mouseenter', 'truck-markers', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'truck-markers', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return map;
  };

  // Initialize map for Tab 1 (Transit Logistics)
  useEffect(() => {
    if (activeTab === 0 && !mapRefTab1.current) {
      mapRefTab1.current = initializeMap('logistics-map-tab1');
    }

    return () => {
      if (mapRefTab1.current) {
        mapRefTab1.current.remove();
        mapRefTab1.current = null;
      }
    };
  }, [activeTab]);

  // Initialize map for Tab 2 (In-Place Logistics)
  useEffect(() => {
    if (activeTab === 1 && !mapRefTab2.current) {
      mapRefTab2.current = initializeMap('logistics-map-tab2');
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
        <h3>Logistics Overview - Supply Chain Alerts and Optimization</h3>
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
