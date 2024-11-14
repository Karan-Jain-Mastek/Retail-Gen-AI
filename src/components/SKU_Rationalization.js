import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './SKU_Rationalization.css';
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';  // Import Highcharts Map module
import HighchartsReact from 'highcharts-react-official';  // Import HighchartsReact wrapper

// Initialize Highcharts Map module
HighchartsMap(Highcharts);

const LazyApexCharts = lazy(() => import('react-apexcharts'));

const SKU_Rationalization_Tabs = ({ children, activeTab, setActiveTab }) => {
  return (
    <div>
      <div className="sku-rationalization-tabs">
        {React.Children.map(children, (child, index) => (
          <div
            className={`sku-rationalization-tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
            key={index}
          >
            {child.props.label}
          </div>
        ))}
      </div>
      <div className="sku-rationalization-chart-container">
        {children[activeTab]}
      </div>
    </div>
  );
};

const SKU_Rationalization_Tab = React.memo(({ children }) => {
  return <div>{children}</div>;
});

const SKU_Rationalization = () => {
  const [skuData, setSkuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [skuAggregatedData, setSkuAggregatedData] = useState([]);
  const [isChartDataReady, setIsChartDataReady] = useState(false);
  const [tabLoadingState, setTabLoadingState] = useState([true, true]);

  const [mapData, setMapData] = useState(null);  // New state for map data

  // Fetch Map Data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(
          'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
        );
        const data = await response.json();
        setMapData(data); // Store the map data in state
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchMapData();
  }, []);

  // Fetch SKU data (Excel file)
  const fetchData = async () => {
    try {
      const skuResponse = await fetch('/SKU_Rationalization.xlsx');
      const skuFileData = await skuResponse.arrayBuffer();
      const skuWorkbook = XLSX.read(skuFileData, { type: 'array' });
      const skuJsonData = XLSX.utils.sheet_to_json(skuWorkbook.Sheets[skuWorkbook.SheetNames[0]]);
      setSkuData(skuJsonData);
    } catch (error) {
      console.error('Error fetching the SKU Excel file:', error);
    } finally {
      setIsLoading(false);
      setTabLoadingState([false, false]);
    }
  };

  useEffect(() => {
    fetchData();  // Fetch SKU data on mount
  }, []);

  // Worker for SKU Aggregation
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const newWorker = new Worker(new URL('../workers/skuAggregationWorker.js', import.meta.url));
    setWorker(newWorker);

    return () => {
      newWorker.terminate();  // Clean up the worker
    };
  }, []);

  useEffect(() => {
    if (skuData.length > 0 && worker) {
      worker.postMessage({ skuData });

      worker.onmessage = (event) => {
        if (event.data.status === 'completed') {
          setSkuAggregatedData(event.data.data);  // Set aggregated SKU data
          setIsChartDataReady(true);
        }
      };
    }
  }, [skuData, worker]);

  return (
    <div className="sku-rationalization-container">
      <div className="sku-rationalization-chart-card">
        <h3>Stock Keeping Unit Rationalization</h3>

        <SKU_Rationalization_Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
          {/* First Tab: Total Transaction Units per SKU */}
          <SKU_Rationalization_Tab label="Total Transaction Units per SKU">
            {tabLoadingState[0] || !skuAggregatedData.length ? (
              <div className="loading-message">Loading...</div>
            ) : (
              <Suspense fallback={<div className="loading-message">Loading...</div>}>
                {skuAggregatedData.length > 0 && (
                  <LazyApexCharts
                    key={activeTab}
                    options={{
                      chart: { id: 'transaction-units', toolbar: { show: false } },
                      xaxis: { categories: skuAggregatedData.map(item => item.sku), title: { text: 'SKU IDs' } },
                      colors: ['#008FFB'],
                      title: { text: 'Transaction Units per SKU', align: 'center' },
                    }}
                    series={[{
                      name: 'Transaction Units per SKU',
                      data: skuAggregatedData.map(item => item.transaction_units),
                    }]}

                    type="bar"
                    height={350}
                  />
                )}
              </Suspense>
            )}
          </SKU_Rationalization_Tab>

          {/* Second Tab: Region Transaction Overview (World Map) */}
          <SKU_Rationalization_Tab label="Region Transaction Overview">
            {tabLoadingState[1] || !mapData ? (
              <div className="loading-message">Loading Map...</div>
            ) : (
              <div style={{ height: '500px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  constructorType="map"
                  options={{
                    chart: {
                      map: mapData, // Pass the dynamically fetched map data here
                    },
                    title: {
                      text: 'Region Transaction Overview',
                    },
                    subtitle: {
                      text: 'Displaying global transaction data',
                    },
                    mapNavigation: {
                      enabled: true,
                    },
                    colorAxis: {
                      min: 0,
                    },
                    series: []  // No data series for now, just display map
                  }}
                />
              </div>
            )}
          </SKU_Rationalization_Tab>
        </SKU_Rationalization_Tabs>
      </div>

      <Link to="/" className="sku-rationalization-back-button">Back to Home</Link>
    </div>
  );
};

export default SKU_Rationalization;
