import { X, AlertCircle } from 'lucide-react'
import useAnomalyStore from '../../stores/useAnomalyStore'

const FeatureImportance = () => {
  const { selectedAnomaly, clearSelection } = useAnomalyStore()
  
  if (!selectedAnomaly) return null
  
  const features = selectedAnomaly.feature_importance?.features || []
  const topFeatures = features.slice(0, 5)  // Show top 5 contributors
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-card rounded-lg border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background-card border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-anomaly-critical" />
            <div>
              <h3 className="text-xl font-bold">Anomaly Explanation</h3>
              <p className="text-sm text-gray-400">
                Why was this flagged as an anomaly?
              </p>
            </div>
          </div>
          <button
            onClick={clearSelection}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Anomaly Score Summary */}
        <div className="p-6 border-b border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded p-4">
              <div className="text-sm text-gray-400 mb-1">Anomaly Score</div>
              <div className="text-3xl font-bold text-anomaly-critical">
                {selectedAnomaly.anomaly_score?.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <div className="text-sm text-gray-400 mb-1">Detection Confidence</div>
              <div className="text-3xl font-bold text-anomaly-high">
                {(selectedAnomaly.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Contributions */}
        <div className="p-6">
          <h4 className="font-semibold mb-4">Top Contributing Sensors</h4>
          <p className="text-sm text-gray-400 mb-6">
            These sensors deviated most from normal patterns:
          </p>
          
          <div className="space-y-4">
            {topFeatures.map((feature, idx) => {
              const contribution = feature.contribution
              const isHighContributor = contribution > 15
              
              return (
                <div key={feature.feature} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        isHighContributor ? 'text-anomaly-critical' : 'text-gray-300'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="font-medium">{feature.feature}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">
                        Value: {feature.value.toFixed(2)}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isHighContributor ? 'text-anomaly-critical' : 'text-gray-300'
                      }`}>
                        {contribution.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isHighContributor ? 'bg-anomaly-critical' : 'bg-anomaly-high'
                      }`}
                      style={{ width: `${contribution}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Z-score: {feature.z_score.toFixed(2)} standard deviations from normal
                  </div>
                </div>
              )
            })}
          </div>
          
          {features.length > 5 && (
            <details className="mt-6">
              <summary className="text-sm text-anomaly-normal cursor-pointer hover:underline">
                Show all {features.length} sensors →
              </summary>
              <div className="mt-4 space-y-2">
                {features.slice(5).map((feature) => (
                  <div key={feature.feature} className="flex justify-between text-sm py-2 border-t border-gray-700">
                    <span>{feature.feature}</span>
                    <span className="text-gray-400">{feature.contribution.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
        
        {/* Action Footer */}
        <div className="sticky bottom-0 bg-background-card border-t border-gray-700 p-4">
          <button
            onClick={clearSelection}
            className="w-full px-4 py-3 bg-anomaly-normal hover:bg-blue-600 rounded-lg font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeatureImportance