import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react'
import { checkHealth } from './utils/api'
import RealtimeView from './components/realtime/RealtimeView'

function App() {
    const [selectedView, setSelectedView] = useState('dashboard')
    const [apiStatus, setApiStatus] = useState('checking...')

    // Test API connection on mount
    useEffect(() => {
        checkHealth()
            .then(data => {
                setApiStatus(data.status === 'healthy' ? 'Connected' : 'Unhealthy')
            })
            .catch(err => {
                setApiStatus('Offline')
                console.error('API connection failed:', err)
            })
    }, [])

    return (
        <div className="min-h-screen bg-background-dark text-white">
            {/* Header */}
            <header className="bg-background-card border-b border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity className="w-8 h-8 text-anomaly-critical" />
                        <div>
                            <h1 className="text-2xl font-bold">CAN Intrusion Detection</h1>
                            <p className="text-sm text-gray-400">Research Interface</p>
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
                            className={`px-4 py-2 rounded-lg transition ${selectedView === view
                                    ? 'bg-anomaly-al text-white'
                                    : 'text-gray-4over:text-white'
                                }`}
                        >
                            {view === 'real-time' ? 'Real-Time' : view.charAt(0).toUpperCase() + view.slice(1)}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-6">
                {selectedView === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                        <div className="col-span-full bg-background-card rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Quick Start</h2>
                            <p className="text-gray-400 mb-4">
                                Navigate to <strong className="text-white">Real-Time</strong> to start monitoring sensor data with live anomaly detection.
                            </p>
                            <button
                                onClick={() => setSelectedView('real-time')}
                                className="px-6 py-3 bg-anomaly-normal rounded-lg hover:bg-blue-600 transition"
                            >
                                Go to Real-Time View →
                            </button>
                        </div>
                    </div>
                )}

                {selectedView === 'real-time' && <RealtimeView />}

                {selectedView === 'attacks' && (
                    <div className="bg-background-card rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Attack Simulation</h2>
                        <p className="text-gray-400">Phase 4 - Coming soon...</p>
                    </div>
                )}

                {selectedView === 'analysis' && (
                    <div className="bg-background-card rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Model Analysis</h2>
                        <p className="text-gray-400">Phase 2 & 3 - Coming soon...</p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App