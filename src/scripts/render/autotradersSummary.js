const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

export const renderAutotradersSummary = (sectionState) => {
  const { data, status } = sectionState;

  if (status === "loading") {
    setText('[data-field="autotraders.total"]', "--");
    setText('[data-field="autotraders.active"]', "--");
    setText('[data-field="autotraders.stopped"]', "--");
    return;
  }

  if (status === "error") {
    setText('[data-field="autotraders.total"]', "--");
    setText('[data-field="autotraders.active"]', "--");
    setText('[data-field="autotraders.stopped"]', "--");
    return;
  }

  if (!data) {
    setText('[data-field="autotraders.total"]', "--");
    setText('[data-field="autotraders.active"]', "--");
    setText('[data-field="autotraders.stopped"]', "--");
    return;
  }

  setText('[data-field="autotraders.total"]', data.total);
  setText('[data-field="autotraders.active"]', data.active);
  setText('[data-field="autotraders.stopped"]', data.stopped);
};
