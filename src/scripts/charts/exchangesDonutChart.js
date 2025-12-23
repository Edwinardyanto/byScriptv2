const createSvgElement = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);

const chartColors = [
  "#c8f26b",
  "#ffd36f",
  "#8ed3ff",
  "#9a7bff",
  "#ff9ab5",
];

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
};

export const renderExchangesDonutChart = (container, exchanges) => {
  if (!container || !Array.isArray(exchanges) || exchanges.length === 0) {
    return;
  }

  const width = 160;
  const height = 160;
  const radius = 60;
  const strokeWidth = 18;
  const total = exchanges.reduce((sum, item) => sum + Number(item.amount || 0), 0) || 1;

  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  let currentAngle = 0;
  exchanges.forEach((exchange, index) => {
    const value = Number(exchange.amount || 0);
    const angle = (value / total) * 360;
    const arc = createSvgElement("path");
    arc.setAttribute(
      "d",
      describeArc(width / 2, height / 2, radius, currentAngle, currentAngle + angle)
    );
    arc.setAttribute("fill", "none");
    arc.setAttribute("stroke", chartColors[index % chartColors.length]);
    arc.setAttribute("stroke-width", `${strokeWidth}`);
    arc.setAttribute("stroke-linecap", "round");
    arc.setAttribute("opacity", "0.9");
    svg.appendChild(arc);
    currentAngle += angle;
  });

  const center = createSvgElement("circle");
  center.setAttribute("cx", `${width / 2}`);
  center.setAttribute("cy", `${height / 2}`);
  center.setAttribute("r", `${radius - strokeWidth / 2}`);
  center.setAttribute("fill", "rgba(18, 15, 26, 0.9)");
  svg.appendChild(center);

  container.innerHTML = "";
  container.appendChild(svg);
};
