const createSvgElement = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);

export const renderAssetLineChart = (container, series) => {
  if (!container || !Array.isArray(series) || series.length === 0) {
    return;
  }

  const width = 600;
  const height = 190;
  const paddingTop = 12;
  const paddingBottom = 4;
  const paddingX = 18;
  const values = series.map(Number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  const step = (width - paddingX * 2) / (values.length - 1 || 1);
  const points = values.map((value, index) => {
    const x = paddingX + index * step;
    const y = height - paddingBottom - ((value - min) / range) * (height - paddingTop - paddingBottom);
    return { x, y };
  });
  const d = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  const baseline = createSvgElement("line");
  baseline.setAttribute("x1", paddingX);
  baseline.setAttribute("x2", width - paddingX);
  baseline.setAttribute("y1", height - paddingBottom);
  baseline.setAttribute("y2", height - paddingBottom);
  baseline.setAttribute("stroke", "rgba(255, 255, 255, 0.16)");
  baseline.setAttribute("stroke-width", "1");
  baseline.setAttribute("stroke-dasharray", "4 6");

  const glow = createSvgElement("path");
  glow.setAttribute("d", d);
  glow.setAttribute("fill", "none");
  glow.setAttribute("stroke", "rgba(200, 242, 107, 0.35)");
  glow.setAttribute("stroke-width", "12");
  glow.setAttribute("stroke-linecap", "round");
  glow.setAttribute("stroke-linejoin", "round");

  const path = createSvgElement("path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#c8f26b");
  path.setAttribute("stroke-width", "5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  const hoverLine = createSvgElement("line");
  hoverLine.setAttribute("y1", paddingTop);
  hoverLine.setAttribute("y2", height - paddingBottom);
  hoverLine.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
  hoverLine.setAttribute("stroke-width", "1");
  hoverLine.setAttribute("stroke-dasharray", "4 6");
  hoverLine.style.opacity = "0";

  const hoverDot = createSvgElement("circle");
  hoverDot.setAttribute("r", "4");
  hoverDot.setAttribute("fill", "#c8f26b");
  hoverDot.setAttribute("stroke", "rgba(200, 242, 107, 0.4)");
  hoverDot.setAttribute("stroke-width", "3");
  hoverDot.style.opacity = "0";

  const overlay = createSvgElement("rect");
  overlay.setAttribute("x", "0");
  overlay.setAttribute("y", "0");
  overlay.setAttribute("width", width);
  overlay.setAttribute("height", height);
  overlay.setAttribute("fill", "transparent");

  const tooltip = document.createElement("div");
  tooltip.textContent = "";
  tooltip.style.position = "absolute";
  tooltip.style.top = "0";
  tooltip.style.left = "0";
  tooltip.style.padding = "6px 10px";
  tooltip.style.borderRadius = "999px";
  tooltip.style.background = "rgba(10, 9, 16, 0.8)";
  tooltip.style.color = "#f2f0f8";
  tooltip.style.fontSize = "0.8rem";
  tooltip.style.whiteSpace = "nowrap";
  tooltip.style.pointerEvents = "none";
  tooltip.style.opacity = "0";
  tooltip.style.transition = "opacity 0.1s ease";

  container.innerHTML = "";
  container.style.position = "relative";
  container.appendChild(tooltip);
  svg.appendChild(baseline);
  svg.appendChild(glow);
  svg.appendChild(path);
  svg.appendChild(hoverLine);
  svg.appendChild(hoverDot);
  svg.appendChild(overlay);
  container.appendChild(svg);

  const updateHover = (clientX) => {
    const rect = svg.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    const relativeX = ((clientX - rect.left) / rect.width) * width;
    const clampedX = Math.min(Math.max(relativeX, paddingX), width - paddingX);
    const index = Math.min(
      points.length - 1,
      Math.max(0, Math.round((clampedX - paddingX) / step))
    );
    const point = points[index];
    const value = values[index];
    const tooltipText = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    hoverLine.setAttribute("x1", point.x);
    hoverLine.setAttribute("x2", point.x);
    hoverDot.setAttribute("cx", point.x);
    hoverDot.setAttribute("cy", point.y);
    hoverLine.style.opacity = "1";
    hoverDot.style.opacity = "1";

    tooltip.textContent = tooltipText;
    tooltip.style.opacity = "1";
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const xPx = (point.x / width) * rect.width;
    const yPx = (point.y / height) * rect.height;
    const clampedLeft = Math.min(Math.max(xPx - tooltipWidth / 2, 0), rect.width - tooltipWidth);
    const offsetY = 12;
    const clampedTop = Math.min(Math.max(yPx - tooltipHeight - offsetY, 0), rect.height - tooltipHeight);
    tooltip.style.left = `${clampedLeft}px`;
    tooltip.style.top = `${clampedTop}px`;
  };

  overlay.addEventListener("mousemove", (event) => {
    updateHover(event.clientX);
  });

  overlay.addEventListener("mouseleave", () => {
    hoverLine.style.opacity = "0";
    hoverDot.style.opacity = "0";
    tooltip.style.opacity = "0";
  });
};
