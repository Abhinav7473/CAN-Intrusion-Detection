# CAN Intrusion Detection - HCI Research Platform

A modern, interactive system for real-time anomaly detection in automotive CAN bus networks, built with a focus on human-computer interaction research and explainable AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)

## 🎯 Project Overview

This system transforms traditional ML-based intrusion detection into an interactive research platform for studying:
- **Trust calibration** in automated security systems
- **Explainability effectiveness** for operator decision-making
- **Alert fatigue** and cognitive load in real-time monitoring
- **Progressive disclosure** as an interface design pattern

### Key Features

✅ **Real-Time Anomaly Detection**
- Live sensor data streaming (2-second intervals)
- One-Class SVM classification with feature importance
- Interactive threshold adjustment
- Color-coded visual feedback

✅ **Interactive Explainability**
- Click-to-explain anomaly investigation
- Feature contribution analysis with z-scores
- Progressive disclosure of technical details
- Comparative normal vs anomaly visualization

✅ **3D Visualization**
- Three.js-powered spatial representation
- Real-time point cloud updates
- Interactive camera controls
- Anomaly clustering in 3D space

✅ **Attack Simulation**
- Generate synthetic attacks (Fuzzy, Spoofing, Replay, DoS)
- Side-by-side pattern comparison
- Radar charts and statistical analysis
- CSV export for further research

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Real-Time  │  │   Attacks    │  │   3D Viz      │ │
│  │  Detection  │  │  Simulation  │  │   Analysis    │ │
│  └─────────────┘  └──────────────┘  └───────────────┘ │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                          │                               │
│                   Zustand Store                          │
│                   (Global State)                         │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API / WebSocket
┌──────────────────────────┴──────────────────────────────┐
│                  Backend (FastAPI)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  One-Class   │  │     LSTM     │  │   Battery    │ │
│  │     SVM      │  │  Autoencoder │  │     LSTM     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│              Models + Feature Importance                 │
└──────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### Backend
- Python 3.12 (3.9-3.12 supported)
- 4GB RAM minimum
- 500MB disk space for models

### Frontend
- Node.js 16+ 
- npm or yarn
- Modern browser with WebGL support

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Abhinav7473/CAN-Intrusion-Detection.git
cd CAN-Intrusion-Detection
git checkout fastapi-react-hci
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify structure
ls models/  # Should see: battery.h5, lstm_autoencoder.h5, scaler.pkl
ls data/    # Should see: CAN.csv

# Start server
python app.py
```

Backend will start on **http://localhost:8000**

Interactive API docs available at **http://localhost:8000/docs**

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on **http://localhost:3000**

### 4. Verify Installation

1. Navigate to http://localhost:3000
2. Check header shows "✅ Connected"
3. Click "Real-Time" → "Start Stream"
4. Verify data appears and updates every 2 seconds

## 📖 Usage Guide

### Real-Time Detection

**Purpose**: Monitor live sensor data with anomaly detection

**How to use**:
1. Navigate to **Real-Time** tab
2. Click **Start Stream**
3. Adjust threshold slider to control sensitivity
4. Click red dots on timeline to investigate anomalies
5. Click **Explain** button for detailed feature analysis

**Research applications**:
- Study operator response times to alerts
- Measure threshold preference across users
- Track click patterns on anomaly explanations
- A/B test different visualization styles

### Attack Simulation

**Purpose**: Generate and compare attack patterns

**How to use**:
1. Navigate to **Attacks** tab
2. Select attack type (Fuzzy/Spoofing/Replay/DoS)
3. Adjust sample count (10-200)
4. Click **Generate Attack**
5. Review comparison charts
6. Download CSV for analysis

**Research applications**:
- Compare detection rates across attack types
- Study pattern recognition in visualization
- Test operator ability to distinguish attacks

### 3D Analysis

**Purpose**: Explore sensor space with interactive visualization

**How to use**:
1. Collect data via Real-Time streaming
2. Navigate to **Analysis** tab
3. Rotate/zoom/pan with mouse
4. Click points to see details
5. Observe anomaly clustering

**Research applications**:
- Study spatial reasoning vs 2D charts
- Measure time-to-insight for cluster identification
- Compare 2D vs 3D for pattern recognition

## 🔧 Configuration

### Backend Configuration

**Adjust detection sensitivity** (`backend/models/svm_model.py`):
```python
# Line 32: Change threshold
prediction = 1 if anomaly_score >= 60 else -1  # Default: 60
```

**Change polling interval** (`frontend/src/App.jsx`):
```javascript
// Line 13: Change from 2000ms (2 seconds)
useRealtimeData(isStreaming, 2000)
```

### Frontend Configuration

**Customize colors** (`frontend/tailwind.config.js`):
```javascript
colors: {
  'anomaly': {
    'critical': '#EF4444',  // Red for high-severity
    'high': '#F59E0B',      // Orange
    'low': '#10B981',       // Green
  }
}
```

## 📊 Data Collection for Research

### Interaction Logging

Track user behavior by adding logging to components:
```javascript
// Example: Log threshold changes
const handleThresholdChange = (newValue) => {
  console.log({
    timestamp: Date.now(),
    action: 'threshold_adjusted',
    from: threshold,
    to: newValue,
    anomaly_count_before: anomalies.length
  })
  setThreshold(newValue)
}
```

### Export Data
```javascript
// Add to ControlPanel.jsx
const exportData = () => {
  const csv = readings.map(r => ({
    timestamp: r.timestamp,
    is_anomaly: r.is_anomaly,
    score: r.anomaly_score,
    user_clicked: r.user_clicked || false
  }))
  // Convert to CSV and download
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend (green checkmark)
- [ ] Real-time streaming works
- [ ] Anomalies are detected and highlighted
- [ ] Timeline is clickable
- [ ] Feature importance modal appears
- [ ] 3D visualization renders
- [ ] Attack generation works
- [ ] Comparison charts display

## 📁 Project Structure
```
CAN-Intrusion-Detection/
├── backend/
│   ├── app.py                      # FastAPI main app
│   ├── requirements.txt            # Python dependencies
│   ├── models/
│   │   ├── svm_model.py           # One-Class SVM detector
│   │   ├── lstm_model.py          # LSTM autoencoder
│   │   ├── battery_model.py       # Battery voltage detector
│   │   ├── battery.h5             # Pre-trained model
│   │   ├── lstm_autoencoder.h5    # Pre-trained model
│   │   └── scaler.pkl             # Feature scaler
│   ├── schemas/
│   │   └── requests.py            # Pydantic validation
│   ├── utils/
│   │   └── attack_gen.py          # Synthetic attack generator
│   └── data/
│       └── CAN.csv                # Training dataset
├── frontend/
│   ├── package.json               # Node dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Styling configuration
│   └── src/
│       ├── App.jsx                # Main application
│       ├── components/
│       │   ├── realtime/          # Real-time detection UI
│       │   ├── attacks/           # Attack simulation UI
│       │   └── analysis/          # 3D visualization UI
│       ├── hooks/
│       │   └── useRealtimeData.js # Polling logic
│       ├── stores/
│       │   └── useAnomalyStore.js # Global state
│       └── utils/
│           └── api.js             # API client
└── README.md
```

## 🐛 Troubleshooting

### Backend won't start

**Error**: `FileNotFoundError: CAN.csv`
```bash
# Verify file locations
ls backend/data/CAN.csv
ls backend/models/*.h5
```

**Error**: `ModuleNotFoundError: tensorflow`
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't connect

**Error**: "❌ Offline" in header
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check for port conflicts
lsof -i:8000
```

**Error**: Blank page
```bash
# Check browser console for errors
# Restart dev server
npm run dev
```

### 3D Visualization not rendering

**Error**: Black screen in Analysis tab
- Verify WebGL is enabled in browser
- Check for GPU/driver issues
- Try different browser

## 🎓 Research Applications

### Trust Calibration Study

**Research Question**: How do operators calibrate trust in ML systems?

**Method**:
1. Track threshold adjustments over time
2. Log confidence before/after seeing explanations
3. Measure detection rate preferences

**Data to collect**:
- Initial threshold setting
- Number of adjustments
- Final threshold value
- Time to reach stable preference

### Explanation Effectiveness

**Research Question**: Do feature importance explanations improve decision accuracy?

**Method**:
1. A/B test: Show vs hide explanations
2. Measure: Decision time, accuracy, confidence
3. Survey: Perceived helpfulness

**Implementation**:
```javascript
const variant = user.id % 2  // A/B split
const showExplanations = variant === 0
```

### Alert Fatigue

**Research Question**: At what detection rate do users experience alert fatigue?

**Method**:
1. Vary detection rate (20%, 40%, 60%, 80%)
2. Measure: Response time degradation
3. Track: Missed anomalies over time

## 🤝 Contributing

This project was developed for HCI research. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Abhinav Balakrishnan**
- GitHub: [@Abhinav7473](https://github.com/Abhinav7473)
- LinkedIn: [abhinav-balki](https://linkedin.com/in/abhinav-balki)

## 🙏 Acknowledgments

- Original Streamlit implementation: Team collaboration
- CAN bus dataset: [Kaggle](https://www.kaggle.com/datasets/ankitrajsh/can-bus-anomaly-detection-dataset)
- Research focus: VIT Chennai HCI studies

## 📚 References

1. One-Class SVM for Anomaly Detection
2. LSTM Autoencoders for Time-Series Analysis
3. Progressive Disclosure in Interface Design
4. Explainable AI for Security Systems

---

**Built with**: FastAPI • React • Three.js • TensorFlow • Scikit-learn

**Research Focus**: Human-Centered AI • Explainable ML • Operator Trust