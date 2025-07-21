import React, { useState } from 'react';

const BasicSidebar = ({ data, onChange, onRefresh }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const sidebarStyle = {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRight: '1px solid #ddd',
    height: '100vh',
    overflowY: 'auto'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    backgroundColor: '#1890ff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px'
  };

  return (
    <div style={sidebarStyle}>
      <h3>📊 GFX Dashboard Configuration</h3>
      
      {/* Data Source */}
      <div style={cardStyle}>
        <h4>Data Sources</h4>
        <div>
          <label>
            <input
              type="radio"
              value="Sample Data"
              checked={formData.data_source_mode === 'Sample Data'}
              onChange={(e) => handleChange('data_source_mode', e.target.value)}
            />
            Sample Data
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="API"
              checked={formData.data_source_mode === 'API'}
              onChange={(e) => handleChange('data_source_mode', e.target.value)}
            />
            API
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="Manual Upload"
              checked={formData.data_source_mode === 'Manual Upload'}
              onChange={(e) => handleChange('data_source_mode', e.target.value)}
            />
            Manual Upload
          </label>
        </div>
      </div>

      {/* Product Types */}
      <div style={cardStyle}>
        <h4>Product Types</h4>
        <select 
          style={selectStyle}
          multiple
          value={formData.product_types}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            handleChange('product_types', values);
          }}
        >
          <option value="FX_SPOT">FX Spot</option>
          <option value="FX_FORWARD">FX Forward</option>
          <option value="FX_SWAP">FX Swap</option>
          <option value="FX_OPTION">FX Option</option>
        </select>
      </div>

      {/* Legal Entities */}
      <div style={cardStyle}>
        <h4>Legal Entities</h4>
        <select 
          style={selectStyle}
          multiple
          value={formData.legal_entities}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            handleChange('legal_entities', values);
          }}
        >
          <option value="Entity1">Entity 1</option>
          <option value="Entity2">Entity 2</option>
          <option value="Entity3">Entity 3</option>
          <option value="ALL">All Entities</option>
        </select>
      </div>

      {/* Date Range */}
      <div style={cardStyle}>
        <h4>Date Range</h4>
        <label>Start Date:</label>
        <input
          type="date"
          style={selectStyle}
          value={formData.start_date}
          onChange={(e) => handleChange('start_date', e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          style={selectStyle}
          value={formData.end_date}
          onChange={(e) => handleChange('end_date', e.target.value)}
        />
      </div>

      {/* Dashboard Mode */}
      <div style={cardStyle}>
        <h4>Dashboard Mode</h4>
        <div>
          <label>
            <input
              type="radio"
              value="Simplified"
              checked={formData.dashboard_mode === 'Simplified'}
              onChange={(e) => handleChange('dashboard_mode', e.target.value)}
            />
            Simplified
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="Advanced"
              checked={formData.dashboard_mode === 'Advanced'}
              onChange={(e) => handleChange('dashboard_mode', e.target.value)}
            />
            Advanced
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={cardStyle}>
        <button style={buttonStyle} onClick={onRefresh}>
          Load Data
        </button>
        <button style={buttonStyle} onClick={onRefresh}>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default BasicSidebar;