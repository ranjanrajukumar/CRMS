const pickFirstValue = (item, keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") {
      return item[key];
    }
  }

  return undefined;
};

const getDashboardItems = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const possibleArrays = [
    payload?.data?.portfolioDisplayDashboardModels,
    payload?.data,
    payload?.result,
    payload?.results,
    payload?.dashboard,
    payload?.dashboardData,
    payload?.response,
    payload?.items,
  ];

  const arrayValue = possibleArrays.find(Array.isArray);

  if (arrayValue) {
    return arrayValue;
  }

  if (payload && typeof payload === "object") {
    return Object.entries(payload)
      .filter(([, value]) => typeof value === "number" || typeof value === "string")
      .map(([label, value]) => ({ label, value }));
  }

  return [];
};

export const normalizeDashboardCards = (payload) => {
  return getDashboardItems(payload).map((item, index) => {
    if (typeof item !== "object" || item === null) {
      return {
        id: `${index}-${item}`,
        label: `Item ${index + 1}`,
        value: item,
      };
    }

    const label =
      pickFirstValue(item, [
        "label",
        "title",
        "name",
        "portfolioName",
        "portfolio",
        "product",
        "client",
        "clientName",
        "bankName",
        "userName",
      ]) || `Item ${index + 1}`;

    const value =
      pickFirstValue(item, [
        "value",
        "portfolioTotalCount",
        "count",
        "total",
        "totalCount",
        "caseCount",
        "noOfCases",
        "noOfAccounts",
        "accountCount",
      ]) ?? 0;

    return {
      id: item.id || item.portfolioId || item.clientId || `${label}-${index}`,
      label,
      value,
    };
  });
};
