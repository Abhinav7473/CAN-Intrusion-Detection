import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react'
import { checkHealth, getSampleData, generateAttack } from './utils/api'

function App() {
  const [selectedView, setSelectedView] = useState('dashboard')
  const [apiStatus, setApiStatus] = useState('checking...')
  const [sampleData, setSampleData] = useState(null)

  // Test API connection on mount
  useEffect(() => {
    checkHealth()
      .then(data => {
        setApiStatus(data.status === 'healthy' ? '✅ Connected' : '⚠️ Unhealthy')
      })
      .catch(err => {
        setApiStatus('❌ Offline')
        console.error('API connection failed:', err)
      })
  }, [])

  const handleTestAPI = async () => {
    try {
      const data = await getSampleData(5)
      setSampleData(data)
      console.log('Sample data:', data)
      alert('API test successful! Check console for data.')
    } catch (err) {
      console.error('API test failed:', err)
      alert('API test failed. Check console.')
    }
  }

  const handleGenerateAttack = async () => {
    try {
      const data = await generateAttack('fuzzy', 10)
      console.log('Generated attack:', data)
      alert(`Generated ${data.count} attack samples!`)
    } catch (err) {
      console.error('Attack generation failed:', err)
      alert('Attack generation failed.')
    }
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Header */}
      <header className="bg-background-card border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-anomaly-critical" />
            <div>
              <h1 className="text-2xl font-bold">CAN Intrusion Detection</h1>
              <p className="text-sm text-gray-400">HCI Research Interface</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{apiStatus}</span>
            <button className="px-4 py-2 bg-anomaly-critical rounded-lg hover:bg-red-600 transition">
              Emergency Stop
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-background-card border-b border-gray-700 px-6 py-3">
        <div className="flex gap-6">
          {['dashboard', 'real-time', 'attacks', 'analysis'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedView === view
                  ? 'bg-anomaly-normal text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {selectedView === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-background-card rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Detections</p>
                  <p className="text-3xl font-bold mt-2">1,247</p>
                </div>
                <TrendingUp className="w-8 h-8 text-anomaly-low" />
              </div>
            </div>

            <div className="bg-background-card rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Anomalies</p>
                  <p className="text-3xl font-bold mt-2 text-anomaly-high">23</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-anomaly-high" />
              </div>
            </div>

            <div className="bg-background-card rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Detection Rate</p>
                  <p className="text-3xl font-bold mt-2 text-anomaly-low">94.2%</p>
                </div>
                <Activity className="w-8 h-8 text-anomaly-low" />
              </div>
            </div>

            {/* API Test Section */}
            <div className="col-span-full bg-background-card rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
              <div className="flex gap-4">
                <button 
                  onClick={handleTestAPI}
                  className="px-6 py-3 bg-anomaly-normal rounded-lg hover:bg-blue-600 transition"
                >
                  Test: Get Sample Data
                </button>
                <button 
                  onClick={handleGenerateAttack}
                  className="px-6 py-3 bg-anomaly-high rounded-lg hover:bg-orange-600 transition"
                >
                  Test: Generate Attack
                </button>
              </div>
              {sampleData && (
                <div className="mt-4 p-4 bg-gray-800 rounded">
                  <p className="text-sm text-gray-300">
                    Retrieved {sampleData.count} samples from backend
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedView === 'real-time' && (
          <div className="bg-background-card rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Live Sensor Data Stream</h2>
            <p className="text-gray-400">Real-time monitoring component coming soon...</p>
          </div>
        )}

        {selectedView === 'attacks' && (
          <div className="bg-background-card rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Attack Simulation</h2>
            <p className="text-gray-400">Attack generation interface coming soon...</p>
          </div>
        )}

        {selectedView === 'analysis' && (
          <div className="bg-background-card rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Model Analysis</h2>
            <p className="text-gray-400">Feature importance and explanations coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App