import AnomalyTimeline from './AnomalyTimeline'
import SensorReadings from './SensorReadings'
import ControlPanel from './ControlPanel'
import FeatureImportance from './FeatureImportance'
import useAnomalyStore from '../../stores/useAnomalyStore'

const RealtimeView = () => {
  const { isStreaming, setStreaming } = useAnomalyStore()
  
  const handleToggleStream = () => {
    setStreaming(!isStreaming)
  }
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Real-Time Anomaly Detection</h2>
            <p className="text-gray-400 mt-1">
              Live sensor monitoring with One-Class SVM detection
            </p>
          </div>
          {isStreaming && (
            <div className="flex items-center gap-2 px-4 py-2 bg-anomaly-critical/20 border border-anomaly-critical rounded-lg">
              <div className="w-2 h-2 bg-anomaly-critical rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">LIVE</span>
            </div>
          )}
        </div>
        
        {/* Top Row: Control Panel (40%) + Sensor Readings (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <ControlPanel 
              isStreaming={isStreaming}
              onToggleStream={handleToggleStream}
            />
          </div>
          
          <div className="lg:col-span-3">
            <SensorReadings />
          </div>
        </div>
        
        {/* Bottom Row: Timeline (Full Width) */}
        <div>
          <AnomalyTimeline />
        </div>
      </div>
      
      <FeatureImportance />
    </>
  )
}

export default RealtimeView