export const getApiErrorMessage = (error) =>
  error?.data?.message ||
  error?.data?.title ||
  (error?.data?.errors
    ? Object.values(error.data.errors).flat().join(" ")
    : "") ||
  error?.error ||
  "Request failed";
