// Oldindan belgilangan kategoriyalar ro'yxati.
// Input hali ham erkin matn (freetext) bo'lib qoladi — <datalist> orqali
// taklif beriladi, shunda foydalanuvchi bir xil kategoriyani turlicha
// yozib qo'ymaydi (masalan "food" / "Food" / "FOOD"), lekin xohlasa
// o'zi yangi kategoriya nomi kiritishi ham mumkin.

export const EXPENSE_CATEGORIES = [
  "Oziq-ovqat",
  "Transport",
  "Kommunal to'lovlar",
  "Kiyim-kechak",
  "Sog'liqni saqlash",
  "Ta'lim",
  "Ko'ngilochar",
  "Aloqa va internet",
  "Boshqa",
];

export const INCOME_CATEGORIES = [
  "Maosh",
  "Frilans",
  "Sovg'a",
  "Investitsiya",
  "Boshqa",
];

export const getCategoriesByType = (type) =>
  type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

// Filter kabi joylarda, type aniq bo'lmaganda ikkala ro'yxatni
// birlashtirib (dublikatsiz) ko'rsatish uchun.
export const ALL_CATEGORIES = Array.from(
  new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
);
