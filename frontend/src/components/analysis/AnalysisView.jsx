import { useState } from 'react'
import { BarChart3, Box, GitCompare } from 'lucide-react'
import ThreeDVisualization from './ThreeDVisualization'
import AnalysisStats from './AnalysisStats'
import ModelComparison from './ModelComparison'
import FeatureImportance from '../realtime/FeatureImportance'
import useAnomalyStore from '../../stores/useAnomalyStore'

const AnalysisView = () => {
  const [activeTab, setActiveTab] = useState('3d') // '3d' or 'comparison'
  const { selectAnomaly } = useAnomalyStore()

  const handlePointClick = (reading) => {
    if (reading.is_anomaly) {
      selectAnomaly(reading)
    }
  }

  const tabs = [
    { id: '3d', label: '3D Visualization', icon: Box },
    { id: 'comparison', label: 'Model Comparison', icon: GitCompare }
  ]

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Analysis & Visualization</h2>
          <p className="text-gray-400 mt-1">
            Explore sensor data and compare detection models
          </p>
        </div>

        {/* Analysis Type Tabs */}
        <div className="flex gap-3 border-b border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-anomaly-normal text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 3D Visualization Tab */}
        {activeTab === '3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <AnalysisStats />
            </div>
            <div className="lg:col-span-3">
              <ThreeDVisualization onPointClick={handlePointClick} />
            </div>
          </div>
        )}

        {/* Model Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <AnalysisStats />
            </div>
            <div className="lg:col-span-3">
              <ModelComparison />
            </div>
          </div>
        )}
      </div>

      <FeatureImportance />
    </>
  )
}

export default AnalysisView