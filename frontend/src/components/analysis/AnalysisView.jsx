import { useState } from 'react'
import ThreeDVisualization from './ThreeDVisualization'
import AnalysisStats from './AnalysisStats'
import FeatureImportance from '../realtime/FeatureImportance'
import useAnomalyStore from '../../stores/useAnomalyStore'

const AnalysisView = () => {
  const { selectAnomaly } = useAnomalyStore()

  const handlePointClick = (reading) => {
    if (reading.is_anomaly) {
      selectAnomaly(reading)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">3D Analysis & Visualization</h2>
          <p className="text-gray-400 mt-1">
            Explore sensor data in 3D space with interactive anomaly clustering
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <AnalysisStats />
          </div>

          {/* 3D Visualization */}
          <div className="lg:col-span-3">
            <ThreeDVisualization onPointClick={handlePointClick} />
          </div>
        </div>
      </div>

      {/* Reuse Feature Importance Modal */}
      <FeatureImportance />
    </>
  )
}

export default AnalysisView