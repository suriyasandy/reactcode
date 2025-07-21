import React, { useState } from 'react';
import { Card, Row, Col, Table, Select, Space, Typography, Tag } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const { Text, Title } = Typography;

const ReasonCodeAnalysis = ({ opsAnalysis, reasonCodeMapping }) => {
  const [selectedHighLevelCode, setSelectedHighLevelCode] = useState(null);

  // Prepare high-level code summary
  const prepareHighLevelSummary = () => {
    if (!opsAnalysis || opsAnalysis.length === 0) return [];
    
    const summary = {};
    opsAnalysis.forEach(item => {
      const code = item.high_level_code || 'UNKNOWN';
      summary[code] = (summary[code] || 0) + 1;
    });

    return Object.entries(summary).map(([code, count]) => ({
      code,
      count,
      percentage: ((count / opsAnalysis.length) * 100).toFixed(1)
    }));
  };

  // Prepare detailed breakdown for selected high-level code
  const prepareDetailedBreakdown = () => {
    if (!selectedHighLevelCode || !opsAnalysis) return [];
    
    return opsAnalysis
      .filter(item => item.high_level_code === selectedHighLevelCode)
      .reduce((acc, item) => {
        const existing = acc.find(x => x.reasoncodeid === item.reasoncodeid);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({
            reasoncodeid: item.reasoncodeid,
            count: 1,
            status: item.exception_status || 'UNKNOWN',
            assigned_to: item.assigned_to || 'UNASSIGNED'
          });
        }
        return acc;
      }, []);
  };

  const highLevelSummary = prepareHighLevelSummary();
  const detailedBreakdown = prepareDetailedBreakdown();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const highLevelColumns = [
    {
      title: 'High Level Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <Tag 
          color="blue" 
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedHighLevelCode(text)}
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (val) => `${val}%`
    }
  ];

  const detailedColumns = [
    {
      title: 'Reason Code ID',
      dataIndex: 'reasoncodeid',
      key: 'reasoncodeid',
      width: 200,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'CLOSED' ? 'green' : 
                     status === 'OPEN' ? 'red' : 
                     status === 'IN_PROGRESS' ? 'orange' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Assigned To',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
    }
  ];

  return (
    <Row gutter={[24, 24]}>
      {/* High Level Code Summary */}
      <Col xs={24} lg={12}>
        <Card title="High-Level Code Summary" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={highLevelSummary}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ code, percentage }) => `${code}: ${percentage}%`}
                  >
                    {highLevelSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <Table
              dataSource={highLevelSummary}
              columns={highLevelColumns}
              pagination={false}
              size="small"
              rowKey="code"
              onRow={(record) => ({
                onClick: () => setSelectedHighLevelCode(record.code),
                style: { cursor: 'pointer' }
              })}
            />
          </Space>
        </Card>
      </Col>

      {/* Detailed Reason Code Breakdown */}
      <Col xs={24} lg={12}>
        <Card 
          title={`Detailed Breakdown${selectedHighLevelCode ? ` - ${selectedHighLevelCode}` : ''}`}
          size="small"
        >
          {selectedHighLevelCode ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">
                Click on a high-level code in the left panel to see detailed breakdown
              </Text>
              
              <Table
                dataSource={detailedBreakdown}
                columns={detailedColumns}
                pagination={{ pageSize: 5 }}
                size="small"
                rowKey="reasoncodeid"
              />
              
              {detailedBreakdown.length > 0 && (
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={detailedBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="reasoncodeid" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#fa8c16" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Space>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '50px', 
              color: '#999' 
            }}>
              Select a high-level code to view detailed breakdown
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ReasonCodeAnalysis;