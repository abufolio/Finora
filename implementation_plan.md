# Premium UI/UX va Frontend Rejasi

Bu bosqichda Finora shunchaki ishlaydigan dastur emas, balki "WOW" effektiga ega, vizual jozibador va ishlatishga qulay bo'lgan "Premium" ilovaga aylanadi. Men dunyodagi eng zo'r Senior Frontend dasturchi sifatida bunga yondashaman! 😎

## ⚠️ User Review Required
> [!IMPORTANT]
> - Ilovaga zamonaviy ikonkalarni qo'shish uchun `lucide-react` va yumshoq animatsiyalar yaratish uchun `framer-motion` o'rnatiladi.
> - `client/src/components/` ichidagi barcha keraksiz/bo'sh qolib ketgan (`ChartSection.jsx`, `StatCard.jsx`, `ExpenseForm.jsx` va hokazo) fayllar toza loyiha arxitekturasi uchun o'chirib tashlanadi.

## 📝 Proposed Changes

### 1. Premium Dizayn va Animatsiyalar (Framer Motion)
**Maqsad:** Sayt zerikarli bo'lmasligi, oynalar ochilganda yumshoq o'tishlar (smooth transitions) va Glassmorphism detallari qo'shilishi kerak.
#### [NEW] `npm install framer-motion lucide-react`
#### [MODIFY] Barcha sahifalar (`Dashboard.jsx`, `Transactions.jsx`, `Budgets.jsx`, `Reports.jsx`, `Profile.jsx`)
- Sahifalar yuklanganda ekranga sekin kirib kelishi uchun `framer-motion` qobig'i (`<motion.div>`) ga o'raladi.
- Karta va tugmalarga `hover` effektlari, yumshoq soyalar (`shadow-md`, `shadow-xl`) va gradientlar (masalan: `bg-gradient-to-r from-sky-500 to-indigo-500`) qo'shiladi.

### 2. Dashboard.jsx ni Boyitish
**Maqsad:** Asosiy sahifada nafaqat raqamlar, balki chiroyli vizual ham bo'lishi kerak.
#### [MODIFY] `client/src/pages/Dashboard.jsx`
- Oylik daromad va xarajatni solishtiruvchi kichik o'lchamdagi **Bar Chart** yoki **Area Chart** qo'shiladi. (Buning uchun API allaqachon bizga ma'lumotlarni bermoqda).

### 3. Transaksiyalar UX (User Experience)
**Maqsad:** Foydalanuvchilar toifalarni qo'lda xato yozib qo'ymasligini oldini olish.
#### [MODIFY] `client/src/pages/Transactions.jsx`
- `Category` (Toifa) qismi ochiq text `input` o'rniga zamonaviy tayyor ro'yxat (`select`/dropdown) ga o'zgartiriladi.
- Masalan:
  - *Income:* Salary, Bonus, Investment, Other
  - *Expense:* Food, Transport, Housing, Utilities, Health, Entertainment, Other

### 4. Keraksiz Kodlarni Tozalash (Code Cleanup)
**Maqsad:** Loyihani toza va oson tushuniladigan holda saqlash.
#### [DELETE] Bo'sh placeholder komponentlar:
- `client/src/components/ChartSection.jsx`
- `client/src/components/ExpenseForm.jsx`
- `client/src/components/IncomeForm.jsx`
- `client/src/components/StatCard.jsx`
- `client/src/components/TransactionCard.jsx`
Bu fayllarning ishlari allaqachon asosiy sahifalarning o'zida yozilib ketilgan. Ular loyihada keraksiz "chisqindi" bo'lib yotibdi.

## 🧪 Verification Plan
- Yengi pakejlar o'rnatilgandan so'ng, UI ning vizual holati tekshiriladi.
- Sahifalar o'zgarayotganda animatsiyalar silliq (lag-free) ekanligi ko'zdan kechiriladi.
- Transaksiya qo'shishda tayyor kategoriyalar to'g'ri ishlayotgani va bazaga to'g'ri yozilayotgani sinovdan o'tkaziladi.
