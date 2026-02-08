import { Play, Pause, Trash2, Settings } from 'lucide-react'
import { useState } from 'react'
import useAnomalyStore from '../../stores/useAnomalyStore'

const ControlPanel = ({ isStreaming, onToggleStream }) => {
    const { threshold, setThreshold, clearHistory, readings, anomalies } = useAnomalyStore()
    const [showSettings, setShowSettings] = useState(false)
    const [tempThreshold, setTempThreshold] = useState(threshold)

    const handleApplyThreshold = () => {
        setThreshold(tempThreshold)
        setShowSettings(false)
    }

    const anomalyCount = anomalies.length
    const totalReadings = readings.length
    const detectionRate = totalReadings > 0
        ? ((anomalyCount / totalReadings) * 100).toFixed(1)
        : 0

    const handleClearHistory = () => {
        clearHistory()
        logger.log({
            event: 'clear_history',
            anomaly_count: anomalyCount,
            total_readings: totalReadings
        })
    }

    return (
        <div className="bg-background-card rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Stream Controls</h3>

            {/* Main Controls */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={onToggleStream}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${isStreaming
                        ? 'bg-anomaly-high hover:bg-orange-600'
                        : 'bg-anomaly-normal hover:bg-blue-600'
                        }`}
                >
                    {isStreaming ? (
                        <>
                            <Pause className="w-5 h-5" />
                            Stop Stream
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Start Stream
                        </>
                    )}
                </button>

                <button
                    onClick={clearHistory}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    title="Clear History"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Total Readings</div>
                    <div className="text-2xl font-bold">{totalReadings}</div>
                </div>

                <div className="bg-gray-800 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Anomalies</div>
                    <div className="text-2xl font-bold text-anomaly-high">{anomalyCount}</div>
                </div>

                <div className="bg-gray-800 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Detection Rate</div>
                    <div className="text-2xl font-bold">{detectionRate}%</div>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-3">Detection Settings</h4>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">
                            Anomaly Threshold: {tempThreshold}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={tempThreshold}
                            onChange={(e) => setTempThreshold(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>More Sensitive</span>
                            <span>Less Sensitive</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleApplyThreshold}
                            className="flex-1 px-4 py-2 bg-anomaly-normal hover:bg-blue-600 rounded-lg transition"
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => {
                                setTempThreshold(threshold)
                                setShowSettings(false)
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                        Note: Higher threshold = fewer anomalies detected. Lower threshold = more sensitive.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ControlPanel