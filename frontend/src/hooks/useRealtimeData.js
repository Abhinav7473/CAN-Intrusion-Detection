import { useEffect, useRef } from 'react'
import { getSampleData, detectAnomalySVM } from '../utils/api'
import useAnomalyStore from '../stores/useAnomalyStore'

const useRealtimeData = (isActive = false, intervalMs = 2000) => {
  const intervalRef = useRef(null)
  const { addReading } = useAnomalyStore()

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const fetchAndDetect = async () => {
      try {
        // Get one random sample from backend
        const { samples } = await getSampleData(1)
        const sample = samples[0]

        // Convert to format expected by API
        const reading = {
          datetime: new Date(sample.datetime).getTime() / 1000,
          Accelerometer1RMS: sample.Accelerometer1RMS,
          Accelerometer2RMS: sample.Accelerometer2RMS,
          current: sample.Current,
          pressure: sample.Pressure,
          temperature: sample.Temperature,
          thermocouple: sample.Thermocouple,
          voltage: sample.Voltage,
          VolumeFlowRateRMS: sample['Volume Flow RateRMS']
        }

        // Detect anomaly
        const detection = await detectAnomalySVM(reading)

        // Add to store
        addReading(reading, detection)

      } catch (error) {
        console.error('Real-time data fetch failed:', error)
      }
    }

    // Fetch immediately
    fetchAndDetect()

    // Then poll at interval
    intervalRef.current = setInterval(fetchAndDetect, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, intervalMs, addReading])
}

export default useRealtimeData