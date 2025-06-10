import React from 'react';

interface ResultProps {
  result: string | null;
}

const Result: React.FC<ResultProps> = ({ result }) => {
  if (!result) return null;
  let parsed: { certainty: number; delay: number } | null = null;
  try {
    parsed = JSON.parse(result);
  } catch {
    return <div className="result"><h2>Result</h2><pre>{result}</pre></div>;
  }
  if (!parsed) return null;
  return (
    <div className="result">
      <h2>Chance of Delay &gt; 15 min</h2>
      <div className="result-main">
        <div className="result-row">
          <span className="result-label">Chance of Delay:</span>
          <span className="result-value delay">{(parsed.delay * 100).toFixed(1)}%</span>
        </div>
        <div className="result-row">
          <span className="result-label">Chance of On-Time:</span>
          <span className="result-value certainty">{(parsed.certainty * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Result;
