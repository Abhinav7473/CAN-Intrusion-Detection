import { useState } from 'react'
import { Zap, Download, RefreshCw } from 'lucide-react'
import { generateAttack } from '../../utils/api'
import logger from '../../utils/logger'

const AttackGenerator = ({ onAttackGenerated }) => {
  const [attackType, setAttackType] = useState('fuzzy')
  const [numSamples, setNumSamples] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedData, setGeneratedData] = useState(null)

  const attackTypes = [
    { 
      value: 'fuzzy', 
      label: 'Fuzzy Attack',
      description: 'Random sensor values outside normal ranges',
      color: 'bg-purple-500'
    },
    { 
      value: 'spoofing', 
      label: 'Spoofing Attack',
      description: 'Slightly modified legitimate data',
      color: 'bg-orange-500'
    },
    { 
      value: 'replay', 
      label: 'Replay Attack',
      description: 'Old data with new timestamps',
      color: 'bg-blue-500'
    },
    { 
      value: 'dos', 
      label: 'DoS Attack',
      description: 'Flooding with repeated messages',
      color: 'bg-red-500'
    }
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const result = await generateAttack(attackType, numSamples)
      setGeneratedData(result)
      
      // Log attack generation
      logger.log({
        event: 'attack_generated',
        attack_type: attackType,
        num_samples: numSamples,
        success: true
      })
      
      if (onAttackGenerated) {
        onAttackGenerated(result)
      }
    } catch (error) {
      console.error('Attack generation failed:', error)
      alert('Failed to generate attack data')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedData) return

    // Convert to CSV
    const headers = Object.keys(generatedData.samples[0])
    const csv = [
      headers.join(','),
      ...generatedData.samples.map(row => 
        headers.map(h => row[h]).join(',')
      )
    ].join('\n')

    // Download
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${attackType}_attack_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedAttack = attackTypes.find(a => a.value === attackType)

  return (
    <div className="bg-background-card rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-anomaly-high" />
        <div>
          <h3 className="text-xl font-bold">Attack Generator</h3>
          <p className="text-sm text-gray-400">Generate synthetic CAN bus attacks for testing</p>
        </div>
      </div>

      {/* Attack Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Attack Type</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attackTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setAttackType(type.value)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                attackType === type.value
                  ? 'border-anomaly-normal bg-anomaly-normal/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                <span className="font-semibold">{type.label}</span>
              </div>
              <p className="text-xs text-gray-400">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Samples */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">
          Number of Samples: {numSamples}
        </label>
        <input
          type="range"
          min="10"
          max="200"
          step="10"
          value={numSamples}
          onChange={(e) => setNumSamples(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10</span>
          <span>200</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-anomaly-high hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Generate {selectedAttack?.label}
          </>
        )}
      </button>

      {/* Results */}
      {generatedData && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-anomaly-high">
                {generatedData.count} {attackType} attack samples generated
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Ready for analysis and comparison
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-anomaly-normal hover:bg-blue-600 rounded-lg transition text-sm"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttackGenerator