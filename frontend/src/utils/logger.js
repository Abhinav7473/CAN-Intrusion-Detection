/**
 * Research interaction logger
 * Logs user behavior for HCI studies
 */

class ResearchLogger {
  constructor() {
    this.logs = []
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.userId = null // Set this from user input or URL param
  }

  log(event) {
    const logEntry = {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      iso_timestamp: new Date().toISOString(),
      ...event
    }
    
    this.logs.push(logEntry)
    console.log('[Research Log]', logEntry)
    
    // Optional: Send to backend
    // this.sendToBackend(logEntry)
  }

  // Download logs as JSON
  downloadLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `research_logs_${this.sessionId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Get logs
  getLogs() {
    return this.logs
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }
}

// Singleton instance
const logger = new ResearchLogger()

export default logger