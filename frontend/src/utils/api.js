import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const checkHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

// Generate attack data
export const generateAttack = async (attackType, numSamples) => {
  const response = await api.post('/api/attacks/generate', {
    attack_type: attackType,
    num_samples: numSamples,
  });
  return response.data;
};

// Detect anomaly with SVM
export const detectAnomalySVM = async (sensorReading) => {
  const response = await api.post('/api/anomaly/detect-svm', sensorReading);
  return response.data;
};

// Detect anomaly with LSTM (requires sequence of 10)
export const detectAnomalyLSTM = async (readings) => {
  const response = await api.post('/api/anomaly/detect-lstm', readings);
  return response.data;
};

// Detect battery spoofing
export const detectBatterySpoofing = async (readings) => {
  const response = await api.post('/api/battery/detect', readings);
  return response.data;
};

// Get sample data from dataset
export const getSampleData = async (n = 10) => {
  const response = await api.get(`/api/data/sample?n=${n}`);
  return response.data;
};

// WebSocket connection for real-time streaming
export const createWebSocket = () => {
  return new WebSocket('ws://localhost:8000/ws/realtime');
};

export default api;