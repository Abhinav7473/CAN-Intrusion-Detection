"""
LSTM Autoencoder for anomaly detection
"""

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import mse
from sklearn.preprocessing import StandardScaler
import pandas as pd


class LSTMDetector:
    """Deep learning anomaly detection using LSTM Autoencoder"""
    
    def __init__(self, model_path: str = "models/lstm_autoencoder.h5", dataset_path: str = "data/CAN.csv"):
        """Load pre-trained LSTM model and scaler"""
        
        self.features = [
            "datetime", "Accelerometer1RMS", "Accelerometer2RMS", 
            "Current", "Pressure", "Temperature", "Thermocouple", 
            "Volume Flow RateRMS"
        ]
        self.seq_len = 10
        
        # Load model
        self.model = load_model(model_path, custom_objects={'mse': mse})
        
        # Fit scaler on training data
        df = pd.read_csv(dataset_path)
        df["datetime"] = pd.to_datetime(df["datetime"]).astype(int) / 10**9
        data = df[self.features].values
        
        self.scaler = StandardScaler()
        self.scaler.fit(data)
        
        # Calculate threshold from training data
        data_scaled = self.scaler.transform(data)
        X_train = self._create_sequences(data_scaled)
        X_train_pred = self.model.predict(X_train, verbose=0)
        reconstruction_errors = np.mean(np.abs(X_train_pred - X_train), axis=(1, 2))
        self.threshold = np.percentile(reconstruction_errors, 95)
        
        print(f"✅ LSTM Autoencoder loaded (threshold: {self.threshold:.4f})")
    
    def _create_sequences(self, data: np.ndarray) -> np.ndarray:
        """Create sliding window sequences"""
        X = []
        for i in range(len(data) - self.seq_len):
            X.append(data[i:i + self.seq_len])
        return np.array(X)
    
    def detect(self, sequence: list[list[float]]) -> tuple[bool, float]:
        """
        Detect anomaly in sequence of sensor readings
        
        Returns:
            (is_anomaly, reconstruction_error)
        """
        sequence = sequence[-self.seq_len:]
        sequence_scaled = self.scaler.transform(sequence)
        sequence_scaled = np.array([sequence_scaled])
        
        reconstruction = self.model.predict(sequence_scaled, verbose=0)
        error = np.mean(np.abs(reconstruction - sequence_scaled))
        is_anomaly = error > self.threshold
        
        return is_anomaly, error