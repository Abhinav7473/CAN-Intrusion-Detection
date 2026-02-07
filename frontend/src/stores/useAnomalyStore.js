import { create } from 'zustand'

const useAnomalyStore = create((set) => ({
  // Sensor readings history (last 50)
  readings: [],
  
  // Anomaly detections history
  anomalies: [],
  
  // Current detection threshold
  threshold: 60,
  
  // Is streaming active?
  isStreaming: false,

  // NEW: Track which anomaly is selected
  selectedAnomaly: null,
  
  // Actions
  addReading: (reading, detection) => set((state) => ({
    readings: [...state.readings.slice(-49), { ...reading, ...detection, timestamp: Date.now() }],
    anomalies: detection.is_anomaly 
      ? [...state.anomalies.slice(-29), { ...detection, timestamp: Date.now() }]
      : state.anomalies
  })),
  
  setThreshold: (threshold) => set({ threshold }),
  
  setStreaming: (isStreaming) => set({ isStreaming }),
  
  clearHistory: () => set({ readings: [], anomalies: [] }),

  // NEW: Select an anomaly to view details
  selectAnomaly: (anomaly) => set({ selectedAnomaly: anomaly }),

  clearSelection: () => set({ selectedAnomaly: null })
}))

export default useAnomalyStore