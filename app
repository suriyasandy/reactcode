import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataService from './services/DataService';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [sidebarData, setSidebarData] = useState({
    data_source_mode: 'Sample Data',
    product_types: ['FX_SPOT'],
    legal_entities: ['Entity1'],
    source_systems: ['SYSTEM_A'],
    start_date: '2025-01-01',
    end_date: '2025-03-31',
    dashboard_mode: 'Simplified'
  });

  const [dashboardData, setDashboardData] = useState({
    trade_data: [],
    exception_data: [],
    threshold_df: [],
    reason_code_mapping: [],
    alerts_df: [],
    groupwise_summary: [],
    expanded_summary: [],
    legal_entity_summary: [],
    ops_analysis: []
  });

  const [loading, setLoading] = useState(false);

  const handleSidebarChange = (newData) => {
    setSidebarData(newData);
  };

  const loadDashboardData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await DataService.loadData(sidebarData);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [sidebarData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: '#001529', 
          color: 'white', 
          fontSize: '24px', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '24px'
        }}>
          ð GFX Threshold Deviation Dashboard
        </Header>
        
        <Layout>
          <Sider 
            width={350} 
            style={{ 
              background: '#fff',
              borderRight: '1px solid #f0f0f0'
            }}
          >
            <Sidebar 
              data={sidebarData}
              onChange={handleSidebarChange}
              onRefresh={loadDashboardData}
            />
          </Sider>
          
          <Layout>
            <Content style={{ 
              margin: '16px',
              background: '#fff',
              borderRadius: '8px'
            }}>
              <Dashboard 
                data={dashboardData}
                sidebarData={sidebarData}
                loading={loading}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
