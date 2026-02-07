import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import useAnomalyStore from '../../stores/useAnomalyStore'

const AnomalyTimeline = () => {
  const { readings, threshold, selectAnomaly } = useAnomalyStore()
  
  // Prepare data for chart
  const chartData = readings.map((r, idx) => ({
    index: idx,
    score: r.anomaly_score || 0,
    isAnomaly: r.is_anomaly,
    fullData: r  // Store full reading data
  }))
  
  const handleDotClick = (data) => {
    if (data && data.isAnomaly) {
      selectAnomaly(data.fullData)
    }
  }
  
  return (
    <div className="bg-background-card rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Anomaly Score Timeline</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-anomaly-low rounded-full"></div>
            <span className="text-gray-400">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-anomaly-critical rounded-full"></div>
            <span className="text-gray-400">Anomaly (click for details)</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="index" 
            stroke="#9CA3AF"
            label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="#9CA3AF"
            label={{ value: 'Anomaly Score', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#9CA3AF' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-background-card border border-gray-700 rounded-lg p-3">
                    <p className="text-sm font-semibold mb-1">
                      Reading #{data.index + 1}
                    </p>
                    <p className="text-sm text-gray-400">
                      Score: <span className="text-white font-semibold">{data.score.toFixed(2)}</span>
                    </p>
                    <p className={`text-xs mt-1 ${data.isAnomaly ? 'text-anomaly-critical' : 'text-anomaly-low'}`}>
                      {data.isAnomaly ? '🔴 Anomaly' : '🟢 Normal'}
                    </p>
                    {data.isAnomaly && (
                      <p className="text-xs text-anomaly-normal mt-2">
                        💡 Click to see why
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <ReferenceLine 
            y={threshold} 
            stroke="#EF4444" 
            strokeDasharray="3 3"
            label={{ value: 'Threshold', fill: '#EF4444', position: 'right' }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3B82F6"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.isAnomaly ? 6 : 3}
                  fill={payload.isAnomaly ? '#EF4444' : '#3B82F6'}
                  stroke={payload.isAnomaly ? '#FCA5A5' : 'none'}
                  strokeWidth={2}
                  style={{ 
                    cursor: payload.isAnomaly ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => handleDotClick(payload)}
                  onMouseOver={(e) => {
                    if (payload.isAnomaly) {
                      e.target.style.transform = 'scale(1.3)'
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)'
                  }}
                />
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-400">
        Showing last {readings.length} readings • Threshold: {threshold}
      </div>
    </div>
  )
}

export default AnomalyTimeline