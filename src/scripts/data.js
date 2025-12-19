export const dashboardData = {
  assetSummary: {
    totalBalance: "$12,430",
    change: "+3.4%",
    changeLabel: "vs last 7 days",
    chart: {
      activeRange: "7D",
      ranges: {
        "1D": [11800, 11950, 12120, 12040, 12180, 12310, 12430],
        "7D": [10250, 10890, 10640, 11220, 11550, 11880, 12430],
        "30D": [8200, 8700, 9100, 9800, 10400, 11150, 12000, 12430],
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
