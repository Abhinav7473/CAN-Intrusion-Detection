# Phase 1 Documentation: Real-Time Anomaly Detection

## Overview
Built a complete real-time anomaly detection interface that streams CAN bus sensor data, detects anomalies using One-Class SVM, and provides interactive explanations for detected threats.

## What We Built

### 1. **Tech Stack Migration** ✅
**From:** Streamlit + MySQL monolithic app  
**To:** FastAPI backend + React frontend

**Backend (FastAPI):**
- Python 3.12 + TensorFlow 2.17
- FastAPI REST API with CORS
- Three ML models: One-Class SVM, LSTM Autoencoder, Battery LSTM
- Clean model wrappers with feature importance calculation
- No database dependency (MySQL removed)

**Frontend (React):**
- React 18 + Vite
- Tailwind CSS for styling
- Zustand for state management
- Recharts for data visualization
- Axios for API communication

### 2. **Real-Time Detection System** ✅

**Architecture:**
```
Frontend (2s polling) → FastAPI → SVM Detector → Feature Importance → Frontend
```

**Key Components:**

**A. Control Panel**
- Start/Stop streaming
- Live statistics (total readings, anomalies, detection rate)
- Interactive threshold adjustment (0-100 slider)
- Clear history functionality
- Settings panel with progressive disclosure

**B. Live Sensor Display**
- 8 real-time sensor readings (accelerometers, current, pressure, temperature, thermocouple, voltage, flow rate)
- Color-coded status indicator (green=normal, red=anomaly)
- Anomaly score visualization with progress bar
- "Explain" button for immediate anomaly investigation

**C. Anomaly Timeline**
- Recharts line graph showing last 50 readings
- Color-coded dots (blue=normal, red=anomaly)
- Adjustable threshold reference line
- Interactive tooltips on hover
- Clickable anomaly dots for detailed explanation

### 3. **Interactive Explainability** ✅

**Feature Importance Calculation:**
- Backend computes z-scores for each sensor
- Identifies which sensors deviated most from normal patterns
- Returns ranked list of contributing features with percentages

**Explainability Modal:**
- Triggered by clicking red dots on timeline OR "Explain" button
- Shows anomaly score and detection confidence
- Top 5 contributing sensors with:
  - Contribution percentage
  - Actual sensor value
  - Z-score (standard deviations from normal)
  - Color-coded bars (red for high contributors)
- Expandable "Show all sensors" for complete breakdown
- Progressive disclosure design (summary → details)

### 4. **State Management** ✅

**Zustand Store (`useAnomalyStore`):**
- Readings history (last 50)
- Anomalies history (last 30)
- Current threshold setting
- Streaming state
- Selected anomaly for modal
- Actions: addReading, setThreshold, selectAnomaly, clearHistory

**Custom Hook (`useRealtimeData`):**
- Manages 2-second polling interval
- Fetches random sample from backend
- Calls SVM detection endpoint
- Updates Zustand store
- Automatically starts/stops based on streaming state

### 5. **User Experience Features** ✅

**Progressive Disclosure:**
- Settings panel toggles on/off
- Expandable sensor list in modal
- Tooltip details on hover

**Visual Feedback:**
- Pulsing "LIVE" indicator when streaming
- Animated status icons
- Smooth transitions on interactions
- Color-coded severity (green, orange, red)

**Interaction Patterns:**
- Click red dots → see explanation
- Click "Explain" button → same modal
- Adjust threshold → see real-time impact
- Hover anomaly dots → they scale up (cursor: pointer)

## File Structure Created
```
backend/
├── app.py                      # FastAPI main app
├── requirements.txt            # Clean dependencies (no MySQL)
├── models/
│   ├── svm_model.py           # One-Class SVM with feature importance
│   ├── lstm_model.py          # LSTM Autoencoder
│   ├── battery_model.py       # Battery voltage detection
│   ├── battery.h5
│   ├── lstm_autoencoder.h5
│   └── scaler.pkl
├── schemas/
│   └── requests.py            # Pydantic validation models
├── utils/
│   └── attack_gen.py          # Synthetic attack generator
└── data/
    └── CAN.csv

frontend/
└── src/
    ├── components/
    │   └── realtime/
    │       ├── RealtimeView.jsx       # Main view container
    │       ├── ControlPanel.jsx       # Stream controls & stats
    │       ├── SensorReadings.jsx     # Live sensor display
    │       ├── AnomalyTimeline.jsx    # Recharts timeline
    │       └── FeatureImportance.jsx  # Explainability modal
    ├── hooks/
    │   └── useRealtimeData.js         # Polling logic
    ├── stores/
    │   └── useAnomalyStore.js         # Global state
    ├── utils/
    │   └── api.js                      # Axios API calls
    ├── App.jsx                         # Main app with navigation
    ├── main.jsx
    └── index.css
```

## API Endpoints Used
```
GET  /api/health               # Backend health check
GET  /api/data/sample?n=1      # Get random sensor sample
POST /api/anomaly/detect-svm   # SVM detection + feature importance