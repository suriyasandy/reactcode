import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Dashboard data endpoints
  async loadSampleData(params) {
    const response = await this.api.post('/api/load-sample-data', params);
    return response.data;
  }

  async loadTradeData(params) {
    const response = await this.api.post('/api/load-trade-data', params);
    return response.data;
  }

  async loadExceptionData(params) {
    const response = await this.api.post('/api/load-exception-data', params);
    return response.data;
  }

  async processThresholds(file, mode) {
    const formData = new FormData();
    formData.append('threshold_file', file);
    formData.append('threshold_mode', mode);
    
    const response = await this.api.post('/api/process-thresholds', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async runImpactAnalysis(params) {
    const response = await this.api.post('/api/run-impact-analysis', params);
    return response.data;
  }

  async updateThresholds(thresholdUpdates) {
    const response = await this.api.post('/api/update-thresholds', thresholdUpdates);
    return response.data;
  }

  // File upload endpoints
  async uploadTradeFiles(files) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`trade_file_${index}`, file);
    });
    
    const response = await this.api.post('/api/upload-trade-files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadExceptionFile(file) {
    const formData = new FormData();
    formData.append('exception_file', file);
    
    const response = await this.api.post('/api/upload-exception-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadReasonCodeFile(file) {
    const formData = new FormData();
    formData.append('reason_code_file', file);
    
    const response = await this.api.post('/api/upload-reason-code-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Export endpoints
  async exportData(data, format = 'csv') {
    const response = await this.api.post('/api/export-data', {
      data,
      format
    }, {
      responseType: 'blob'
    });

    // Create download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gfx_analysis_${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  }

  // Authentication endpoints
  async login(credentials) {
    const response = await this.api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    const response = await this.api.post('/api/auth/logout');
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.api.get('/api/health');
    return response.data;
  }
}

export default new ApiService();