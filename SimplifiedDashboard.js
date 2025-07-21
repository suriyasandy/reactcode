import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Table, Select, Space, Tag, Alert } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ThresholdTable from './ThresholdTable';
import ReasonCodeAnalysis from './ReasonCodeAnalysis';
import DeviationBuckets from './DeviationBuckets';

const { Title, Text } = Typography;

const SimplifiedDashboard = ({ data, sidebarData }) => {
  const [thresholdMode, setThresholdMode] = useState('currency');

  // Summary metrics
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

  return (
    <div style={{ padding: '24px' }}>
      {/* Summary Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {summaryCards.map((card, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: card.color,
                  marginBottom: '8px'
                }}>
                  {card.value}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {card.title}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Row 1: Threshold Configuration & Impact Analysis */}
      <Card 
        title="Row 1: Threshold Configuration & Impact Analysis" 
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Threshold Configuration" size="small">
              <Space style={{ marginBottom: 16 }}>
                <Text>Mode:</Text>
                <Select
                  value={thresholdMode}
                  onChange={setThresholdMode}
                  options={[
                    { label: 'Group-wise', value: 'group' },
                    { label: 'Currency-wise', value: 'currency' }
                  ]}
                />
              </Space>
              <ThresholdTable 
                data={data.threshold_df || []} 
                mode={thresholdMode}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Impact Analysis Results" size="small">
              {data.legal_entity_summary && data.legal_entity_summary.length > 0 ? (
                <Table
                  dataSource={data.legal_entity_summary}
                  columns={[
                    { title: 'Legal Entity', dataIndex: 'legal_entity', key: 'legal_entity' },
                    { title: 'Alerts', dataIndex: 'alert_count', key: 'alert_count' },
                    { title: 'Impact %', dataIndex: 'impact_percentage', key: 'impact_percentage',
                      render: (val) => `${val}%` }
                  ]}
                  pagination={false}
                  size="small"
                />
              ) : (
                <Alert message="No impact analysis data available" type="info" />
              )}
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Row 2: Reason Code Analysis */}
      <Card 
        title="Row 2: Reason Code Mapping & Analysis"
        style={{ marginBottom: 24 }}
      >
        <ReasonCodeAnalysis 
          opsAnalysis={data.ops_analysis || []}
          reasonCodeMapping={data.reason_code_mapping || []}
        />
      </Card>

      {/* Row 3: Deviation Bucket Analysis */}
      <Card title="Row 3: Deviation Bucket Analysis">
        <DeviationBuckets 
          groupwiseSummary={data.groupwise_summary || []}
          expandedSummary={data.expanded_summary || []}
          alertsData={data.alerts_df || []}
        />
      </Card>
    </div>
  );
};

export default SimplifiedDashboard;