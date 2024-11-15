import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import Chatbot from './Chatbot';
import SKU_Rationalization from './SKU_Rationalization';
import Logistics from './Logistics';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="site-name">
            <img src={`${process.env.PUBLIC_URL}intelligent_retail_insights.png`} alt="Logo" className="site-logo" />
            <div className="text-container">
              <h1>Intelligent Insights</h1>
              <p>Real-Time Insights for Real-World Profits</p>
            </div>
          </div>
          <div className="header-right">
            <strong>Retail Analytics using Generative AI</strong>
          </div>
        </header>
        <div className="main-content">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sku-rationalization" element={<SKU_Rationalization />} />
            <Route path="/logistics" element={<Logistics />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
