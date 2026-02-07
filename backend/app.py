"""
FastAPI backend for CAN Intrusion Detection System
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from models.svm_model import SVMDetector
from models.lstm_model import LSTMDetector
from models.battery_model import BatteryDetector
from schemas.requests import SensorReading, AttackRequest
from utils.attack_gen import AttackGenerator

# Global model instances
svm_detector = None
lstm_detector = None
battery_detector = None
attack_generator = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models on startup"""
    global svm_detector, lstm_detector, battery_detector, attack_generator
    
    print("🚀 Loading ML models...")
    svm_detector = SVMDetector()
    lstm_detector = LSTMDetector()
    battery_detector = BatteryDetector()
    attack_generator = AttackGenerator()
    print("✅ Models loaded successfully!")
    
    yield
    
    print("🔴 Shutting down...")


app = FastAPI(
    title="CAN Intrusion Detection API",
    description="HCI Research Interface for Automotive Cybersecurity",
    version="2.0.0",
    lifespan=lifespan
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "online",
        "message": "CAN Intrusion Detection API",
        "version": "2.0.0"
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "models": {
            "svm": svm_detector is not None,
            "lstm": lstm_detector is not None,
            "battery": battery_detector is not None
        }
    }


@app.post("/api/attacks/generate")
async def generate_attack(request: AttackRequest):
    """Generate synthetic attack data"""
    try:
        attack_data = attack_generator.generate(
            attack_type=request.attack_type,
            num_samples=request.num_samples
        )
        
        return {
            "success": True,
            "attack_type": request.attack_type,
            "samples": attack_data,
            "count": len(attack_data)
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.post("/api/anomaly/detect-svm")
async def detect_svm(reading: SensorReading):
    """Real-time anomaly detection using One-Class SVM"""
    try:
        prediction, score = svm_detector.detect(reading.to_array())
        
        return {
            "success": True,
            "method": "One-Class SVM",
            "is_anomaly": prediction == 1,
            "anomaly_score": float(score),
            "confidence": abs(float(score)) / 100.0,
            "timestamp": reading.datetime
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.post("/api/anomaly/detect-lstm")
async def detect_lstm(readings: list[SensorReading]):
    """LSTM Autoencoder anomaly detection"""
    try:
        if len(readings) < 10:
            return JSONResponse(
                status_code=400,
                content={"error": "LSTM requires at least 10 sequential readings"}
            )
        
        sequence = [r.to_array() for r in readings[-10:]]
        is_anomaly, reconstruction_error = lstm_detector.detect(sequence)
        
        return {
            "success": True,
            "method": "LSTM Autoencoder",
            "is_anomaly": is_anomaly,
            "reconstruction_error": float(reconstruction_error),
            "threshold": lstm_detector.threshold
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.post("/api/battery/detect")
async def detect_battery_spoofing(readings: list[SensorReading]):
    """Battery voltage spoofing detection"""
    try:
        if len(readings) < 10:
            return JSONResponse(
                status_code=400,
                content={"error": "Battery detection requires at least 10 readings"}
            )
        
        voltage_sequence = [(r.datetime, r.voltage) for r in readings[-10:]]
        is_anomaly, score = battery_detector.detect(voltage_sequence)
        
        return {
            "success": True,
            "method": "Battery LSTM",
            "is_spoofed": is_anomaly,
            "anomaly_score": float(score)
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.get("/api/data/sample")
async def get_sample_data(n: int = 10):
    """Get random sample from CAN.csv"""
    try:
        samples = attack_generator.get_normal_samples(n)
        return {
            "success": True,
            "samples": samples,
            "count": len(samples)
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.websocket("/ws/realtime")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket for real-time streaming"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_json()
            reading = SensorReading(**data)
            
            prediction, score = svm_detector.detect(reading.to_array())
            
            await websocket.send_json({
                "timestamp": reading.datetime,
                "is_anomaly": prediction == 1,
                "score": float(score),
                "severity": "high" if score > 80 else "medium" if score > 60 else "low"
            })
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )