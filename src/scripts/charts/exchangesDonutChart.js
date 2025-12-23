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

  const width = 200;
  const height = 200;
  const radius = 74;
  const strokeWidth = 22;
  const total = exchanges.reduce((sum, item) => sum + Number(item.amount || 0), 0) || 1;

  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const defs = createSvgElement("defs");
  const glowFilter = createSvgElement("filter");
  glowFilter.setAttribute("id", "exchangeGlow");
  glowFilter.setAttribute("x", "-30%");
  glowFilter.setAttribute("y", "-30%");
  glowFilter.setAttribute("width", "160%");
  glowFilter.setAttribute("height", "160%");

  const glow = createSvgElement("feDropShadow");
  glow.setAttribute("dx", "0");
  glow.setAttribute("dy", "0");
  glow.setAttribute("stdDeviation", "4");
  glow.setAttribute("flood-color", "rgba(255,255,255,0.35)");
  glow.setAttribute("flood-opacity", "0.6");
  glowFilter.appendChild(glow);
  defs.appendChild(glowFilter);

  const centerGradient = createSvgElement("radialGradient");
  centerGradient.setAttribute("id", "exchangeCenterGlow");
  centerGradient.setAttribute("cx", "50%");
  centerGradient.setAttribute("cy", "50%");
  centerGradient.setAttribute("r", "50%");
  const stopBright = createSvgElement("stop");
  stopBright.setAttribute("offset", "0%");
  stopBright.setAttribute("stop-color", "rgba(200, 242, 107, 0.7)");
  const stopMid = createSvgElement("stop");
  stopMid.setAttribute("offset", "45%");
  stopMid.setAttribute("stop-color", "rgba(200, 242, 107, 0.25)");
  const stopClear = createSvgElement("stop");
  stopClear.setAttribute("offset", "100%");
  stopClear.setAttribute("stop-color", "rgba(200, 242, 107, 0)");
  centerGradient.appendChild(stopBright);
  centerGradient.appendChild(stopMid);
  centerGradient.appendChild(stopClear);
  defs.appendChild(centerGradient);
  svg.appendChild(defs);

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
    arc.setAttribute("filter", "url(#exchangeGlow)");
    svg.appendChild(arc);
    currentAngle += angle;
  });

  const center = createSvgElement("circle");
  center.setAttribute("cx", `${width / 2}`);
  center.setAttribute("cy", `${height / 2}`);
  center.setAttribute("r", `${radius - strokeWidth / 2}`);
  center.setAttribute("fill", "rgba(18, 15, 26, 0.92)");
  svg.appendChild(center);

  const centerGlow = createSvgElement("circle");
  centerGlow.setAttribute("cx", `${width / 2}`);
  centerGlow.setAttribute("cy", `${height / 2}`);
  centerGlow.setAttribute("r", "16");
  centerGlow.setAttribute("fill", "url(#exchangeCenterGlow)");
  centerGlow.setAttribute("opacity", "0.85");
  svg.appendChild(centerGlow);

  container.innerHTML = "";
  container.appendChild(svg);
};
