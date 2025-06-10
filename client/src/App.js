import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [days] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
  const [airports, setAirports] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedAirport, setSelectedAirport] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/airports")
      .then((res) => res.json())
      .then((data) => {
        setAirports(data);
        if (data.length > 0) setSelectedAirport(data[0].id);
      })
      .catch(() => setError("Failed to fetch airports"));
  }, []);

  const handleCalculate = () => {
    setLoading(true);
    setResult(null);
    setError(null);
    fetch(`http://127.0.0.1:5000/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // send selected day as a number (1 for Monday, 7 for Sunday)
        day_of_week: String(days.indexOf(selectedDay) + 1),
        airport_id: String(selectedAirport),
      }),
    })
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch(() => setError("Failed to fetch prediction"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="App">
      <h2>Flight Delay Prediction</h2>
      <div style={{ margin: "1rem 0" }}>
        <label>
          Day of the week:
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Airport:
          <select
            value={selectedAirport}
            onChange={(e) => setSelectedAirport(e.target.value)}
          >
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.name}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={handleCalculate}
          style={{ marginLeft: "1rem" }}
          disabled={loading || !selectedAirport}
        >
          {loading ? "Calculating..." : "Calculate Delay"}
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div style={{ marginTop: "1rem" }}>
          {/* Display prediction result as: The possibility of your flight being delayed is X%. We are Y% sure. */}
          <h3>
            The possibility of your flight being delayed is{" "}
            {Math.round(result.delay * 10000) / 100}%.
            <br />
            We are {Math.round(result.certainty * 10000) / 100}% sure.
          </h3>
          <p>
            Note: This prediction is based on historical data and may not
            reflect real-time conditions.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
