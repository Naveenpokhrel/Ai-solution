import React from 'react';

export default function GeographicDistribution({ chartCountries, metrics }) {
  const totalInq = metrics?.totalInquiries || 0;

  return (
    <div className="dist-list" style={{ marginTop: "10px" }}>
      {chartCountries.map((c, idx) => {
        const percentage = totalInq > 0 ? (c.value / totalInq) * 100 : 0;
        return (
          <div key={idx} className="dist-item">
            <div className="dist-info">
              <span>📍 {c.name || "Unknown"}</span>
              <span>
                {c.value} ({percentage.toFixed(0)}%)
              </span>
            </div>
            <div className="dist-bar-bg">
              <div
                className="dist-bar-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      {chartCountries.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          No geographic statistics available.
        </div>
      )}
    </div>
  );
}
