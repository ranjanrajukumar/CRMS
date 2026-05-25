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

const normalizeFollowupItem = (item, index, followupType) => {
  const followupTypeKey = followupType.toLowerCase();
  const accountNumber =
    item.accounT_NUMBER || item.accountNumber || item.accountNo || "-";

  return {
    id:
      `${followupTypeKey}-${item.id || accountNumber || item.banK_NAME || "followup"}-${index}`,
    bankName: item.banK_NAME || item.bankName || item.bank || "-",
    accountNumber,
    followupDate:
      item.followupDt ||
      item.followupDatetime ||
      item.followup_time ||
      item.createdDate ||
      "",
    followupType,
    followupTypeKey,
  };
};

export const normalizeTodayFollowups = (payload) => {
  const todayFollowups = Array.isArray(payload?.data?.todayFollowups)
    ? payload.data.todayFollowups
    : [];
  const tomorrowFollowups = Array.isArray(payload?.data?.tomorrowFollowups)
    ? payload.data.tomorrowFollowups
    : [];

  return {
    todayFollowups: todayFollowups.map((item, index) =>
      normalizeFollowupItem(item, index, "Today")
    ),
    tomorrowFollowups: tomorrowFollowups.map((item, index) =>
      normalizeFollowupItem(item, index, "Tomorrow")
    ),
  };
};

export const normalizeDashboardUsers = (payload) => {
  const users =
    (Array.isArray(payload?.data) && payload.data) ||
    (Array.isArray(payload?.data?.users) && payload.data.users) ||
    (Array.isArray(payload?.data?.userList) && payload.data.userList) ||
    (Array.isArray(payload?.data?.dashboardUsers) && payload.data.dashboardUsers) ||
    (Array.isArray(payload?.result) && payload.result) ||
    [];

  return users.map((item, index) => {
    const name =
      item.fullName ||
      item.name ||
      item.userName ||
      item.username ||
      item.agentName ||
      `User ${index + 1}`;
    const status = item.status || item.userStatus || item.loginStatus || "Active";

    return {
      id: item.id || item.userId || item.agentId || item.userName || index,
      name,
      email: item.email || item.emailId || item.mail || "-",
      role: item.userRole || item.role || item.mapto || "Agent",
      portfolio: item.product || item.portfolio || item.portfolioName || "-",
      teamLead: item.teamLead || item.tl || item.manager || item.mapto || "-",
      status,
      initials: String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
    };
  });
};

const portfolioCountCards = [
  { key: "total_accounts", label: "TOTAL ACCOUNTS" },
  { key: "pending_works", label: "UNTOUCH ACCOUNT" },
  { key: "worked", label: "TOUCHED ACCOUNT" },
  { key: "paid", label: "PAID ACCOUNTS" },
  { key: "nip", label: "UNDER NEGOTIATION" },
  { key: "followup", label: "FOLLOW UP ACCOUNTS" },
  { key: "direct", label: "DIRECT CUSTOMERS" },
  { key: "noncontactable", label: "NON CONTACTABLE" },
  { key: "ptp", label: "PROMISED TO PAY" },
  { key: "broken_promise", label: "BROKEN PROMISE" },
  { key: "avoiding", label: "AVOIDING ACCOUNTS" },
  { key: "fv_done", label: "FIELD VISIT DONE" },
  { key: "todaysWorked", label: "TODAY WORKED" },
  { key: "todaysUpdates", label: "TODAY UPDATES" },
  { key: "settlement", label: "SETTLEMENT" },
  { key: "skipinSkipINCountry", label: "IN COUNTRY" },
  { key: "skipoutSkipOutofCountry", label: "OUT COUNTRY" },
  { key: "thirdParty", label: "THIRD PARTY" },
  { key: "contactable", label: "CONTACTABLE" },
];

export const normalizePortfolioCountDashboard = (payload) => {
  const data = payload?.data && typeof payload.data === "object" ? payload.data : {};

  return portfolioCountCards.map((card) => ({
    ...card,
    value: data?.[card.key] ?? 0,
  }));
};
