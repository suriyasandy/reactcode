import React, { useState } from 'react';
import { Table, Button, InputNumber, Space, message } from 'antd';
import { EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';

const ThresholdTable = ({ data, mode }) => {
  const [editingKey, setEditingKey] = useState('');
  const [editedData, setEditedData] = useState([...data]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const newData = [...editedData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        setEditingKey('');
        message.success('Threshold updated successfully');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleInputChange = (value, key, field) => {
    const newData = [...editedData];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][field] = value;
      setEditedData(newData);
    }
  };

  const resetToProposed = () => {
    const resetData = editedData.map(item => ({
      ...item,
      Adjusted_Threshold: item.Proposed_Threshold,
      Adjusted_Group: item.Proposed_Group
    }));
    setEditedData(resetData);
    message.success('Thresholds reset to proposed values');
  };

  const columns = [
    {
      title: 'Legal Entity',
      dataIndex: 'LegalEntity',
      key: 'LegalEntity',
      width: 120,
    },
    {
      title: mode === 'currency' ? 'Currency' : 'Group',
      dataIndex: mode === 'currency' ? 'CCY' : 'Original_Group',
      key: mode === 'currency' ? 'CCY' : 'Original_Group',
      width: 100,
    },
    {
      title: 'Original Threshold',
      dataIndex: 'Original_Threshold',
      key: 'Original_Threshold',
      width: 130,
      render: (val) => `${val}%`,
    },
    {
      title: 'Proposed Threshold',
      dataIndex: 'Proposed_Threshold',
      key: 'Proposed_Threshold',
      width: 130,
      render: (val) => `${val}%`,
    },
    {
      title: 'Adjusted Threshold',
      dataIndex: 'Adjusted_Threshold',
      key: 'Adjusted_Threshold',
      width: 130,
      render: (val, record) => {
        const editing = isEditing(record);
        return editing ? (
          <InputNumber
            value={val}
            onChange={(value) => handleInputChange(value, record.key, 'Adjusted_Threshold')}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            style={{ width: '100%' }}
            step={0.1}
            min={0}
            max={10}
          />
        ) : (
          `${val}%`
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button
              icon={<SaveOutlined />}
              size="small"
              onClick={() => save(record.key)}
              type="primary"
            />
            <Button
              icon={<UndoOutlined />}
              size="small"
              onClick={cancel}
            />
          </Space>
        ) : (
          <Button
            icon={<EditOutlined />}
            size="small"
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          />
        );
      },
    },
  ];

  // Add key to data for table rendering
  const dataWithKeys = editedData.map((item, index) => ({
    ...item,
    key: `${item.LegalEntity}_${item.CCY || item.Original_Group}_${index}`
  }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button onClick={resetToProposed} icon={<UndoOutlined />}>
            Reset to Proposed
          </Button>
          <Button type="primary">
            Run Impact Analysis
          </Button>
        </Space>
      </div>
      
      <Table
        bordered
        dataSource={dataWithKeys}
        columns={columns}
        pagination={{ pageSize: 10 }}
        size="small"
        scroll={{ x: 600 }}
      />
    </div>
  );
};

export default ThresholdTable;