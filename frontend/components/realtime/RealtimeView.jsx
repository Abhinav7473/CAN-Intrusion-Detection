import { useState } from 'react'
import useRealtimeData from '../../src/hooks/useRealtimeData'
import AnomalyTimeline from './AnomalyTimeline'
import SensorReading from './SensorReadings'
import ControlPanel from './ControlPanel'

const RealtimeView = () => {
    const [isStreaming, setIsStreaming] = useState(false)

    // Hook automatically handles polling when isStreaming is true
    useRealtimeData(isStreaming, 2000) // Poll every 2 seconds

    const handleToggleStream = () => {
        setIsStreaming(!isStreaming)
    }

    return (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Panel - Left Column */}
                <div className="lg:col-span-1">
                    <ControlPanel
                        isStreaming={isStreaming}
                        onToggleStream={handleToggleStream}
                    />
                </div>

                {/* Main Content - Right 2 Columns */}
                <div className="lg:col-span-2 space-y-6">
                    <SensorReadings />
                    <AnomalyTimeline />
                </div>
            </div>
        </div>
    )
}

export default RealtimeView