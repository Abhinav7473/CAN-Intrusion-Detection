import { useState } from 'react'
import AttackGenerator from './AttackGenerator'
import AttackComparison from './AttackComparison'

const AttacksView = () => {
  const [attackData, setAttackData] = useState(null)

  const handleAttackGenerated = (data) => {
    setAttackData(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Attack Simulation</h2>
        <p className="text-gray-400 mt-1">
          Generate synthetic attacks and compare patterns with normal behavior
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator - Left Column */}
        <div className="lg:col-span-1">
          <AttackGenerator onAttackGenerated={handleAttackGenerated} />
        </div>

        {/* Comparison - Right 2 Columns */}
        <div className="lg:col-span-2">
          <AttackComparison attackData={attackData} />
        </div>
      </div>
    </div>
  )
}

export default AttacksView