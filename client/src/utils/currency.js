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

// Grafik o'qlari (axis) kabi tor joylar uchun qisqartirilgan format.
// Masalan: 1 500 000 -> "1.5 mln so'm", 250 000 -> "250 ming so'm"
export const formatCompactCurrency = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "0";

  const abs = Math.abs(number);
  const sign = number < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    return `${sign}${trimDecimal(abs / 1_000_000_000)} mlrd so'm`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${trimDecimal(abs / 1_000_000)} mln so'm`;
  }
  if (abs >= 1_000) {
    return `${sign}${trimDecimal(abs / 1_000)} ming so'm`;
  }
  return `${sign}${abs} so'm`;
};

// 1.50 -> "1.5", 2.00 -> "2"
const trimDecimal = (num) => {
  return num.toFixed(1).replace(/\.0$/, "");
};
