import axios from 'axios';

class DataService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async loadData(sidebarData) {
    try {
      // Simulate API call to backend that processes the data
      const response = await this.api.post('/api/load-sample-data', sidebarData);
      return response.data.data || this.getMockData(sidebarData);
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Return mock data structure for development
      return this.getMockData(sidebarData);
    }
  }

  getMockData(sidebarData) {
    // Mock data structure matching the Python backend
    const mockData = {
      trade_data: this.generateMockTradeData(500),
      exception_data: this.generateMockExceptionData(100),
      threshold_df: this.generateMockThresholdData(),
      reason_code_mapping: this.generateMockReasonCodeMapping(),
      alerts_df: this.generateMockAlerts(150),
      groupwise_summary: this.generateMockGroupwiseSummary(),
      expanded_summary: this.generateMockExpandedSummary(),
      legal_entity_summary: this.generateMockLegalEntitySummary(),
      ops_analysis: this.generateMockOpsAnalysis()
    };

    return mockData;
  }

  generateMockTradeData(count) {
    const currencyPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'];
    const productTypes = ['FX_SPOT', 'FX_FORWARD', 'FX_SWAP', 'FX_OPTION'];
    const legalEntities = ['Entity1', 'Entity2', 'Entity3'];
    const sourceSystems = ['SYSTEM_A', 'SYSTEM_B', 'SYSTEM_C'];

    return Array.from({ length: count }, (_, i) => {
      const ccypair = currencyPairs[Math.floor(Math.random() * currencyPairs.length)];
      return {
        trade_id: `TRD${String(i + 1).padStart(8, '0')}`,
        trade_date: '2025-01-15',
        business_date: '2025-01-15',
        ccypair,
        ccy1: ccypair.substring(0, 3),
        ccy2: ccypair.substring(3, 6),
        legal_entity: legalEntities[Math.floor(Math.random() * legalEntities.length)],
        product_type: productTypes[Math.floor(Math.random() * productTypes.length)],
        source_system: sourceSystems[Math.floor(Math.random() * sourceSystems.length)],
        notional_amount: Math.floor(Math.random() * 10000000) + 100000,
        deviationpercent: (Math.random() * 5).toFixed(4),
        alert_description: 'Threshold breach detected',
        trader_id: `TRADER${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
        desk: 'FX_SPOT_DESK',
        region: ['APAC', 'EMEA', 'AMERICAS'][Math.floor(Math.random() * 3)]
      };
    });
  }

  generateMockExceptionData(count) {
    const reasonCodes = ['RC001_PRICE_VALIDATION_FAILED', 'RC002_SETTLEMENT_DELAY', 'RC003_COUNTERPARTY_ISSUE'];
    const statuses = ['OPEN', 'CLOSED', 'IN_PROGRESS'];

    return Array.from({ length: count }, (_, i) => ({
      trade_id: `TRD${String(Math.floor(Math.random() * 500) + 1).padStart(8, '0')}`,
      exception_id: `EXC${String(i + 1).padStart(8, '0')}`,
      business_date: '2025-01-15',
      created_date: '2025-01-15',
      closed_date: Math.random() > 0.3 ? '2025-01-16' : null,
      reasoncodeid: reasonCodes[Math.floor(Math.random() * reasonCodes.length)],
      high_level_code: ['PRICING_ISSUES', 'SETTLEMENT_ISSUES', 'COUNTERPARTY_ISSUES'][Math.floor(Math.random() * 3)],
      exception_status: statuses[Math.floor(Math.random() * statuses.length)],
      assigned_to: `OPS_USER_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
      priority: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)]
    }));
  }

  generateMockThresholdData() {
    const legalEntities = ['Entity1', 'Entity2', 'Entity3', 'ALL'];
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD'];

    const data = [];
    legalEntities.forEach(entity => {
      currencies.forEach(currency => {
        data.push({
          LegalEntity: entity,
          CCY: currency,
          Original_Group: 'Group1',
          Original_Threshold: (Math.random() * 2 + 0.5).toFixed(2),
          Proposed_Group: 'Group1',
          Proposed_Threshold: (Math.random() * 1.5 + 0.3).toFixed(2),
          Adjusted_Group: 'Group1',
          Adjusted_Threshold: (Math.random() * 1.5 + 0.3).toFixed(2)
        });
      });
    });

    return data;
  }

  generateMockReasonCodeMapping() {
    return [
      { reasoncodeid: 'RC001_PRICE_VALIDATION_FAILED', high_level_code: 'PRICING_ISSUES', description: 'Price validation failures' },
      { reasoncodeid: 'RC002_SETTLEMENT_DELAY', high_level_code: 'SETTLEMENT_ISSUES', description: 'Settlement processing delays' },
      { reasoncodeid: 'RC003_COUNTERPARTY_ISSUE', high_level_code: 'COUNTERPARTY_ISSUES', description: 'Counterparty related problems' }
    ];
  }

  generateMockAlerts(count) {
    const tradeData = this.generateMockTradeData(count);
    return tradeData.filter(trade => parseFloat(trade.deviationpercent) > 1.0);
  }

  generateMockGroupwiseSummary() {
    return [
      { Deviation_Bucket: '0.5-1.0%', USD: 5, EUR: 3, GBP: 2, highlight: false },
      { Deviation_Bucket: '1.0-1.5%', USD: 8, EUR: 6, GBP: 4, highlight: false },
      { Deviation_Bucket: '1.5-2.0%', USD: 12, EUR: 8, GBP: 6, highlight: true },
      { Deviation_Bucket: '2.0%+', USD: 15, EUR: 10, GBP: 8, highlight: true }
    ];
  }

  generateMockExpandedSummary() {
    return [
      { bucket_range: '2.0-2.5%', alert_count: 25, avg_deviation: 2.2, max_deviation: 2.4 },
      { bucket_range: '2.5-3.0%', alert_count: 18, avg_deviation: 2.7, max_deviation: 2.9 },
      { bucket_range: '3.0%+', alert_count: 12, avg_deviation: 3.5, max_deviation: 4.8 }
    ];
  }

  generateMockLegalEntitySummary() {
    return [
      { legal_entity: 'Entity1', alert_count: 45, impact_percentage: 32.5 },
      { legal_entity: 'Entity2', alert_count: 38, impact_percentage: 27.8 },
      { legal_entity: 'Entity3', alert_count: 52, impact_percentage: 39.7 }
    ];
  }

  generateMockOpsAnalysis() {
    return [
      { high_level_code: 'PRICING_ISSUES', count: 25, percentage: 35.2 },
      { high_level_code: 'SETTLEMENT_ISSUES', count: 18, percentage: 25.4 },
      { high_level_code: 'COUNTERPARTY_ISSUES', count: 15, percentage: 21.1 },
      { high_level_code: 'SYSTEM_ISSUES', count: 13, percentage: 18.3 }
    ];
  }

  async uploadFile(file, fileType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);

    try {
      const response = await this.api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async exportData(data, format = 'csv') {
    try {
      const response = await this.api.post('/api/export', {
        data,
        format
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gfx_dashboard_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }
}

export default new DataService();