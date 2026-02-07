"""
Synthetic attack data generator
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime


class AttackGenerator:
    """Generate synthetic CAN bus attack data"""
    
    def __init__(self, dataset_path: str = "data/CAN.csv"):
        """Load normal data for generating attacks"""
        self.df = pd.read_csv(dataset_path)
    
    def generate(self, attack_type: str, num_samples: int = 10) -> list[dict]:
        """Generate synthetic attack data"""
        if attack_type == "fuzzy":
            return self._generate_fuzzy(num_samples)
        elif attack_type == "spoofing":
            return self._generate_spoofing(num_samples)
        elif attack_type == "replay":
            return self._generate_replay(num_samples)
        elif attack_type == "dos":
            return self._generate_dos(num_samples)
        else:
            raise ValueError(f"Unknown attack type: {attack_type}")
    
    def _generate_fuzzy(self, num_samples: int) -> list[dict]:
        """Fuzzy attack: random sensor values"""
        attack_data = []
        for _ in range(num_samples):
            attack_data.append({
                "tag": f"Fuzzy_{random.randint(1000, 9999)}",
                "datetime": datetime.now().isoformat(),
                "Accelerometer1RMS": random.uniform(0, 50),
                "Accelerometer2RMS": random.uniform(0, 50),
                "Current": random.uniform(0, 10),
                "Pressure": random.uniform(10, 100),
                "Temperature": random.uniform(20, 100),
                "Thermocouple": random.uniform(10, 50),
                "Voltage": random.uniform(200, 250),
                "VolumeFlowRateRMS": random.uniform(5, 50),
                "Attack": "Fuzzy"
            })
        return attack_data
    
    def _generate_spoofing(self, num_samples: int) -> list[dict]:
        """Spoofing attack: slightly modified normal data"""
        sampled_rows = self.df.sample(n=num_samples)
        attack_data = []
        
        for _, row in sampled_rows.iterrows():
            attack_data.append({
                "tag": row["tag"],
                "datetime": datetime.now().isoformat(),
                "Accelerometer1RMS": row["Accelerometer1RMS"] + random.uniform(-2, 2),
                "Accelerometer2RMS": row["Accelerometer2RMS"] + random.uniform(-2, 2),
                "Current": row["Current"] + random.uniform(-1, 1),
                "Pressure": row["Pressure"] + random.uniform(-5, 5),
                "Temperature": row["Temperature"] + random.uniform(-3, 3),
                "Thermocouple": row["Thermocouple"] + random.uniform(-2, 2),
                "Voltage": row["Voltage"] + random.uniform(-5, 5),
                "VolumeFlowRateRMS": row["Volume Flow RateRMS"] + random.uniform(-3, 3),
                "Attack": "Spoofing"
            })
        return attack_data
    
    def _generate_replay(self, num_samples: int) -> list[dict]:
        """Replay attack: old data with new timestamp"""
        sampled_rows = self.df.sample(n=num_samples)
        attack_data = []
        
        for _, row in sampled_rows.iterrows():
            attack_data.append({
                "tag": row["tag"],
                "datetime": datetime.now().isoformat(),
                "Accelerometer1RMS": row["Accelerometer1RMS"],
                "Accelerometer2RMS": row["Accelerometer2RMS"],
                "Current": row["Current"],
                "Pressure": row["Pressure"],
                "Temperature": row["Temperature"],
                "Thermocouple": row["Thermocouple"],
                "Voltage": row["Voltage"],
                "VolumeFlowRateRMS": row["Volume Flow RateRMS"],
                "Attack": "Replay"
            })
        return attack_data
    
    def _generate_dos(self, num_samples: int) -> list[dict]:
        """DoS attack: flood with repeated data"""
        sampled_rows = self.df.sample(n=num_samples)
        attack_data = []
        
        for _ in range(5):
            for _, row in sampled_rows.iterrows():
                attack_data.append({
                    "tag": row["tag"],
                    "datetime": datetime.now().isoformat(),
                    "Accelerometer1RMS": row["Accelerometer1RMS"],
                    "Accelerometer2RMS": row["Accelerometer2RMS"],
                    "Current": row["Current"],
                    "Pressure": row["Pressure"],
                    "Temperature": row["Temperature"],
                    "Thermocouple": row["Thermocouple"],
                    "Voltage": row["Voltage"],
                    "VolumeFlowRateRMS": row["Volume Flow RateRMS"],
                    "Attack": "DoS"
                })
        return attack_data
    
    def get_normal_samples(self, n: int = 10) -> list[dict]:
        """Get random normal samples from dataset"""
        samples = self.df.sample(n=n)
        return samples.to_dict('records')