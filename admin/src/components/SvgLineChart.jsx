import React from 'react';

export default function SvgLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
        No data to display
      </div>
    );
  }

  const width = 600;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const counts = data.map((d) => d.count);
  const maxCount = Math.max(...counts, 4);

  // Calculate coordinates for points
  const points = data.map((item, index) => {
    const x =
      paddingLeft +
      index * (chartWidth / (data.length > 1 ? data.length - 1 : 1));
    const y = height - paddingBottom - (item.count / maxCount) * chartHeight;
    return { x, y, label: item.month, count: item.count };
  });

  // Construct path string
  let linePath = "";
  let areaPath = "";
  if (points.length > 0) {
    linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }

  // Grid lines
  const gridLines = [];
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const val = Math.round((maxCount / gridCount) * i);
    const y = height - paddingBottom - (i / gridCount) * chartHeight;
    gridLines.push({ y, val });
  }

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={paddingLeft - 10}
              y={line.y + 4}
              fill="#94a3b8"
              fontSize="10px"
              textAnchor="end"
              fontWeight="550"
            >
              {line.val}
            </text>
          </g>
        ))}

        {/* Area Path */}
        {points.length > 0 && <path d={areaPath} fill="url(#areaGrad)" />}

        {/* Line Path */}
        {points.length > 0 && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* X Axis Line */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Dots & Labels */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="7" fill="#2563eb" opacity="0.15" />
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <text
              x={p.x}
              y={p.y - 10}
              fill="#0f172a"
              fontSize="11px"
              fontWeight="700"
              textAnchor="middle"
            >
              {p.count}
            </text>
            <text
              x={p.x}
              y={height - paddingBottom + 18}
              fill="#64748b"
              fontSize="10px"
              fontWeight="600"
              textAnchor="middle"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
