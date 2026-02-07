"""
One-Class SVM anomaly detector with feature importance
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
        
        self.feature_names = [
            "Timestamp", "Accelerometer 1", "Accelerometer 2",
            "Current", "Pressure", "Temperature", "Thermocouple",
            "Volume Flow Rate", "Voltage"
        ]
        
        # Load and prepare training data
        df = pd.read_csv(dataset_path)
        df["datetime"] = pd.to_datetime(df["datetime"]).astype(int) / 10**9
        
        # Train scaler
        self.scaler = StandardScaler()
        X_train = df[self.features]
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Store means and stds for feature importance
        self.feature_means = np.mean(X_train_scaled, axis=0)
        self.feature_stds = np.std(X_train_scaled, axis=0)
        
        # Train One-Class SVM
        self.model = OneClassSVM(kernel="rbf", gamma="auto", nu=0.05)
        self.model.fit(X_train_scaled)
        
        print("✅ One-Class SVM trained successfully")
    
    def detect(self, sensor_values: list[float]) -> tuple[int, float, dict]:
        """
        Detect anomaly in sensor reading with feature importance
        
        Returns:
            (prediction, anomaly_score, feature_importance) where:
                prediction: 1 if anomaly, -1 if normal
                anomaly_score: Distance from decision boundary
                feature_importance: Dict of feature contributions
        """
        # Scale input
        sensor_values_scaled = self.scaler.transform([sensor_values])
        
        # Get anomaly score
        anomaly_score = self.model.decision_function(sensor_values_scaled)[0]
        prediction = 1 if anomaly_score >= 60 else -1
        
        # Calculate feature importance (z-scores)
        z_scores = np.abs((sensor_values_scaled[0] - self.feature_means) / self.feature_stds)
        
        # Create feature importance dict
        feature_importance = []
        for i, (name, z_score, value) in enumerate(zip(self.feature_names, z_scores, sensor_values)):
            feature_importance.append({
                "feature": name,
                "z_score": float(z_score),
                "value": float(value),
                "contribution": float(z_score / np.sum(z_scores) * 100)  # Percentage
            })
        
        # Sort by contribution (highest first)
        feature_importance.sort(key=lambda x: x["contribution"], reverse=True)
        
        return prediction, anomaly_score, {"features": feature_importance}