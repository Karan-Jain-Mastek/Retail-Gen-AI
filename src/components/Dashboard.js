import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import * as XLSX from 'xlsx';
import './Dashboard.css';

const Dashboard = () => {
  const [opportunityData, setOpportunityData] = useState([]);
  const [activeTab, setActiveTab] = useState('Strengths'); // State for active tab

  // Load Excel data from the "Opportunity Suggestions" tab
  useEffect(() => {
    const fetchExcelData = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/Retail Analytics Gen AI Datasets.xlsx`); 
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data);
      const opportunitySheet = workbook.Sheets["Opportunity Suggestions"];
      const jsonData = XLSX.utils.sheet_to_json(opportunitySheet);
      setOpportunityData(jsonData);
    };

    fetchExcelData();
  }, []);

  // Tab Headers
  const tabs = ['Strengths', 'Weaknesses', 'Opportunities', 'Risks'];

  // Dataset for Monthly Turnover Insights
  const turnoverOptions = {
    chart: {
      id: 'turnover-chart',
      type: 'line', // Multi-line chart
    },
    xaxis: {
      categories: [
        'September', 'October', 'November', 'December',
        'January', 'February', 'March', 'April', 'May', 'June'
      ],
    },
    title: {
      text: 'Monthly Turnover Insights',
      align: 'left',
    },
  };

  const turnoverSeries = [
    {
      name: 'Your Turnover ($)',
      data: [8580000, 9200000, 12000000, 11500000, 7000000, 15000000, 14000000, 16500000, 10000000, 18000000],
    },
    {
      name: 'Competitor A Turnover ($)',
      data: [5000000, 6000000, 7500000, 8000000, 10000000, 5000000, 11000000, 13000000, 15000000, 14000000],
    },
    {
      name: 'Competitor B Turnover ($)',
      data: [4000000, 5500000, 6000000, 4500000, 8000000, 9500000, 10000000, 9000000, 12000000, 10000000],
    },
    {
      name: 'Competitor C Turnover ($)',
      data: [6500000, 7000000, 5500000, 9000000, 11000000, 10500000, 8000000, 12000000, 10000000, 11500000],
    },
    {
      name: 'Competitor D Turnover ($)',
      data: [3500000, 4000000, 10000000, 6000000, 7500000, 8000000, 9000000, 5000000, 9000000, 12000000],
    },
    {
      name: 'Competitor E Turnover ($)',
      data: [4500000, 5200000, 6000000, 8500000, 9000000, 7500000, 10000000, 9500000, 11000000, 10000000],
    },
  ];

  // Dataset for Inventory Insights
  const inventoryOptions = {
    chart: {
      id: 'inventory-chart',
      type: 'bar', // Combo-bar chart
      stacked: false,
    },
    xaxis: {
      categories: ['SKU001', 'SKU002', 'SKU003', 'SKU004', 'SKU005', 'SKU006', 'SKU007', 'SKU008', 'SKU009', 'SKU010'],
    },
    title: {
      text: 'Inventory Insights',
      align: 'left',
    },
  };

  const inventorySeries = [
    {
      name: 'Monthly Sales ($)',
      type: 'column',
      data: [5000, 7000, 500, 2000, 0, 1800, 1000, 5000, 2200, 0],
    },
    {
      name: 'Total Inventory (units)',
      type: 'line',
      data: [1200, 800, 500, 1000, 300, 900, 400, 600, 1100, 250],
    },
  ];

  return (
    <div className="dashboard">
      {/* First Row - 5 Card Blocks */}
      <div className="row">
        <div className="card-block">
          <div className="card-header">
            <img src={`${process.env.PUBLIC_URL}/monthly_turnover.jpg`} alt="Turnover" className="card-icon" />
            <h3 className="card-title">Monthly Turnover</h3>
          </div>
          <hr className="card-divider" />
          <div className="card-content">
            <div>
              <span className="figure">$8,580,000</span>
              <span className="description">September</span>
            </div>
            <div>
              <span className="figure">$9,029,103</span>
              <span className="description">October</span>
            </div>
          </div>
        </div>
        <div className="card-block">
          <div className="card-header">
            <img src={`${process.env.PUBLIC_URL}/sales_insights.jpg`} alt="Sales Insights" className="card-icon" />
            <h3 className="card-title">Sales Insights</h3>
          </div>
          <hr className="card-divider" />
          <div className="card-content">
            <div>
              <span className="figure">$1,989,000</span>
              <span className="description">Incremental Sales</span>
            </div>
            <div>
              <span className="figure">98.9%</span>
              <span className="description">Incremental Returns</span>
            </div>
          </div>
        </div>
        <div className="card-block">
          <div className="card-header">
            <img src={`${process.env.PUBLIC_URL}/total_inventory.jpg`} alt="Total Inventory" className="card-icon" />
            <h3 className="card-title">Total Inventory</h3>
          </div>
          <hr className="card-divider" />
          <div className="card-content">
            <div>
              <span className="figure">237,335 units</span>
              <span className="description">Total Inventory</span>
            </div>
            <div>
              <span className="figure">$66,455,746</span>
              <span className="description">Total Sales</span>
            </div>
          </div>
        </div>
        <div className="card-block">
          <div className="card-header">
            <img src={`${process.env.PUBLIC_URL}/new_inventory.jpg`} alt="New Units" className="card-icon" />
            <h3 className="card-title">New Inventory</h3>
          </div>
          <hr className="card-divider" />
          <div className="card-content">
            <div>
              <span className="figure">80,300</span>
              <span className="description">New Units Added</span>
            </div>
            <div>
              <span className="figure">$8,580,000</span>
              <span className="description">Total Value Added</span>
            </div>
          </div>
        </div>
        <div className="card-block">
          <div className="card-header">
            <img src={`${process.env.PUBLIC_URL}/competitors.jpg`} alt="Competitors" className="card-icon" />
            <h3 className="card-title">Competitors</h3>
          </div>
          <hr className="card-divider" />
          <div className="card-content">
            <div>
              <span className="figure">5</span>
              <span className="description">Competitors Matched</span>
            </div>
            <div>
              <span className="figure">1,500</span>
              <span className="description">Products Matched</span>
            </div>
          </div>
        </div>
      </div>
      {/* Second Row - Charts */}
      <div className="row">
        <div className="card-block">
          <Chart options={turnoverOptions} series={turnoverSeries} type="line" height={350} />
        </div>
        <div className="card-block">
          <Chart options={inventoryOptions} series={inventorySeries} type="line" height={350} />
        </div>
      </div>
      {/* Third Row - 2 Analysis Blocks */}
      <div className="row">
        <div className="analysis-block">
          <div className="opportunity-header">
            <img src={`${process.env.PUBLIC_URL}/opportunity_suggestions.jpg`} alt="Opportunity Logo" className="opportunity-logo" />
            <div className="opportunity-title">
            <h3 className="opportunity-title-text">Opportunity Suggestions</h3>
            <p className="opportunity-tagline">Found 10 opportunities totalling $22,259,810 in incremental profits.</p>
            </div>
          </div>
          <div className="opportunity-table-container">
            <table className="opportunity-table">
              <thead>
                <tr>
                  <th>SKU ID</th>
                  <th>Total Sales</th>
                  <th>Total Units Sold</th>
                  <th>Suggested Price Increase</th>
                  <th>Rationale</th>
                </tr>
              </thead>
              <tbody>
                {opportunityData.map((row, index) => (
                  <tr key={index}>
                    <td>{row['SKU ID']}</td>
                    <td>${row['Total Sales'].toLocaleString()}</td> {/* Added dollar sign and formatting */}
                    <td>{row['Total Units Sold']}</td>
                    <td>{(row['Suggested Price Increase'] * 100).toFixed(2)}%</td> {/* Adjusted percentage */}
                    <td>{row['Rationale']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="analysis-block">
          <div className="swor-header">
            <img src={`${process.env.PUBLIC_URL}/swor_analysis.jpg`} alt="SWOR Logo" className="swor-logo" />
            <h3 className="swor-title">SWOR Analysis</h3>
          </div>
          <div className="tabs">
            {tabs.map(tab => (
              <div
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <hr className="tab-divider" />
          <div className="tab-content">
            {activeTab === 'Strengths' && <div>
                1. High Sales Turnover: Total sales amounting to $66,455,746.42 indicates strong revenue generation.<br></br><br></br>
                2. Diverse Product Range: A wide variety of items being sold, such as different styles and sizes of scrub tops, suggests a broad product offering that can cater to various customer preferences.
                </div>}
            {activeTab === 'Weaknesses' && <div>
                1. Aged Inventory: Inventory items aged over 90 days, such as SKU ID 19153900028 and others, indicate potential issues with slow-moving stock, which can tie up capital and increase holding costs.<br></br><br></br>
                2. Underperforming Stores: If specific stores show lower sales compared to others, this could highlight operational inefficiencies or poor location performance.
                </div>}
            {activeTab === 'Opportunities' && <div>
                1. Promotional Strategies: Items not currently on promotion, like the Koi Camouflage Brook Mock Wrap Print Scrub Top, could benefit from targeted promotions to boost sales.<br></br><br></br>
                2. Inventory Optimization: Addressing aged inventory through clearance sales can free up resources and improve cash flow.
                </div>}
            {activeTab === 'Risks' && <div>
                1. Inventory Obsolescence: Continued accumulation of aged inventory could lead to obsolescence, resulting in write-offs and financial losses.<br></br><br></br>
                2. Market Competition: Without specific data on competitors, the risk remains that competitors could offer similar products at lower prices or with better value propositions.
                </div>}
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>Contact Us: <br /><a href="iSolve@mastek.com">iSolve@mastek.com</a></p>
      </footer>
    </div>
  );
};

export default Dashboard;
