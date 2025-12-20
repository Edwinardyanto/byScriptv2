// src/assetSummaryChart.js
// Premium Asset Summary Chart (Bloomberg / Apple hybrid)
// No dependency, pure SVG

export function renderAssetSummaryChart({
  containerId,
  data,
  width = 1000,
  height = 260
}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const padding = {
    top: 24,
    right: 24,
    bottom: 20, // ⬅ RAPAT KE BAWAH
    left: 24
  };

  const minY = Math.min(...data); // ⬅ NO FOOTROOM
  const maxY = Math.max(...data) * 1.02; // sedikit headroom

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.overflow = "visible";

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const scaleX = (i) =>
    padding.left + (i / (data.length - 1)) * chartWidth;

  const scaleY = (value) =>
    padding.top +
    (maxY - value) / (maxY - minY) * chartHeight;

  // --- BASELINE (x-line)
  const baseline = document.createElementNS(svgNS, "line");
  baseline.setAttribute("x1", padding.left);
  baseline.setAttribute("x2", width - padding.right);
  baseline.setAttribute("y1", height - padding.bottom);
  baseline.setAttribute("y2", height - padding.bottom);
  baseline.setAttribute("stroke", "rgba(255,255,255,0.08)");
  baseline.setAttribute("stroke-dasharray", "4 6");
  svg.appendChild(baseline);

  // --- LINE PATH
  let d = "";
  data.forEach((v, i) => {
    const x = scaleX(i);
    const y = scaleY(v);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  const glowPath = document.createElementNS(svgNS, "path");
  glowPath.setAttribute("d", d);
  glowPath.setAttribute("fill", "none");
  glowPath.setAttribute("stroke", "#B6F35A");
  glowPath.setAttribute("stroke-width", "8");
  glowPath.setAttribute("opacity", "0.15");
  glowPath.setAttribute("stroke-linecap", "round");
  svg.appendChild(glowPath);

  const linePath = document.createElementNS(svgNS, "path");
  linePath.setAttribute("d", d);
  linePath.setAttribute("fill", "none");
  linePath.setAttribute("stroke", "#C8FF63");
  linePath.setAttribute("stroke-width", "3.5");
  linePath.setAttribute("stroke-linecap", "round");
  linePath.setAttribute("stroke-linejoin", "round");
  svg.appendChild(linePath);

  // --- HOVER ELEMENTS
  const hoverDot = document.createElementNS(svgNS, "circle");
  hoverDot.setAttribute("r", "5");
  hoverDot.setAttribute("fill", "#C8FF63");
  hoverDot.style.display = "none";
  svg.appendChild(hoverDot);

  const hoverLine = document.createElementNS(svgNS, "line");
  hoverLine.setAttribute("y1", padding.top);
  hoverLine.setAttribute("y2", height - padding.bottom);
  hoverLine.setAttribute("stroke", "rgba(200,255,99,0.25)");
  hoverLine.setAttribute("stroke-dasharray", "2 4");
  hoverLine.style.display = "none";
  svg.appendChild(hoverLine);

  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.style.padding = "6px 10px";
  tooltip.style.background = "rgba(20,20,30,0.9)";
  tooltip.style.borderRadius = "8px";
  tooltip.style.color = "#C8FF63";
  tooltip.style.fontSize = "12px";
  tooltip.style.fontFamily = "Inter, system-ui";
  tooltip.style.display = "none";

  container.style.position = "relative";
  container.appendChild(tooltip);

  // --- MOUSE INTERACTION
  svg.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const index = Math.round(
      ((mouseX - padding.left) / chartWidth) * (data.length - 1)
    );

    if (index < 0 || index >= data.length) return;

    const x = scaleX(index);
    const y = scaleY(data[index]);

    hoverDot.setAttribute("cx", x);
    hoverDot.setAttribute("cy", y);
    hoverDot.style.display = "block";

    hoverLine.setAttribute("x1", x);
    hoverLine.setAttribute("x2", x);
    hoverLine.style.display = "block";

    tooltip.style.display = "block";
    tooltip.innerHTML = `$${data[index].toLocaleString()}`;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 36}px`;
  });

  svg.addEventListener("mouseleave", () => {
    hoverDot.style.display = "none";
    hoverLine.style.display = "none";
    tooltip.style.display = "none";
  });

  container.appendChild(svg);
}
