export const CURRENCY = "UZS";

export const formatCurrency = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "0";
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};
