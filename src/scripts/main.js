import { fetchDashboardData } from "./data.js";
import { getState, setState, subscribe } from "./state.js";
import { renderAssetSummary } from "./render/assetSummary.js";
import { renderExchangesSummary } from "./render/exchangesSummary.js";
import { renderAlerts } from "./render/alerts.js";
import { renderTopAutotraders } from "./render/topAutotraders.js";
import { renderAutotradersSummary } from "./render/autotradersSummary.js";

const appRoot = document.getElementById("app");

const sectionKeys = [
  "assetSummary",
  "exchangesSummary",
  "alerts",
  "topAutotraders",
  "autotradersSummary",
];

const setSectionStatuses = (status) => {
  const statuses = sectionKeys.reduce((acc, key) => {
    acc[key] = status;
    return acc;
  }, {});
  setState({ status: statuses });
};

const evaluateStatus = (data, key) => {
  if (!data) {
    return "empty";
  }

  if (key === "topAutotraders") {
    return data.length === 0 ? "empty" : "ready";
  }

  if (key === "exchangesSummary") {
    return data.exchanges?.length ? "ready" : "empty";
  }

  return "ready";
};

const renderDashboard = (state) => {
  renderAssetSummary({ data: state.data.assetSummary, status: state.status.assetSummary });
  renderExchangesSummary({
    data: state.data.exchangesSummary,
    status: state.status.exchangesSummary,
  });
  renderAlerts({ data: state.data.alerts, status: state.status.alerts });
  renderTopAutotraders({
    data: state.data.topAutotraders,
    status: state.status.topAutotraders,
  });
  renderAutotradersSummary({
    data: state.data.autotradersSummary,
    status: state.status.autotradersSummary,
  });
};

const bindTimeframeControls = () => {
  const pills = document.querySelectorAll(".timeframe-pill");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const range = pill.textContent.trim();
      const currentState = getState();
      const assetSummary = currentState.data.assetSummary;
      if (!assetSummary?.chart) {
        return;
      }
      setState({
        data: {
          assetSummary: {
            ...assetSummary,
            chart: {
              ...assetSummary.chart,
              activeRange: range,
            },
          },
        },
      });
    });
  });
};

const loadDashboardData = async () => {
  setSectionStatuses("loading");
  try {
    const data = await fetchDashboardData();
    const statuses = sectionKeys.reduce((acc, key) => {
      acc[key] = evaluateStatus(data[key], key);
      return acc;
    }, {});

    setState({ data, status: statuses });
  } catch (error) {
    const statuses = sectionKeys.reduce((acc, key) => {
      acc[key] = "error";
      return acc;
    }, {});
    const errors = sectionKeys.reduce((acc, key) => {
      acc[key] = error;
      return acc;
    }, {});
    setState({ status: statuses, errors });
  }
};

if (appRoot) {
  appRoot.dataset.ready = "true";
  subscribe(renderDashboard);
  bindTimeframeControls();
  renderDashboard(getState());
  loadDashboardData();
}
