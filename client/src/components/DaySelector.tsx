import React from 'react';

interface DaySelectorProps {
  daysOfWeek: string[];
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ daysOfWeek, selectedDay, setSelectedDay }) => (
  <label>
    Day of the week:
    <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
      {daysOfWeek.map(day => (
        <option key={day} value={day}>{day}</option>
      ))}
    </select>
  </label>
);

export default DaySelector;
