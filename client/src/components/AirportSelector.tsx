import React from 'react';
import type { Airport } from '../api/flightApi';

interface AirportSelectorProps {
  airports: Airport[];
  selectedAirport: number | null;
  setSelectedAirport: (id: number) => void;
}

const AirportSelector: React.FC<AirportSelectorProps> = ({ airports, selectedAirport, setSelectedAirport }) => (
  <label>
    Airport:
    <select
      value={selectedAirport ?? ''}
      onChange={e => setSelectedAirport(Number(e.target.value))}
      disabled={airports.length === 0}
    >
      {airports.map(airport => (
        <option key={airport.id} value={airport.id}>{airport.name}</option>
      ))}
    </select>
  </label>
);

export default AirportSelector;
