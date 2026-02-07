import { useMemo } from 'react'
import { TrendingUp, AlertTriangle, BarChart3, Layers } from 'lucide-react'
import useAnomalyStore from '../../stores/useAnomalyStore'

const AnalysisStats = () => {
  const { readings, anomalies } = useAnomalyStore()

  const stats = useMemo(() => {
    if (readings.length === 0) return null

    const anomalyCount = anomalies.length
    const normalCount = readings.length - anomalyCount
    const avgScore = readings.reduce((sum, r) => sum + (r.anomaly_score || 0), 0) / readings.length

    // Calculate sensor statistics
    const sensorStats = {}
    const sensorNames = [
      'Accelerometer1RMS', 'Accelerometer2RMS', 'current',
      'pressure', 'temperature', 'thermocouple', 'voltage', 'VolumeFlowRateRMS'
    ]

    sensorNames.forEach(sensor => {
      const values = readings.map(r => r[sensor] || 0)
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      const max = Math.max(...values)
      const min = Math.min(...values)
      
      sensorStats[sensor] = { avg, max, min, variance: max - min }
    })

    // Find most volatile sensor
    const mostVolatile = Object.entries(sensorStats)
      .sort((a, b) => b[1].variance - a[1].variance)[0]

    return {
      totalReadings: readings.length,
      anomalyCount,
      normalCount,
      detectionRate: ((anomalyCount / readings.length) * 100).toFixed(1),
      avgScore: avgScore.toFixed(2),
      mostVolatile: {
        name: mostVolatile[0],
        variance: mostVolatile[1].variance.toFixed(2)
      },
      sensorStats
    }
  }, [readings, anomalies])

  if (!stats) {
    return (
      <div className="bg-background-card rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">No data available for analysis</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background-card rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-anomaly-normal" />
            <span className="text-xs text-gray-400">Total Samples</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalReadings}</p>
        </div>

        <div className="bg-background-card rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-anomaly-critical" />
            <span className="text-xs text-gray-400">Anomalies</span>
          </div>
          <p className="text-2xl font-bold text-anomaly-critical">{stats.anomalyCount}</p>
        </div>

        <div className="bg-background-card rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-anomaly-high" />
            <span className="text-xs text-gray-400">Detection Rate</span>
          </div>
          <p className="text-2xl font-bold text-anomaly-high">{stats.detectionRate}%</p>
        </div>

        <div className="bg-background-card rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-anomaly-low" />
            <span className="text-xs text-gray-400">Avg Score</span>
          </div>
          <p className="text-2xl font-bold">{stats.avgScore}</p>
        </div>
      </div>

      {/* Distribution */}
      <div className="bg-background-card rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-semibold mb-3">Data Distribution</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Normal</span>
              <span className="text-anomaly-low">{stats.normalCount} ({(100 - parseFloat(stats.detectionRate)).toFixed(1)}%)</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-anomaly-low"
                style={{ width: `${100 - parseFloat(stats.detectionRate)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Anomalies</span>
              <span className="text-anomaly-critical">{stats.anomalyCount} ({stats.detectionRate}%)</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-anomaly-critical"
                style={{ width: `${stats.detectionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Most Volatile Sensor */}
      <div className="bg-background-card rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-semibold mb-2">Most Volatile Sensor</h4>
        <p className="text-lg font-bold text-anomaly-high">{stats.mostVolatile.name}</p>
        <p className="text-xs text-gray-400 mt-1">
          Variance: {stats.mostVolatile.variance}
        </p>
      </div>
    </div>
  )
}

export default AnalysisStats