import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './SKU_Rationalization.css';
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';  // Import Highcharts Map module
import HighchartsReact from 'highcharts-react-official';  // Import HighchartsReact wrapper

// Initialize Highcharts Map module
HighchartsMap(Highcharts);
console.log("Highcharts:", Highcharts);
console.log("HighchartsMap initialized:", Highcharts.maps);

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

  // Fetch Map Data (keeping the "bad" code logic)
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(
          'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
        ); 
        const topology = await response.json();

        console.log("Map data loaded:", topology);  // Log the loaded data to verify it's correct
        setMapData(topology);
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchMapData();
  }, []);

  const data = [
    ['fo', 10], ['um', 11], ['us', 12], ['jp', 13], ['sc', 14], ['in', 15],
    ['fr', 16], ['fm', 17], ['cn', 18], ['sw', 19], ['sh', 20], ['br', 21],
    ['ec', 22], ['au', 23], ['ki', 24], ['ph', 25], ['mx', 26], ['es', 27],
    ['bu', 28], ['mv', 29], ['sp', 30], ['gb', 31], ['gr', 32], ['as', 33],
    ['dk', 34], ['gl', 35], ['gu', 36], ['mp', 37], ['pr', 38], ['vi', 39],
    ['ca', 40], ['st', 41], ['tz', 42], ['cv', 43], ['dm', 44], ['nl', 45],
    ['jm', 46], ['ws', 47], ['om', 48], ['vc', 49], ['tr', 50], ['bd', 51],
    ['sb', 52], ['lc', 53], ['nr', 54], ['no', 55], ['kn', 56], ['bh', 57],
    ['to', 58], ['fi', 59], ['id', 60], ['mu', 61], ['se', 62], ['tt', 63],
    ['my', 64], ['bs', 65], ['pa', 66], ['pw', 67], ['tv', 68], ['mh', 69],
    ['cl', 70], ['th', 71], ['gd', 72], ['ee', 73], ['ag', 74], ['tw', 75],
    ['bb', 76], ['it', 77], ['mt', 78], ['pg', 79], ['de', 80], ['vu', 81],
    ['sg', 82], ['cy', 83], ['km', 84], ['fj', 85], ['ru', 86], ['va', 87],
    ['sm', 88], ['kz', 89], ['az', 90], ['am', 91], ['tj', 92], ['ls', 93],
    ['uz', 94], ['pt', 95], ['ma', 96], ['co', 97], ['tl', 98], ['kh', 99],
    ['ar', 100], ['sa', 101], ['pk', 102], ['ye', 103], ['ae', 104],
    ['ke', 105], ['pe', 106], ['do', 107], ['ht', 108], ['ao', 109],
    ['vn', 110], ['mz', 111], ['cr', 112], ['ir', 113], ['sv', 114],
    ['sl', 115], ['gw', 116], ['hr', 117], ['bz', 118], ['za', 119],
    ['cd', 120], ['kw', 121], ['ie', 122], ['kp', 123], ['kr', 124],
    ['gy', 125], ['hn', 126], ['mm', 127], ['ga', 128], ['gq', 129],
    ['ni', 130], ['ug', 131], ['mw', 132], ['sx', 133], ['tm', 134],
    ['zm', 135], ['nc', 136], ['mr', 137], ['dz', 138], ['lt', 139],
    ['et', 140], ['sd', 141], ['er', 142], ['gh', 143], ['si', 144],
    ['gt', 145], ['ba', 146], ['jo', 147], ['sy', 148], ['mc', 149],
    ['al', 150], ['uy', 151], ['cnm', 152], ['mn', 153], ['rw', 154],
    ['so', 155], ['bo', 156], ['cm', 157], ['cg', 158], ['eh', 159],
    ['rs', 160], ['me', 161], ['bj', 162], ['ng', 163], ['tg', 164],
    ['la', 165], ['af', 166], ['ua', 167], ['sk', 168], ['jk', 169],
    ['bg', 170], ['qa', 171], ['li', 172], ['at', 173], ['sz', 174],
    ['hu', 175], ['ro', 176], ['lu', 177], ['ad', 178], ['ci', 179],
    ['lr', 180], ['bn', 181], ['be', 182], ['iq', 183], ['ge', 184],
    ['gm', 185], ['ch', 186], ['td', 187], ['kv', 188], ['lb', 189],
    ['dj', 190], ['bi', 191], ['sr', 192], ['il', 193], ['ml', 194],
    ['sn', 195], ['gn', 196], ['zw', 197], ['pl', 198], ['mk', 199],
    ['py', 200], ['by', 201], ['lv', 202], ['cz', 203], ['bf', 204],
    ['na', 205], ['ne', 206], ['ly', 207], ['tn', 208], ['bt', 209],
    ['md', 210], ['ss', 211], ['cf', 212], ['nz', 213], ['cu', 214],
    ['ve', 215], ['mg', 216], ['is', 217], ['eg', 218], ['lk', 219],
    ['bw', 220], ['kg', 221], ['np', 222]
  ];

  useEffect(() => {
    if (mapData) {
      console.log("MapData on render:", mapData);
      console.log("Data passed to map:", data);
    }
  }, [mapData]);

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
                {/* Render map only if mapData is available */}
                {mapData && (
                  <HighchartsReact
                  highcharts={Highcharts}
                  constructorType="map"
                  options={{
                    chart: {
                      map: mapData,  // Ensure the mapData is valid
                    },
                    title: {
                      text: 'World Map',
                    },
                    series: [{
                      type: 'map',
                      mapData: mapData,
                      name: 'Countries',
                      data: data,  // Ensure this data is structured correctly
                    }],
                  }}
                  />
                )}
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
