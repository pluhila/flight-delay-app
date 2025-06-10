// frontend.js
// Simple frontend logic to interact with the FastAPI backend for flight delay prediction

const API_BASE = 'http://localhost:8000'; // Change if backend runs elsewhere

// Fetch list of airports from the backend
async function fetchAirports() {
    const res = await fetch(`${API_BASE}/airports`);
    if (!res.ok) throw new Error('Failed to fetch airports');
    const data = await res.json();
    return data.airports;
}

// Predict delay using selected day and airport
async function predictDelay(dayOfWeek, airportId) {
    const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_of_week: dayOfWeek, airport_id: airportId })
    });
    if (!res.ok) throw new Error('Prediction failed');
    return await res.json();
}

// Populate dropdowns and handle form submission
document.addEventListener('DOMContentLoaded', async () => {
    const airportSelect = document.getElementById('airport');
    const daySelect = document.getElementById('day');
    const resultDiv = document.getElementById('result');
    
    // Populate days
    const days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];
    days.forEach((day, idx) => {
        const opt = document.createElement('option');
        opt.value = idx + 1;
        opt.textContent = day;
        daySelect.appendChild(opt);
    });

    // Populate airports
    try {
        const airports = await fetchAirports();
        airports.forEach(airport => {
            const opt = document.createElement('option');
            opt.value = airport.id;
            opt.textContent = airport.name;
            airportSelect.appendChild(opt);
        });
    } catch (e) {
        resultDiv.textContent = 'Error loading airports.';
    }

    // Handle form submit
    document.getElementById('predict-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const day = parseInt(daySelect.value);
        const airportId = parseInt(airportSelect.value);
        resultDiv.textContent = 'Predicting...';
        try {
            const prediction = await predictDelay(day, airportId);
            resultDiv.textContent = `Predicted delay: ${prediction.predicted_delay.toFixed(2)} min (Confidence: ${Math.round(prediction.confidence * 100)}%)`;
        } catch (err) {
            resultDiv.textContent = 'Prediction failed.';
        }
    });
});
