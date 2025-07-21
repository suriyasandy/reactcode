import React from 'react';
import { Tabs, Card, Row, Col, Statistic } from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const { TabPane } = Tabs;

const AdvancedDashboard = ({ data, sidebarData }) => {
  // Calculate summary metrics
  const totalTrades = data.trade_data?.length || 0;
  const totalAlerts = data.alerts_df?.length || 0;
  const totalExceptions = data.exception_data?.length || 0;
  const alertRate = totalTrades > 0 ? ((totalAlerts / totalTrades) * 100).toFixed(1) : 0;

  // Prepare chart data
  const prepareDeviationChart = () => {
    if (!data.alerts_df || data.alerts_df.length === 0) return [];
    
    const deviationRanges = {
      '0-1%': 0,
      '1-2%': 0,
      '2-3%': 0,
      '3-5%': 0,
      '5%+': 0
    };

    data.alerts_df.forEach(alert => {
      const deviation = parseFloat(alert.deviationpercent || 0);
      if (deviation <= 1) deviationRanges['0-1%']++;
      else if (deviation <= 2) deviationRanges['1-2%']++;
      else if (deviation <= 3) deviationRanges['2-3%']++;
      else if (deviation <= 5) deviationRanges['3-5%']++;
      else deviationRanges['5%+']++;
    });

    return Object.entries(deviationRanges).map(([range, count]) => ({
      range,
      count
    }));
  };

  const prepareCurrencyChart = () => {
    if (!data.alerts_df || data.alerts_df.length === 0) return [];
    
    const currencyCount = {};
    data.alerts_df.forEach(alert => {
      const ccy1 = alert.ccy1;
      const ccy2 = alert.ccy2;
      currencyCount[ccy1] = (currencyCount[ccy1] || 0) + 1;
      currencyCount[ccy2] = (currencyCount[ccy2] || 0) + 1;
    });

    return Object.entries(currencyCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([currency, count]) => ({ currency, count }));
  };

  const deviationChartData = prepareDeviationChart();
  const currencyChartData = prepareCurrencyChart();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div style={{ padding: '24px' }}>
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Trades" value={totalTrades} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Alerts" value={totalAlerts} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Alert Rate" value={alertRate} suffix="%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Exceptions" value={totalExceptions} />
          </Card>
        </Col>
      </Row>

      {/* Tabs for different analyses */}
      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview & Analytics" key="overview">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Deviation Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deviationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top Currencies by Alert Count">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currencyChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ currency, count }) => `${currency}: ${count}`}
                    >
                      {currencyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Deviation Analysis" key="deviation">
          <Card title="Detailed Deviation Analysis">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={deviationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#fa8c16" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="Legal Entity Impact" key="legal">
          <Card title="Legal Entity Analysis">
            {data.legal_entity_summary && data.legal_entity_summary.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.legal_entity_summary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="legal_entity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="alert_count" fill="#52c41a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                No legal entity data available
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Ops Workflow" key="ops">
          <Card title="Operations Workflow Analysis">
            {data.ops_analysis && data.ops_analysis.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.ops_analysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="high_level_code" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#722ed1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                No operations workflow data available
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdvancedDashboard;