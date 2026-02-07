import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei'
import { useState, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import useAnomalyStore from '../../stores/useAnomalyStore'

// Point cloud component
const DataPoints = ({ onPointClick }) => {
  const { readings } = useAnomalyStore()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [newestIndex, setNewestIndex] = useState(null)

  // Track newest point
  useEffect(() => {
    if (readings.length > 0) {
      setNewestIndex(readings.length - 1)
      // Clear highlight after 2 seconds
      const timeout = setTimeout(() => setNewestIndex(null), 2000)
      return () => clearTimeout(timeout)
    }
  }, [readings.length])

  // Simple dimensionality reduction (use first 3 most varying sensors)
  const points3D = useMemo(() => {
    if (readings.length === 0) return []

    return readings.map((reading, idx) => {
      // Map sensor values to 3D coordinates
      const x = (reading.Accelerometer1RMS || 0) / 50
      const y = (reading.temperature || 50) / 100
      const z = (reading.voltage || 220) / 250

      return {
        position: [x, y, z],
        isAnomaly: reading.is_anomaly,
        anomalyScore: reading.anomaly_score || 0,
        index: idx,
        reading: reading,
        isNewest: idx === newestIndex
      }
    })
  }, [readings, newestIndex])

  return (
    <group>
      {points3D.map((point, idx) => (
        <Point
          key={idx}
          {...point}
          isHovered={hoveredIndex === idx}
          onHover={() => setHoveredIndex(idx)}
          onUnhover={() => setHoveredIndex(null)}
          onClick={() => onPointClick(point.reading)}
        />
      ))}
    </group>
  )
}

// Individual point with animation for newest
const Point = ({ position, isAnomaly, anomalyScore, isHovered, onHover, onUnhover, onClick, index, isNewest }) => {
  const meshRef = useRef()
  const [scale, setScale] = useState(1)

  // Pulse animation for newest point
  useFrame((state) => {
    if (isNewest && meshRef.current) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.3
      meshRef.current.scale.set(pulseScale, pulseScale, pulseScale)
    } else if (isHovered) {
      meshRef.current.scale.set(1.5, 1.5, 1.5)
    } else {
      meshRef.current.scale.set(1, 1, 1)
    }
  })

  const color = isAnomaly ? '#EF4444' : '#3B82F6'
  const size = isAnomaly ? 0.03 : 0.02

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onUnhover()
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isAnomaly ? 0.5 : 0.2}
        transparent
        opacity={isNewest ? 1 : 0.8}
      />
      {(isHovered || isNewest) && (
        <Html distanceFactor={10}>
          <div className="bg-background-card border border-gray-700 rounded px-3 py-2 text-xs whitespace-nowrap pointer-events-none">
            <p className={`font-semibold ${isAnomaly ? 'text-anomaly-critical' : 'text-anomaly-low'}`}>
              {isAnomaly ? 'Anomaly' : 'Normal'} {isNewest && '⚡ NEW'}
            </p>
            <p className="text-gray-400">Score: {anomalyScore.toFixed(2)}</p>
            <p className="text-gray-400">Point #{index + 1}</p>
          </div>
        </Html>
      )}
    </mesh>
  )
}

// Axis helpers
const Axes = () => {
  return (
    <>
      {/* X Axis - Red */}
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff0000]} />
      <Html position={[1.1, 0, 0]}>
        <div className="text-xs text-red-400 font-semibold">Accelerometer</div>
      </Html>

      {/* Y Axis - Green */}
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x00ff00]} />
      <Html position={[0, 1.1, 0]}>
        <div className="text-xs text-green-400 font-semibold">Temperature</div>
      </Html>

      {/* Z Axis - Blue */}
      <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0x0000ff]} />
      <Html position={[0, 0, 1.1]}>
        <div className="text-xs text-blue-400 font-semibold">Voltage</div>
      </Html>

      {/* Grid */}
      <gridHelper args={[2, 10, '#374151', '#1f2937']} />
    </>
  )
}

// Main 3D Visualization Component
const ThreeDVisualization = ({ onPointClick }) => {
  const { readings, isStreaming } = useAnomalyStore()

  if (readings.length === 0) {
    return (
      <div className="bg-background-card rounded-lg border border-gray-700 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-2">No data to visualize</p>
          <p className="text-sm text-gray-500">Start streaming in Real-Time view to see 3D visualization</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-card rounded-lg border border-gray-700 h-[600px] relative">
      {/* Info Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-background-dark/80 backdrop-blur rounded-lg p-3 border border-gray-700">
        <p className="text-xs text-gray-400 mb-1">3D Sensor Space</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-anomaly-normal rounded-full"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-anomaly-critical rounded-full"></div>
            <span>Anomaly</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{readings.length} points</p>
        {isStreaming && (
          <div className="flex items-center gap-2 mt-2 text-anomaly-low">
            <div className="w-2 h-2 bg-anomaly-low rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold">LIVE UPDATES</span>
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-4 right-4 z-10 bg-background-dark/80 backdrop-blur rounded-lg p-3 border border-gray-700 text-xs text-gray-400">
        <p>🖱️ Left drag: Rotate</p>
        <p>🖱️ Right drag: Pan</p>
        <p>🖱️ Scroll: Zoom</p>
        <p>💡 Click points for details</p>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[2, 2, 2]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={5}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Scene */}
        <Axes />
        <DataPoints onPointClick={onPointClick} />

        {/* Background */}
        <color attach="background" args={['#0f172a']} />
      </Canvas>
    </div>
  )
}

export default ThreeDVisualization