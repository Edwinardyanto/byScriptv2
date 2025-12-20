const NS = "http://www.w3.org/2000/svg";
const create = (tag) => document.createElementNS(NS, tag);

export const renderAssetLineChart = (container, series) => {
  if (!container || !Array.isArray(series) || series.length === 0) return;

  const width = 640;
  const height = 180;
  const padding = { top: 16, right: 16, bottom: 24, left: 16 };

  const values = series.map(Number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const svg = create("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.overflow = "visible";

  /* =========================
     Y SCALE (REFERENCE LINE)
  ========================== */
  const yLine = create("line");
  yLine.setAttribute("x1", padding.left);
  yLine.setAttribute("x2", width - padding.right);
  yLine.setAttribute("y1", height - padding.bottom);
  yLine.setAttribute("y2", height - padding.bottom);
  yLine.setAttribute("stroke", "rgba(255,255,255,0.15)");
  yLine.setAttribute("stroke-dasharray", "4 6");
  svg.appendChild(yLine);

  /* =========================
     LINE PATH
  ========================== */
  const step =
    (width - padding.left - padding.right) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = padding.left + i * step;
    const y =
      height -
      padding.bottom -
      ((v - min) / range) * (height - padding.top - padding.bottom);
    return { x, y, v };
  });

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
    .join(" ");

  const glow = create("path");
  glow.setAttribute("d", d);
  glow.setAttribute("fill", "none");
  glow.setAttribute("stroke", "rgba(200,242,107,0.35)");
  glow.setAttribute("stroke-width", "12");
  glow.setAttribute("stroke-linecap", "round");

  const path = create("path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#c8f26b");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  svg.appendChild(glow);
  svg.appendChild(path);

  /* =========================
     HOVER ELEMENTS
  ========================== */
  const hoverLine = create("line");
  hoverLine.setAttribute("y1", padding.top);
  hoverLine.setAttribute("y2", height - padding.bottom);
  hoverLine.setAttribute("stroke", "rgba(255,255,255,0.2)");
  hoverLine.setAttribute("stroke-width", "1");
  hoverLine.style.opacity = "0";

  const dot = create("circle");
  dot.setAttribute("r", "5");
  dot.setAttribute("fill", "#c8f26b");
  dot.style.opacity = "0";

  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.style.padding = "6px 10px";
  tooltip.style.borderRadius = "10px";
  tooltip.style.fontSize = "12px";
  tooltip.style.fontWeight = "600";
  tooltip.style.background = "rgba(20,18,30,0.9)";
  tooltip.style.border = "1px solid rgba(255,255,255,0.12)";
  tooltip.style.color = "#fff";
  tooltip.style.boxShadow = "0 10px 24px rgba(0,0,0,0.4)";
  tooltip.style.opacity = "0";
  tooltip.style.transform = "translate(-50%, -120%)";

  svg.appendChild(hoverLine);
  svg.appendChild(dot);

  container.style.position = "relative";
  container.appendChild(svg);
  container.appendChild(tooltip);

  /* =========================
     INTERACTION
  ========================== */
  svg.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const index = Math.round(
      (x - padding.left) / step
    );

    if (index < 0 || index >= points.length) return;

    const p = points[index];

    hoverLine.setAttribute("x1", p.x);
    hoverLine.setAttribute("x2", p.x);
    hoverLine.style.opacity = "1";

    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.style.opacity = "1";

    tooltip.textContent = `$${p.v.toLocaleString()}`;
    tooltip.style.left = `${p.x}px`;
    tooltip.style.top = `${p.y}px`;
    tooltip.style.opacity = "1";
  });

  svg.addEventListener("mouseleave", () => {
    hoverLine.style.opacity = "0";
    dot.style.opacity = "0";
    tooltip.style.opacity = "0";
  });
};
