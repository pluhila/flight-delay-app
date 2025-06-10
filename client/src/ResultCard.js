import React from "react";
import "./ResultCard.css";

function getBgColor(delay) {
  if (delay < 0.05) return "result-green";
  if (delay < 0.12) return "result-blue";
  if (delay < 0.18) return "result-yellow";
  if (delay < 0.25) return "result-orange";
  return "result-red";
}

function ResultCard({ delay, certainty }) {
  if (!delay || !certainty) {
    return <div className="result-card" />;
  }
  const percent = Math.round(delay * 10000) / 100;
  const certaintyPercent = Math.round(certainty * 10000) / 100;
  const bgClass = getBgColor(delay);

  return (
    <div className={`result-card ${bgClass}`}>
      Delay chance: {percent}%.
      <br />
      Certainty: {certaintyPercent}%.
    </div>
  );
}

export default ResultCard;
