import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Radio, 
  Select, 
  DatePicker, 
  Button, 
  Upload, 
  Typography, 
  Divider,
  Tag,
  Alert,
  Space
} from 'antd';
import { 
  UploadOutlined, 
  ReloadOutlined, 
  DatabaseOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Sidebar = ({ data, onChange, onRefresh }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      handleChange('start_date', dates[0].format('YYYY-MM-DD'));
      handleChange('end_date', dates[1].format('YYYY-MM-DD'));
    }
  };

  const sampleDataInfo = (
    <Alert
      message="Sample Data Available"
      description="36 trade files with 15,000+ records from 2025-2026"
      type="success"
      showIcon
      style={{ marginBottom: 16 }}
    />
  );

  return (
    <div style={{ padding: '16px', height: '100vh', overflowY: 'auto' }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        <SettingOutlined /> Configuration
      </Title>

      {/* Data Source Selection */}
      <Card title="📊 Data Sources" size="small" style={{ marginBottom: 16 }}>
        <Radio.Group
          value={formData.data_source_mode}
          onChange={(e) => handleChange('data_source_mode', e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical">
            <Radio value="Sample Data">Sample Data</Radio>
            <Radio value="API">API</Radio>
            <Radio value="Manual Upload">Manual Upload</Radio>
          </Space>
        </Radio.Group>
        
        {formData.data_source_mode === 'Sample Data' && sampleDataInfo}
      </Card>

      {/* Product Types */}
      <Card title="📈 Product Types" size="small" style={{ marginBottom: 16 }}>
        <Select
          mode="multiple"
          value={formData.product_types}
          onChange={(value) => handleChange('product_types', value)}
          style={{ width: '100%' }}
          options={[
            { label: 'FX Spot', value: 'FX_SPOT' },
            { label: 'FX Forward', value: 'FX_FORWARD' },
            { label: 'FX Swap', value: 'FX_SWAP' },
            { label: 'FX Option', value: 'FX_OPTION' }
          ]}
        />
      </Card>

      {/* Legal Entities */}
      <Card title="🏢 Legal Entities" size="small" style={{ marginBottom: 16 }}>
        <Select
          mode="multiple"
          value={formData.legal_entities}
          onChange={(value) => handleChange('legal_entities', value)}
          style={{ width: '100%' }}
          options={[
            { label: 'Entity 1', value: 'Entity1' },
            { label: 'Entity 2', value: 'Entity2' },
            { label: 'Entity 3', value: 'Entity3' },
            { label: 'All Entities', value: 'ALL' }
          ]}
        />
      </Card>

      {/* Source Systems */}
      <Card title="💻 Source Systems" size="small" style={{ marginBottom: 16 }}>
        <Select
          mode="multiple"
          value={formData.source_systems}
          onChange={(value) => handleChange('source_systems', value)}
          style={{ width: '100%' }}
          options={[
            { label: 'System A', value: 'SYSTEM_A' },
            { label: 'System B', value: 'SYSTEM_B' },
            { label: 'System C', value: 'SYSTEM_C' }
          ]}
        />
      </Card>

      {/* Date Range */}
      <Card title="📅 Date Range" size="small" style={{ marginBottom: 16 }}>
        <RangePicker
          value={[
            moment(formData.start_date),
            moment(formData.end_date)
          ]}
          onChange={handleDateChange}
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
        />
        {formData.data_source_mode === 'Sample Data' && (
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 8 }}>
            Sample data: 2025-01-01 to 2025-03-31
          </Text>
        )}
      </Card>

      {/* Dashboard Mode */}
      <Card title="📊 Dashboard Mode" size="small" style={{ marginBottom: 16 }}>
        <Radio.Group
          value={formData.dashboard_mode}
          onChange={(e) => handleChange('dashboard_mode', e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical">
            <Radio value="Simplified">Simplified</Radio>
            <Radio value="Advanced">Advanced</Radio>
          </Space>
        </Radio.Group>
      </Card>

      {/* File Uploads for Manual Mode */}
      {formData.data_source_mode === 'Manual Upload' && (
        <>
          <Card title="📁 File Uploads" size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload>
                <Button icon={<UploadOutlined />} size="small">
                  Trade Data Files
                </Button>
              </Upload>
              <Upload>
                <Button icon={<UploadOutlined />} size="small">
                  Exception Data
                </Button>
              </Upload>
              <Upload>
                <Button icon={<UploadOutlined />} size="small">
                  Threshold Config
                </Button>
              </Upload>
              <Upload>
                <Button icon={<UploadOutlined />} size="small">
                  Reason Codes
                </Button>
              </Upload>
            </Space>
          </Card>
        </>
      )}

      {/* Action Buttons */}
      <Card size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            icon={<DatabaseOutlined />}
            onClick={onRefresh}
            style={{ width: '100%' }}
          >
            Load Data
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            style={{ width: '100%' }}
          >
            Refresh
          </Button>
        </Space>
      </Card>

      {/* Data Info */}
      <Card title="ℹ️ Data Info" size="small" style={{ marginTop: 16 }}>
        <Space direction="vertical" size="small">
          <div>
            <Tag color="blue">Trade Records</Tag>
            <Text>Loading...</Text>
          </div>
          <div>
            <Tag color="green">Alerts</Tag>
            <Text>Loading...</Text>
          </div>
          <div>
            <Tag color="orange">Exceptions</Tag>
            <Text>Loading...</Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Sidebar;