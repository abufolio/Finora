export const CURRENCY = "UZS";

const formatter = new Intl.NumberFormat("uz-UZ", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return formatter.format(0);
  return formatter.format(number);
};
