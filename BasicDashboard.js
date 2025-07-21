import React from 'react';

const BasicDashboard = ({ data, sidebarData, loading }) => {
  const containerStyle = {
    padding: '24px',
    backgroundColor: '#fff'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '18px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #f0f0f0'
  };

  const metricCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    minWidth: '200px',
    margin: '10px'
  };

  const metricValueStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: '8px'
  };

  const metricLabelStyle = {
    fontSize: '14px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const rowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '30px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  };

  const thStyle = {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalTrades = data.trade_data?.length || 0;
  const totalAlerts = data.alerts_df?.length || 0;
  const totalExceptions = data.exception_data?.length || 0;
  const alertRate = totalTrades > 0 ? ((totalAlerts / totalTrades) * 100).toFixed(1) : 0;

  const summaryCards = [
    { title: 'Total Trades', value: totalTrades, color: '#1890ff' },
    { title: 'Total Alerts', value: totalAlerts, color: '#fa8c16' },
    { title: 'Alert Rate', value: `${alertRate}%`, color: '#f5222d' },
    { title: 'Exceptions', value: totalExceptions, color: '#722ed1' }
  ];

  if (sidebarData.dashboard_mode === 'Simplified') {
    return (
      <div style={containerStyle}>
        {/* Summary Metrics */}
        <div style={rowStyle}>
          {summaryCards.map((card, index) => (
            <div key={index} style={metricCardStyle}>
              <div style={{ ...metricValueStyle, color: card.color }}>
                {card.value}
              </div>
              <div style={metricLabelStyle}>
                {card.title}
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Threshold Configuration & Impact Analysis */}
        <div style={cardStyle}>
          <h3>Row 1: Threshold Configuration & Impact Analysis</h3>
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <h4>Threshold Configuration</h4>
              {data.threshold_df && data.threshold_df.length > 0 ? (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Legal Entity</th>
                      <th style={thStyle}>Currency</th>
                      <th style={thStyle}>Original Threshold</th>
                      <th style={thStyle}>Proposed Threshold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.threshold_df.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{item.LegalEntity}</td>
                        <td style={tdStyle}>{item.CCY}</td>
                        <td style={tdStyle}>{item.Original_Threshold}%</td>
                        <td style={tdStyle}>{item.Proposed_Threshold}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No threshold data available</p>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h4>Impact Analysis Results</h4>
              {data.legal_entity_summary && data.legal_entity_summary.length > 0 ? (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Legal Entity</th>
                      <th style={thStyle}>Alerts</th>
                      <th style={thStyle}>Impact %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.legal_entity_summary.map((item, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{item.legal_entity}</td>
                        <td style={tdStyle}>{item.alert_count}</td>
                        <td style={tdStyle}>{item.impact_percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No impact analysis data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Reason Code Analysis */}
        <div style={cardStyle}>
          <h3>Row 2: Reason Code Mapping & Analysis</h3>
          {data.ops_analysis && data.ops_analysis.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>High Level Code</th>
                  <th style={thStyle}>Count</th>
                  <th style={thStyle}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.ops_analysis.map((item, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{item.high_level_code}</td>
                    <td style={tdStyle}>{item.count}</td>
                    <td style={tdStyle}>{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reason code analysis data available</p>
          )}
        </div>

        {/* Row 3: Deviation Bucket Analysis */}
        <div style={cardStyle}>
          <h3>Row 3: Deviation Bucket Analysis</h3>
          {data.groupwise_summary && data.groupwise_summary.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Deviation Bucket</th>
                  <th style={thStyle}>USD</th>
                  <th style={thStyle}>EUR</th>
                  <th style={thStyle}>GBP</th>
                </tr>
              </thead>
              <tbody>
                {data.groupwise_summary.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: item.highlight ? '#fff2e8' : 'transparent'
                  }}>
                    <td style={tdStyle}>{item.Deviation_Bucket}</td>
                    <td style={tdStyle}>{item.USD || 0}</td>
                    <td style={tdStyle}>{item.EUR || 0}</td>
                    <td style={tdStyle}>{item.GBP || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No deviation bucket data available</p>
          )}
        </div>
      </div>
    );
  } else {
    // Advanced Dashboard Mode
    return (
      <div style={containerStyle}>
        <h2>Advanced Dashboard</h2>
        
        {/* Summary Metrics */}
        <div style={rowStyle}>
          {summaryCards.map((card, index) => (
            <div key={index} style={metricCardStyle}>
              <div style={{ ...metricValueStyle, color: card.color }}>
                {card.value}
              </div>
              <div style={metricLabelStyle}>
                {card.title}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Tables */}
        <div style={cardStyle}>
          <h3>Trade Alerts</h3>
          {data.alerts_df && data.alerts_df.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Trade ID</th>
                  <th style={thStyle}>Currency Pair</th>
                  <th style={thStyle}>Deviation %</th>
                  <th style={thStyle}>Legal Entity</th>
                  <th style={thStyle}>Product Type</th>
                </tr>
              </thead>
              <tbody>
                {data.alerts_df.slice(0, 10).map((alert, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{alert.trade_id}</td>
                    <td style={tdStyle}>{alert.ccypair}</td>
                    <td style={tdStyle}>{alert.deviationpercent}%</td>
                    <td style={tdStyle}>{alert.legal_entity}</td>
                    <td style={tdStyle}>{alert.product_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No alerts data available</p>
          )}
        </div>
      </div>
    );
  }
};

export default BasicDashboard;