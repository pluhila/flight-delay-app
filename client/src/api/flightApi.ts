export interface Airport {
  id: number;
  name: string;
}

export async function fetchAirports(): Promise<Airport[]> {
  const res = await fetch('/airports');
  if (!res.ok) throw new Error('Failed to load airports');
  return res.json();
}

export async function fetchPrediction(dayIndex: number, airportId: number) {
  const url = `/predict?day_of_week=${dayIndex}&airport_id=${airportId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
