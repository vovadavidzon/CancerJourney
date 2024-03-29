// Calculate the compression level
export const calculateCompression = (size: number) => {
  if (size > 4000000) {
    // Greater than 5MB
    return 0.2;
  } else if (size > 3000000) {
    // Greater than 3MB
    return 0.3;
  } else if (size > 2000000) {
    // Greater than 2MB
    return 0.5;
  } else if (size > 1000000) {
    // Greater than 1MB
    return 0.7;
  } else {
    return 0.8; // Default compression
  }
};

export const convertDateFormat = (dateInput: Date | string | undefined) => {
  if (dateInput === undefined) return;
  // Ensure dateInput is a Date object
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Convert Date to DD/MM/YYYY format
  const formattedDate = `${("0" + date.getDate()).slice(-2)}/${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}/${date.getFullYear()}`;

  return formattedDate;
};
