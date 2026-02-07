"""
Battery voltage spoofing detector
"""

import numpy as np
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import mse


class BatteryDetector:
    """Detect voltage spoofing attacks on EV battery"""
    
    def __init__(self, model_path: str = "models/battery.h5", scaler_path: str = "models/scaler.pkl"):
        """Load battery LSTM model and scaler"""
        
        self.seq_len = 10
        self.model = load_model(model_path, custom_objects={'mse': mse})
        
        with open(scaler_path, "rb") as f:
            self.scaler = pickle.load(f)
        
        self.threshold = 0.05
        print("✅ Battery detector loaded")
    
    def detect(self, voltage_sequence: list[tuple[float, float]]) -> tuple[bool, float]:
        """
        Detect battery voltage spoofing
        
        Args:
            voltage_sequence: List of (timestamp, voltage) tuples
        
        Returns:
            (is_spoofed, anomaly_score)
        """
        voltage_sequence = voltage_sequence[-self.seq_len:]
        data = np.array([[ts, v] for ts, v in voltage_sequence])
        data_scaled = self.scaler.transform(data)
        data_scaled = np.array([data_scaled])
        
        reconstruction = self.model.predict(data_scaled, verbose=0)
        error = np.mean(np.abs(reconstruction - data_scaled))
        is_spoofed = error > self.threshold
        
        return is_spoofed, error