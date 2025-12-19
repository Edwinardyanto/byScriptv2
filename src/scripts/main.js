const appRoot = document.getElementById("app");

const state = {
  assetSummary: {
    totalBalance: "$12,430",
    change: "+3.4%",
    changeLabel: "vs last 7 days",
  },
  exchangesSummary: {
    total: "$21,240",
    exchanges: [
      { name: "Binance", value: "$9,150" },
      { name: "Bybit", value: "$6,050" },
      { name: "Kraken", value: "$3,150" },
      { name: "Coinbase", value: "$2,400" },
      { name: "Others", value: "$490" },
    ],
  },
  alerts: {
    title: "Autotrader Error",
    message: "Insufficient balance for USDT / AVAX",
    type: "Action Needed",
    time: "2 minutes ago",
    cta: "View Autotrader",
  },
  topAutotraders: [
    {
      name: "alexayu",
      pair: "USDT / AVAX",
      runtime: "Running 12d 4h",
      pnl: "+9.2%",
    },
    {
      name: "testing 3",
      pair: "USDT / BTC",
      runtime: "Running 31d 16h",
      pnl: "+7.8%",
    },
    {
      name: "aklayu",
      pair: "USDT / AVAX",
      runtime: "Running 44d 6h",
      pnl: "+5.5%",
    },
  ],
  autotradersSummary: {
    total: "12",
    active: "5",
    stopped: "7",
  },
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

const renderAssetSummary = (data) => {
  setText('[data-field="asset.totalBalance"]', data.totalBalance);
  setText('[data-field="asset.change"]', data.change);
  setText('[data-field="asset.changeLabel"]', data.changeLabel);
};

const renderExchangesSummary = (data) => {
  const list = document.querySelector('[data-list="exchanges"]');
  if (list) {
    list.innerHTML = "";
    data.exchanges.forEach((exchange) => {
      const item = document.createElement("div");
      item.className = "summary-item";
      item.innerHTML = `
        <span class="summary-item-name">${exchange.name}</span>
        <span class="summary-item-value">${exchange.value}</span>
      `;
      list.appendChild(item);
    });
  }
  setText('[data-field="exchanges.total"]', data.total);
};

const renderAlerts = (data) => {
  setText('[data-field="alerts.title"]', data.title);
  setText('[data-field="alerts.message"]', data.message);
  setText('[data-field="alerts.type"]', data.type);
  setText('[data-field="alerts.time"]', data.time);
  setText('[data-field="alerts.cta"]', data.cta);
};

const renderTopAutotraders = (data) => {
  const list = document.querySelector('[data-list="topAutotraders"]');
  if (list) {
    list.innerHTML = "";
    data.forEach((trader) => {
      const card = document.createElement("div");
      card.className = "autotrader-card";
      card.innerHTML = `
        <div class="autotrader-header">
          <span class="autotrader-name">${trader.name}</span>
          <span class="badge badge--positive">${trader.pnl}</span>
        </div>
        <div class="autotrader-meta">
          <span>${trader.pair}</span>
          <span>${trader.runtime}</span>
        </div>
        <div class="autotrader-footer">
          <span class="stat-caption">PnL</span>
          <button class="button" type="button">View Autotrader</button>
        </div>
      `;
      list.appendChild(card);
    });
  }
};

const renderAutotradersSummary = (data) => {
  setText('[data-field="autotraders.total"]', data.total);
  setText('[data-field="autotraders.active"]', data.active);
  setText('[data-field="autotraders.stopped"]', data.stopped);
};

const renderDashboard = () => {
  renderAssetSummary(state.assetSummary);
  renderExchangesSummary(state.exchangesSummary);
  renderAlerts(state.alerts);
  renderTopAutotraders(state.topAutotraders);
  renderAutotradersSummary(state.autotradersSummary);
};

if (appRoot) {
  appRoot.dataset.ready = "true";
  renderDashboard();
}
