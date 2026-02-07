"""
One-Class SVM anomaly detector
"""

import pandas as pd
import numpy as np
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler


class SVMDetector:
    """Real-time anomaly detection using One-Class SVM"""
    
    def __init__(self, dataset_path: str = "data/CAN.csv"):
        """Initialize and train SVM on normal data"""
        self.features = [
            "datetime", "Accelerometer1RMS", "Accelerometer2RMS", 
            "Current", "Pressure", "Temperature", "Thermocouple", 
            "Volume Flow RateRMS", "Voltage"
        ]
        
        # Load and prepare training data
        df = pd.read_csv(dataset_path)
        df["datetime"] = pd.to_datetime(df["datetime"]).astype(int) / 10**9
        
        # Train scaler
        self.scaler = StandardScaler()
        X_train = df[self.features]
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train One-Class SVM
        self.model = OneClassSVM(kernel="rbf", gamma="auto", nu=0.05)
        self.model.fit(X_train_scaled)
        
        print("✅ One-Class SVM trained successfully")
    
    def detect(self, sensor_values: list[float]) -> tuple[int, float]:
        """
        Detect anomaly in sensor reading
        
        Returns:
            (prediction, anomaly_score) where:
                prediction: 1 if anomaly, -1 if normal
                anomaly_score: Distance from decision boundary
        """
        sensor_values_scaled = self.scaler.transform([sensor_values])
        anomaly_score = self.model.decision_function(sensor_values_scaled)[0]
        prediction = 1 if anomaly_score >= 60 else -1
        
        return prediction, anomaly_score