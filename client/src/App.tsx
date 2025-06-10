import { useState, useEffect } from 'react'
import './App.css'
import Result from './components/Result'
import ErrorMessage from './components/ErrorMessage'
import SubmitButton from './components/SubmitButton'
import SideMenu from './components/SideMenu'
import DaySelector from './components/DaySelector'
import AirportSelector from './components/AirportSelector'
import SecretModal from './components/SecretModal'
import { fetchAirports, fetchPrediction } from './api/flightApi'
import type { Airport } from './api/flightApi'

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

function App() {
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [airports, setAirports] = useState<Airport[]>([])
  const [selectedAirport, setSelectedAirport] = useState<number | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    fetchAirports()
      .then(data => {
        setAirports(data)
        if (data.length > 0) setSelectedAirport(data[0].id)
      })
      .catch(() => setError('Failed to load airports'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const dayIndex = daysOfWeek.indexOf(selectedDay) + 1
      if (!selectedAirport) throw new Error('No airport selected')
      const data = await fetchPrediction(dayIndex, selectedAirport)
      setResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`app-container-wrapper${sideMenuOpen ? ' side-menu-open' : ''}`}> 
      <div className={`app-container${sideMenuOpen ? ' menu-open' : ''}`}>
        <div className="app-header">
          <img src="/public/flight-logo.png" alt="Flight Delay App Logo" className="app-logo" />
          <button
            className="menu-toggle-btn"
            onClick={() => setSideMenuOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
        <h1>Flight Delay Predictor</h1>
        <form onSubmit={handleSubmit} className="form-section">
          <DaySelector daysOfWeek={daysOfWeek} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          <AirportSelector airports={airports} selectedAirport={selectedAirport} setSelectedAirport={setSelectedAirport} />
          <SubmitButton loading={loading} disabled={loading || !selectedAirport}>
            Check Delay
          </SubmitButton>
        </form>
        <ErrorMessage error={error} />
        <Result result={result} />
      </div>
      <SideMenu
        open={sideMenuOpen}
        onClear={() => setResult(null)}
        onSecret={() => setShowSecret(true)}
      />
      {showSecret && (
        <SecretModal onClose={() => setShowSecret(false)} />
      )}
    </div>
  )
}

export default App
