import React, { useEffect, useState } from "react";
import "./App.css";
import DropdownSelector from "./DropdownSelector";
import ResultCard from "./ResultCard";
import PlaneLogo from "./PlaneLogo";

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

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
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
    <div className="App app-split-layout">
      <div className="app-bg-side">
        {/* You can change the image URL below or use a local image in public/ */}
        <img
          src="https://images.unsplash.com/photo-1698915487807-4963e61d30a7?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Airplane background"
          className="app-bg-img"
        />
      </div>
      <div className="app-form-side">
        <PlaneLogo
          style={{ display: "block", margin: "2rem auto 1rem auto" }}
        />
        <h2>Flight Delay Prediction</h2>
        <div
          style={{
            margin: "1rem 0",
            width: "100%",
            maxWidth: 340,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <form style={{ width: "100%" }} onSubmit={handleCalculate}>
            <DropdownSelector
              label="Day of the week:"
              options={days}
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              style={{ width: "100%" }}
            />
            <DropdownSelector
              label="Airport:"
              options={airports}
              value={selectedAirport}
              onChange={(e) => setSelectedAirport(e.target.value)}
              optionLabel="name"
              optionValue="id"
              style={{ width: "100%" }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                height: 40,
                marginTop: 16,
                padding: "0 1.5rem",
                borderRadius: 6,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 2px 8px #1976d220",
              }}
              disabled={loading || !selectedAirport}
            >
              Calculate Delay
            </button>
          </form>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}

        <ResultCard delay={result?.delay} certainty={result?.certainty} />
      </div>
    </div>
  );
}

export default App;
