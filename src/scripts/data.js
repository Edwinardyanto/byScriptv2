const buildSeries = (points, start, end) => {
  const trend = (end - start) / Math.max(points - 1, 1);
  return Array.from({ length: points }, (_, index) => {
    const base = start + trend * index;
    const variance = Math.sin(index / 3.5) * 140 + Math.sin(index / 11) * 70;
    return Math.round(base + variance);
  });
};

export const dashboardData = {
  assetSummary: {
    totalBalance: "$12,430",
    change: "+3.4%",
    changeLabel: "vs last 7 days",
    chart: {
      activeRange: "7D",
      ranges: {
        "7D": buildSeries(7, 10250, 12430),
        "30D": buildSeries(30, 8200, 12430),
        "90D": buildSeries(90, 6800, 12430),
      },
    },
  },
  exchangesSummary: {
    total: "$21,240",
    exchanges: [
      { name: "Binance", value: "$9,150", amount: 9150 },
      { name: "Bybit", value: "$6,050", amount: 6050 },
      { name: "Kraken", value: "$3,150", amount: 3150 },
      { name: "Coinbase", value: "$2,400", amount: 2400 },
      { name: "Others", value: "$490", amount: 490 },
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

export const fetchDashboardData = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(structuredClone(dashboardData));
    }, 700);
  });
