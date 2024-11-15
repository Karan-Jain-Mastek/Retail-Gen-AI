import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-section">
        <div className="nav-item">
          <img src="inventory_management.png" alt="Inventory Management" className="nav-icon" />
          Inventory Management
        </div>
        <div className="nav-item">
          <img src="revenue_analysis.png" alt="Revenue Analysis" className="nav-icon" />
          Revenue Analysis
        </div>
        <div className="nav-item">
          <img src="inventory_productivity_analysis.png" alt="Inventory Productivity Analysis" className="nav-icon" />
          Inventory Productivity Analysis
        </div>
        <div className="nav-item">
          <img src="market_pricing_strategy.png" alt="Market Pricing Analysis" className="nav-icon" />
          Market Pricing Analysis
        </div>
      </div>
      <hr />
      <div className="nav-section">
        <div className="nav-item">
          <img src="target_marketing.png" alt="Target Marketing" className="nav-icon" />
          Target Marketing
        </div>
        <div className="nav-item">
          <img src="dynamic_pricing.png" alt="Dynamic Pricing" className="nav-icon" />
          Dynamic Pricing Analysis
        </div>
        <div className="nav-item">
          <img src="seasonal_trends.png" alt="Seasonal Trends" className="nav-icon" />
          Seasonal Trends
        </div>
        <div className="nav-item">
          <img src="bundle_promotion.png" alt="Bundle Promotion" className="nav-icon" />
          Bundle Promotion
        </div>
      </div>
      <hr />
      <div className="nav-section">
        <Link to="/logistics" className="nav-item"> {/* Wrap with Link */}
          <img src="logistics_analysis.png" alt="Logistics Analysis" className="nav-icon" />
          Logistics Analysis
        </Link>
        <div className="nav-item">
          <img src="price_optimization.png" alt="Price Optimization" className="nav-icon" />
          Price Optimization Analysis
        </div>
        <Link to="/sku-rationalization" className="nav-item"> {/* Wrap with Link */}
          <img src="sku_rationalization.png" alt="SKU Rationalization" className="nav-icon" />
          SKU Rationalization
        </Link>
        <div className="nav-item">
          <img src="promotional_analysis.png" alt="Promotional Analysis" className="nav-icon" />
          Promotional Analysis
        </div>
        <div className="nav-item">
          <img src="competitive_analysis.png" alt="Competitive Analysis" className="nav-icon" />
          Competitive Analysis
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
