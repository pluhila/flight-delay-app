import React from "react";
import "./DropdownSelector.css";

function DropdownSelector({
  label,
  options,
  value,
  onChange,
  optionLabel = "label",
  optionValue = "value",
  style = {},
}) {
  return (
    <label className="dropdown-label" style={style}>
      <span>{label}</span>
      <select
        className="dropdown-select"
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option
            key={opt[optionValue] || opt}
            value={opt[optionValue] || opt}
          >
            {opt[optionLabel] || opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default DropdownSelector;
