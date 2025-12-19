const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

export const renderAlerts = (sectionState) => {
  const { data, status } = sectionState;

  if (status === "loading") {
    setText('[data-field="alerts.title"]', "Loading alerts...");
    setText('[data-field="alerts.message"]', "");
    setText('[data-field="alerts.type"]', "");
    setText('[data-field="alerts.time"]', "");
    setText('[data-field="alerts.cta"]', "");
    return;
  }

  if (status === "error") {
    setText('[data-field="alerts.title"]', "Unable to load alerts");
    setText('[data-field="alerts.message"]', "");
    setText('[data-field="alerts.type"]', "");
    setText('[data-field="alerts.time"]', "");
    setText('[data-field="alerts.cta"]', "");
    return;
  }

  if (!data) {
    setText('[data-field="alerts.title"]', "No alerts");
    setText('[data-field="alerts.message"]', "");
    setText('[data-field="alerts.type"]', "");
    setText('[data-field="alerts.time"]', "");
    setText('[data-field="alerts.cta"]', "");
    return;
  }

  setText('[data-field="alerts.title"]', data.title);
  setText('[data-field="alerts.message"]', data.message);
  setText('[data-field="alerts.type"]', data.type);
  setText('[data-field="alerts.time"]', data.time);
  setText('[data-field="alerts.cta"]', data.cta);
};
