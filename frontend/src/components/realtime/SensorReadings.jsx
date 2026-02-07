import { Activity, Info } from 'lucide-react'
import useAnomalyStore from '../../stores/useAnomalyStore'

const SensorReadings = () => {
  const { readings, selectAnomaly } = useAnomalyStore()
  const latest = readings[readings.length - 1]
  
  if (!latest) {
    return (
      <div className="bg-background-card rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Live Sensor Readings</h3>
        <p className="text-gray-400">No data yet. Start streaming to see readings.</p>
      </div>
    )
  }
  
  const sensors = [
    { name: 'Accelerometer 1', value: latest.Accelerometer1RMS, unit: 'RMS' },
    { name: 'Accelerometer 2', value: latest.Accelerometer2RMS, unit: 'RMS' },
    { name: 'Current', value: latest.current, unit: 'A' },
    { name: 'Pressure', value: latest.pressure, unit: 'Pa' },
    { name: 'Temperature', value: latest.temperature, unit: '°C' },
    { name: 'Thermocouple', value: latest.thermocouple, unit: '°C' },
    { name: 'Voltage', value: latest.voltage, unit: 'V' },
    { name: 'Volume Flow Rate', value: latest.VolumeFlowRateRMS, unit: 'RMS' }
  ]
  
  const getStatusColor = () => {
    if (latest.is_anomaly) return 'text-anomaly-critical'
    return 'text-anomaly-low'
  }
  
  return (
    <div className="bg-background-card rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Live Sensor Readings</h3>
        <div className="flex items-center gap-3">
          <Activity className={`w-5 h-5 ${getStatusColor()} animate-pulse`} />
          <span className={`font-semibold ${getStatusColor()}`}>
            {latest.is_anomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
          </span>
          {latest.is_anomaly && (
            <button
              onClick={() => selectAnomaly(latest)}
              className="flex items-center gap-2 px-3 py-1 bg-anomaly-normal hover:bg-blue-600 rounded text-sm transition"
            >
              <Info className="w-4 h-4" />
              Explain
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sensors.map((sensor) => (
          <div 
            key={sensor.name}
            className="bg-gray-800 rounded p-3 border border-gray-700"
          >
            <div className="text-xs text-gray-400 mb-1">{sensor.name}</div>
            <div className="text-lg font-semibold">
              {sensor.value?.toFixed(2) || '0.00'}
              <span className="text-sm text-gray-400 ml-1">{sensor.unit}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded">
        <div className="text-sm text-gray-400">Anomaly Score</div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                latest.is_anomaly ? 'bg-anomaly-critical' : 'bg-anomaly-low'
              }`}
              style={{ width: `${Math.min(Math.abs(latest.anomaly_score || 0), 100)}%` }}
            ></div>
          </div>
          <span className="text-lg font-semibold min-w-[60px]">
            {latest.anomaly_score?.toFixed(1) || '0.0'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SensorReadings