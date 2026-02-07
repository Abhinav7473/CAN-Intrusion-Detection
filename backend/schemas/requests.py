"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Literal


class SensorReading(BaseModel):
    """Single sensor reading from CAN bus"""
    datetime: float = Field(..., description="Unix timestamp")
    accelerometer1_rms: float = Field(..., alias="Accelerometer1RMS")
    accelerometer2_rms: float = Field(..., alias="Accelerometer2RMS")
    current: float
    pressure: float
    temperature: float
    thermocouple: float
    voltage: float
    volume_flow_rate_rms: float = Field(..., alias="VolumeFlowRateRMS")
    
    class Config:
        populate_by_name = True
    
    def to_array(self) -> list[float]:
        """Convert to array for ML model input"""
        return [
            self.datetime,
            self.accelerometer1_rms,
            self.accelerometer2_rms,
            self.current,
            self.pressure,
            self.temperature,
            self.thermocouple,
            self.volume_flow_rate_rms,
            self.voltage
        ]


class AttackRequest(BaseModel):
    """Request to generate synthetic attack data"""
    attack_type: Literal["fuzzy", "spoofing", "replay", "dos"]
    num_samples: int = Field(10, ge=1, le=1000)