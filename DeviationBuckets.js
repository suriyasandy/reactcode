import React, { useState } from 'react';
import { Card, Row, Col, Table, Select, Space, Button, Typography, Tooltip } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { EyeOutlined, TableOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const DeviationBuckets = ({ groupwiseSummary, expandedSummary, alertsData }) => {
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [pivotRows, setPivotRows] = useState(['legal_entity']);
  const [pivotCols, setPivotCols] = useState(['ccy1']);
  const [pivotValues, setPivotValues] = useState('count');

  // Prepare groupwise summary table
  const prepareGroupwiseTable = () => {
    if (!groupwiseSummary || groupwiseSummary.length === 0) return [];
    
    return groupwiseSummary.map((item, index) => ({
      ...item,
      key: index,
      deviation_bucket: item.Deviation_Bucket || item.deviation_bucket,
      highlight: item.highlight || false
    }));
  };

  // Prepare expanded summary for high deviations
  const prepareExpandedTable = () => {
    if (!expandedSummary || expandedSummary.length === 0) return [];
    
    return expandedSummary.map((item, index) => ({
      ...item,
      key: index
    }));
  };

  // Prepare bucket drill-down data
  const prepareBucketDrillDown = () => {
    if (!selectedBucket || !alertsData) return [];
    
    return alertsData
      .filter(alert => {
        // Filter alerts that fall into the selected bucket
        const deviation = parseFloat(alert.deviationpercent || 0);
        // This is a simplified bucket matching - in real implementation,
        // you'd use the same logic as the backend bucket creation
        return true; // For now, show all alerts
      })
      .slice(0, 100) // Limit to first 100 for performance
      .map((alert, index) => ({
        ...alert,
        key: index
      }));
  };

  const groupwiseData = prepareGroupwiseTable();
  const expandedData = prepareExpandedTable();
  const drillDownData = prepareBucketDrillDown();

  // Chart data preparation
  const prepareChartData = () => {
    return groupwiseData.map(item => ({
      bucket: item.deviation_bucket,
      total: Object.keys(item)
        .filter(key => key !== 'deviation_bucket' && key !== 'highlight' && key !== 'key')
        .reduce((sum, key) => sum + (parseInt(item[key]) || 0), 0)
    }));
  };

  const chartData = prepareChartData();

  // Dynamic columns for groupwise summary
  const getGroupwiseColumns = () => {
    if (!groupwiseData || groupwiseData.length === 0) return [];
    
    const baseColumns = [
      {
        title: 'Deviation Bucket',
        dataIndex: 'deviation_bucket',
        key: 'deviation_bucket',
        fixed: 'left',
        width: 150,
        render: (text, record) => (
          <div 
            style={{ 
              fontWeight: record.highlight ? 'bold' : 'normal',
              color: record.highlight ? '#fa8c16' : 'inherit'
            }}
          >
            {text}
          </div>
        )
      }
    ];

    // Add currency columns dynamically
    const sampleRecord = groupwiseData[0];
    const currencyColumns = Object.keys(sampleRecord)
      .filter(key => !['deviation_bucket', 'highlight', 'key'].includes(key))
      .map(currency => ({
        title: currency,
        dataIndex: currency,
        key: currency,
        width: 80,
        align: 'center',
        render: (val) => val || 0
      }));

    const actionColumn = {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setSelectedBucket(record.deviation_bucket)}
        >
          View
        </Button>
      )
    };

    return [...baseColumns, ...currencyColumns, actionColumn];
  };

  const expandedColumns = [
    {
      title: 'Bucket Range',
      dataIndex: 'bucket_range',
      key: 'bucket_range',
    },
    {
      title: 'Alert Count',
      dataIndex: 'alert_count',
      key: 'alert_count',
      sorter: (a, b) => a.alert_count - b.alert_count,
    },
    {
      title: 'Avg Deviation',
      dataIndex: 'avg_deviation',
      key: 'avg_deviation',
      render: (val) => `${val}%`
    },
    {
      title: 'Max Deviation',
      dataIndex: 'max_deviation',
      key: 'max_deviation',
      render: (val) => `${val}%`
    }
  ];

  const drillDownColumns = [
    {
      title: 'Trade ID',
      dataIndex: 'trade_id',
      key: 'trade_id',
      width: 120,
    },
    {
      title: 'Currency Pair',
      dataIndex: 'ccypair',
      key: 'ccypair',
      width: 100,
    },
    {
      title: 'Deviation %',
      dataIndex: 'deviationpercent',
      key: 'deviationpercent',
      width: 100,
      render: (val) => `${val}%`,
      sorter: (a, b) => parseFloat(a.deviationpercent) - parseFloat(b.deviationpercent),
    },
    {
      title: 'Legal Entity',
      dataIndex: 'legal_entity',
      key: 'legal_entity',
      width: 120,
    },
    {
      title: 'Product Type',
      dataIndex: 'product_type',
      key: 'product_type',
      width: 120,
    },
    {
      title: 'Notional',
      dataIndex: 'notional_amount',
      key: 'notional_amount',
      width: 120,
      render: (val) => val ? new Intl.NumberFormat().format(val) : '-'
    }
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Groupwise Bucket Summary */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Groupwise Bucket Summary" size="small">
            <Table
              dataSource={groupwiseData}
              columns={getGroupwiseColumns()}
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
              rowClassName={(record) => record.highlight ? 'highlight-row' : ''}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Bucket Distribution" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="bucket" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="total" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Expanded Summary for High Deviations */}
      {expandedData.length > 0 && (
        <Card title="Expanded Summary (High Deviations)" size="small">
          <Table
            dataSource={expandedData}
            columns={expandedColumns}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>
      )}

      {/* Bucket Drill-Down */}
      {selectedBucket && (
        <Card 
          title={`Bucket Drill-Down: ${selectedBucket}`}
          size="small"
          extra={
            <Button 
              size="small" 
              onClick={() => setSelectedBucket(null)}
            >
              Close
            </Button>
          }
        >
          <Table
            dataSource={drillDownData}
            columns={drillDownColumns}
            pagination={{ pageSize: 20 }}
            size="small"
            scroll={{ x: 1000 }}
          />
        </Card>
      )}
    </Space>
  );
};

export default DeviationBuckets;