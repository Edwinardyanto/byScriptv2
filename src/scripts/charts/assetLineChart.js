const NS = "http://www.w3.org/2000/svg";
const createSvgElement = (tag) => document.createElementNS(NS, tag);

export const renderAssetLineChart = (container, series) => {
  if (!container || !Array.isArray(series) || series.length === 0) {
    return;
  }

  // ===== CONFIG =====
  const width = 600;
  const height = 190;
  const padding = 16;

  const values = series.map(Number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // ===== SVG ROOT =====
  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.overflow = "visible";

  // ===== BASELINE (Y reference) =====
  const baseline = createSvgElement("line");
  baseline.setAttribute("x1", padding);
  baseline.setAttribute("x2", width - padding);
  baseline.setAttribute("y1", height - padding);
  baseline.setAttribute("y2", height - padding);
  baseline.setAttribute("stroke", "rgba(255,255,255,0.06)");
  baseline.setAttribute("stroke-width", "1");

  svg.appendChild(baseline);

  // ===== PATH DATA =====
  const step = (width - padding * 2) / (values.length - 1 || 1);
  const points = values.map((value, index) => {
    const x = padding + index * step;
    const y =
      height -
      padding -
      ((value - min) / range) * (height - padding * 2);
    return { x, y, value };
  });

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // ===== GLOW PATH =====
  const glow = createSvgElement("path");
  glow.setAttribute("d", d);
  glow.setAttribute("fill", "none");
  glow.setAttribute("stroke", "rgba(200, 242, 107, 0.25)");
  glow.setAttribute("stroke-width", "12");
  glow.setAttribute("stroke-linecap", "round");
  glow.setAttribute("stroke-linejoin", "round");

  // ===== MAIN PATH =====
  const path = createSvgElement("path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#c8f26b");
  path.setAttribute("stroke-width", "4.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  svg.appendChild(glow);
  svg.appendChild(path);

  // ===== HOVER LINE =====
  const hoverLine = createSvgElement("line");
  hoverLine.setAttribute("y1", padding);
  hoverLine.setAttribute("y2", height - padding);
  hoverLine.setAttribute("stroke", "rgba(255,255,255,0.18)");
  hoverLine.setAttribute("stroke-width", "1");
  hoverLine.style.display = "none";

  // ===== HOVER DOT =====
  const hoverDot = createSvgElement("circle");
  hoverDot.setAttribute("r", "4");
  hoverDot.setAttribute("fill", "#c8f26b");
  hoverDot.setAttribute(
    "filter",
    "drop-shadow(0 0 6px rgba(200,242,107,0.6))"
  );
  hoverDot.style.display = "none";

  svg.appendChild(hoverLine);
  svg.appendChild(hoverDot);

  // ===== INTERACTION LAYER =====
  const interactionLayer = createSvgElement("rect");
  interactionLayer.setAttribute("x", padding);
  interactionLayer.setAttribute("y", padding);
  interactionLayer.setAttribute("width", width - padding * 2);
  interactionLayer.setAttribute("height", height - padding * 2);
  interactionLayer.setAttribute("fill", "transparent");
  interactionLayer.style.cursor = "crosshair";

  svg.appendChild(interactionLayer);

  // ===== TOOLTIP (HTML overlay) =====
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.style.padding = "4px 8px";
  tooltip.style.fontSize = "12px";
  tooltip.style.borderRadius = "6px";
  tooltip.style.background = "rgba(18,15,26,0.85)";
  tooltip.style.color = "#e8e3f3";
  tooltip.style.border = "1px solid rgba(255,255,255,0.12)";
  tooltip.style.backdropFilter = "blur(6px)";
  tooltip.style.opacity = "0";
  tooltip.style.transform = "translate(-50%, -100%)";
  tooltip.style.transition = "opacity 0.12s ease";

  container.style.position = "relative";
  container.appendChild(tooltip);

  // ===== HOVER LOGIC =====
  interactionLayer.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const index = Math.round((mouseX - padding) / step);
    const point = points[Math.max(0, Math.min(points.length - 1, index))];

    hoverLine.setAttribute("x1", point.x);
    hoverLine.setAttribute("x2", point.x);
    hoverLine.style.display = "block";

    hoverDot.setAttribute("cx", point.x);
    hoverDot.setAttribute("cy", point.y);
    hoverDot.style.display = "block";

    tooltip.textContent = `$${point.value.toLocaleString()}`;
    tooltip.style.left = `${point.x}px`;
    tooltip.style.top = `${point.y}px`;
    tooltip.style.opacity = "1";
  });

  interactionLayer.addEventListener("mouseleave", () => {
    hoverLine.style.display = "none";
    hoverDot.style.display = "none";
    tooltip.style.opacity = "0";
  });

  // ===== MOUNT =====
  container.innerHTML = "";
  container.appendChild(svg);
};
