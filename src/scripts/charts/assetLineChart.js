const createSvgElement = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);

export const renderAssetLineChart = (container, series) => {
  if (!container || !Array.isArray(series) || series.length === 0) {
    return;
  }

  const width = 600;
  const height = 200;
  const padding = 12;
  const values = series.map(Number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  const path = createSvgElement("path");
  const step = (width - padding * 2) / (values.length - 1 || 1);
  const points = values.map((value, index) => {
    const x = padding + index * step;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  });
  const d = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#c8f26b");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  const glow = createSvgElement("path");
  glow.setAttribute("d", d);
  glow.setAttribute("fill", "none");
  glow.setAttribute("stroke", "rgba(200, 242, 107, 0.35)");
  glow.setAttribute("stroke-width", "10");
  glow.setAttribute("stroke-linecap", "round");
  glow.setAttribute("stroke-linejoin", "round");

  svg.appendChild(glow);
  svg.appendChild(path);

  container.innerHTML = "";
  container.appendChild(svg);
};
