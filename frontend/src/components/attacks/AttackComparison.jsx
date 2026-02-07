import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { getSampleData, detectAnomalySVM } from '../../utils/api'
import { TrendingUp, AlertTriangle } from 'lucide-react'

const AttackComparison = ({ attackData }) => {
  const [normalData, setNormalData] = useState(null)
  const [attackStats, setAttackStats] = useState(null)
  const [normalStats, setNormalStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (attackData) {
      loadComparisonData()
    }
  }, [attackData])

  const loadComparisonData = async () => {
    setIsLoading(true)
    try {
      // Get normal samples for comparison
      const normal = await getSampleData(attackData.count)
      setNormalData(normal)

      // Calculate statistics
      const attackAvg = calculateAverages(attackData.samples)
      const normalAvg = calculateAverages(normal.samples)
      
      setAttackStats(attackAvg)
      setNormalStats(normalAvg)

      // Detect anomalies in attack samples
      await detectAnomaliesInBatch(attackData.samples)
    } catch (error) {
      console.error('Failed to load comparison data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAverages = (samples) => {
    const features = [
      'Accelerometer1RMS', 'Accelerometer2RMS', 'Current',
      'Pressure', 'Temperature', 'Thermocouple', 'Voltage', 'VolumeFlowRateRMS'
    ]

    const avgs = {}
    features.forEach(feature => {
      const key = feature === 'VolumeFlowRateRMS' ? 'Volume Flow RateRMS' : feature
      const values = samples.map(s => s[key] || 0)
      avgs[feature] = values.reduce((a, b) => a + b, 0) / values.length
    })

    return avgs
  }

  const detectAnomaliesInBatch = async (samples) => {
    // Detect first 10 samples to show detection rate
    const detections = await Promise.all(
      samples.slice(0, 10).map(async (sample) => {
        try {
          const reading = {
            datetime: new Date(sample.datetime).getTime() / 1000,
            Accelerometer1RMS: sample.Accelerometer1RMS,
            Accelerometer2RMS: sample.Accelerometer2RMS,
            current: sample.Current,
            pressure: sample.Pressure,
            temperature: sample.Temperature,
            thermocouple: sample.Thermocouple,
            voltage: sample.Voltage,
            VolumeFlowRateRMS: sample.VolumeFlowRateRMS || sample['Volume Flow RateRMS']
          }
          const result = await detectAnomalySVM(reading)
          return result.is_anomaly
        } catch {
          return false
        }
      })
    )

    const detectedCount = detections.filter(Boolean).length
    console.log(`Detection rate: ${detectedCount}/10 detected as anomalies`)
  }

  if (isLoading) {
    return (
      <div className="bg-background-card rounded-lg p-12 border border-gray-700 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-anomaly-normal border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Analyzing attack patterns...</p>
      </div>
    )
  }

  if (!attackStats || !normalStats) {
    return (
      <div className="bg-background-card rounded-lg p-12 border border-gray-700 text-center">
        <p className="text-gray-400">Generate an attack to see comparison</p>
      </div>
    )
  }

  // Prepare comparison data for bar chart
  const comparisonData = [
    {
      sensor: 'Accel 1',
      Normal: normalStats.Accelerometer1RMS,
      Attack: attackStats.Accelerometer1RMS
    },
    {
      sensor: 'Accel 2',
      Normal: normalStats.Accelerometer2RMS,
      Attack: attackStats.Accelerometer2RMS
    },
    {
      sensor: 'Current',
      Normal: normalStats.Current,
      Attack: attackStats.Current
    },
    {
      sensor: 'Pressure',
      Normal: normalStats.Pressure,
      Attack: attackStats.Pressure
    },
    {
      sensor: 'Temp',
      Normal: normalStats.Temperature,
      Attack: attackStats.Temperature
    },
    {
      sensor: 'Thermo',
      Normal: normalStats.Thermocouple,
      Attack: attackStats.Thermocouple
    },
    {
      sensor: 'Voltage',
      Normal: normalStats.Voltage,
      Attack: attackStats.Voltage
    },
    {
      sensor: 'Flow',
      Normal: normalStats.VolumeFlowRateRMS,
      Attack: attackStats.VolumeFlowRateRMS
    }
  ]

  // Prepare radar chart data
  const radarData = comparisonData.map(d => ({
    sensor: d.sensor,
    Normal: (d.Normal / Math.max(d.Normal, d.Attack)) * 100,
    Attack: (d.Attack / Math.max(d.Normal, d.Attack)) * 100
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background-card rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-anomaly-low" />
            <span className="text-sm text-gray-400">Normal Data</span>
          </div>
          <p className="text-3xl font-bold text-anomaly-low">{attackData.count}</p>
          <p className="text-xs text-gray-500 mt-1">Baseline samples</p>
        </div>

        <div className="bg-background-card rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-anomaly-critical" />
            <span className="text-sm text-gray-400">Attack Data</span>
          </div>
          <p className="text-3xl font-bold text-anomaly-critical">{attackData.count}</p>
          <p className="text-xs text-gray-500 mt-1">{attackData.attack_type} attack</p>
        </div>
      </div>

      {/* Bar Chart Comparison */}
      <div className="bg-background-card rounded-lg p-6 border border-gray-700">
        <h4 className="font-semibold mb-4">Sensor Value Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="sensor" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="Normal" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Attack" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="bg-background-card rounded-lg p-6 border border-gray-700">
        <h4 className="font-semibold mb-4">Pattern Signature</h4>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="sensor" stroke="#9CA3AF" />
            <PolarRadiusAxis stroke="#9CA3AF" />
            <Radar
              name="Normal"
              dataKey="Normal"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
            <Radar
              name="Attack"
              dataKey="Attack"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.3}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 text-center mt-4">
          Normalized sensor patterns showing attack deviation from normal behavior
        </p>
      </div>

      {/* Key Differences */}
      <div className="bg-background-card rounded-lg p-6 border border-gray-700">
        <h4 className="font-semibold mb-4">Key Differences</h4>
        <div className="space-y-3">
          {comparisonData.map((item) => {
            const diff = Math.abs(item.Attack - item.Normal)
            const percentDiff = ((diff / item.Normal) * 100).toFixed(1)
            const isSignificant = percentDiff > 20

            return (
              <div
                key={item.sensor}
                className={`flex items-center justify-between p-3 rounded ${
                  isSignificant ? 'bg-anomaly-critical/10 border border-anomaly-critical/30' : 'bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSignificant && <AlertTriangle className="w-4 h-4 text-anomaly-critical" />}
                  <span className="font-medium">{item.sensor}</span>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${isSignificant ? 'text-anomaly-critical' : 'text-gray-300'}`}>
                    {percentDiff}% difference
                  </span>
                  <p className="text-xs text-gray-500">
                    Normal: {item.Normal.toFixed(2)} → Attack: {item.Attack.toFixed(2)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AttackComparison