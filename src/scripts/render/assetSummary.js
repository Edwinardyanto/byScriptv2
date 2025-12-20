import { renderAssetLineChart } from "../charts/assetLineChart.js";

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

const clearChart = (container) => {
  if (!container) return;
  container.innerHTML = "";
};

const updateTimeframeButtons = (activeRange) => {
  const pills = document.querySelectorAll(".timeframe-pill");
  pills.forEach((pill) => {
    const isActive = pill.textContent.trim() === activeRange;
    pill.classList.toggle("timeframe-pill--active", isActive);
  });
};

export const renderAssetSummary = (sectionState) => {
  const { data, status } = sectionState;
  const chartContainer = document.querySelector(
    '[data-field="asset.chartLabel"]'
  );

  // ===== LOADING =====
  if (status === "loading") {
    setText('[data-field="asset.totalBalance"]', "Loading...");
    setText('[data-field="asset.change"]', "--");
    clearChart(chartContainer);
    return;
  }

  // ===== ERROR =====
  if (status === "error") {
    setText('[data-field="asset.totalBalance"]', "--");
    setText('[data-field="asset.change"]', "--");
    clearChart(chartContainer);
    return;
  }

  // ===== EMPTY =====
  if (!data) {
    setText('[data-field="asset.totalBalance"]', "--");
    setText('[data-field="asset.change"]', "--");
    clearChart(chartContainer);
    return;
  }

  // ===== DATA =====
  setText('[data-field="asset.totalBalance"]', data.totalBalance);
  setText('[data-field="asset.change"]', data.change);

  const activeRange = data.chart?.activeRange || "7D";
  updateTimeframeButtons(activeRange);

  const series = data.chart?.ranges?.[activeRange] || [];

  clearChart(chartContainer);

  if (series.length > 0) {
    renderAssetLineChart(chartContainer, series);
  }
};
