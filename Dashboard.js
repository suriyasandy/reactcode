import React from 'react';
import { Tabs, Spin } from 'antd';
import SimplifiedDashboard from './SimplifiedDashboard';
import AdvancedDashboard from './AdvancedDashboard';

const { TabPane } = Tabs;

const Dashboard = ({ data, sidebarData, loading }) => {
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" tip="Loading dashboard data..." />
      </div>
    );
  }

  if (sidebarData.dashboard_mode === 'Simplified') {
    return <SimplifiedDashboard data={data} sidebarData={sidebarData} />;
  } else {
    return <AdvancedDashboard data={data} sidebarData={sidebarData} />;
  }
};

export default Dashboard;