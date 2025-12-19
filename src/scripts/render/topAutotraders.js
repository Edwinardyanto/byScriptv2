const setListMessage = (list, message) => {
  if (!list) {
    return;
  }
  list.innerHTML = "";
  const item = document.createElement("div");
  item.className = "autotrader-card";
  item.textContent = message;
  list.appendChild(item);
};

export const renderTopAutotraders = (sectionState) => {
  const { data, status } = sectionState;
  const list = document.querySelector('[data-list="topAutotraders"]');

  if (status === "loading") {
    setListMessage(list, "Loading autotraders...");
    return;
  }

  if (status === "error") {
    setListMessage(list, "Unable to load autotraders");
    return;
  }

  if (!data || data.length === 0) {
    setListMessage(list, "No autotraders available");
    return;
  }

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
};
