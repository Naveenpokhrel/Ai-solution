import React from 'react';

export default function SvgBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
        No data to display
      </div>
    );
  }

  const width = 500;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const counts = data.map((d) => d.count);
  const maxCount = Math.max(...counts, 4);

  const barWidth = Math.min(40, (chartWidth / data.length) * 0.55);
  const xStep = chartWidth / data.length;

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
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
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

        {/* X Axis Line */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.count / maxCount) * chartHeight;
          const x = paddingLeft + index * xStep + (xStep - barWidth) / 2;
          const y = height - paddingBottom - barHeight;

          return (
            <g key={index}>
              {/* Rounded top corner bar path */}
              <path
                d={`
                  M ${x} ${y + 4}
                  Q ${x} ${y} ${x + 4} ${y}
                  L ${x + barWidth - 4} ${y}
                  Q ${x + barWidth} ${y} ${x + barWidth} ${y + 4}
                  L ${x + barWidth} ${height - paddingBottom}
                  L ${x} ${height - paddingBottom}
                  Z
                `}
                fill="url(#barGrad)"
              />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                fill="#0f172a"
                fontSize="11px"
                fontWeight="700"
                textAnchor="middle"
              >
                {item.count}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - paddingBottom + 18}
                fill="#64748b"
                fontSize="10px"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
