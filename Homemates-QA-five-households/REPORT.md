# Homemates live operations audit

**8 November 2026 · homemates.vercel.app · Firebase Auth and Firebase SQL Connect / Postgres**

**Release assessment.** Owners can create a household, add staff and record everyday transactions. Staff photos, cross-device updates, purchase traceability and attendance-based pay failed operational checks. A household that relies on the app to reconcile purchases or calculate salary would encounter material discrepancies.

## Five working days

I created five independent owner accounts and households in sequence. Each owner added one staff member during onboarding and another from the directory, supplied the second person's photo through the live profile form, assigned a task, logged an expense, added stock and checked payroll. All five returned to their own dashboard after reload. Three also reopened their household through an independent browser sign-in. The tests used fictional people, pictures bundled with the app and simulated purchases.

| Household and first viewport | Staff and assigned duty | Manual expense and stock entered | Monthly payroll shown |
|---|---|---|---:|
| Cedar Kitchen · 390 px | Mira, Cook + Cleaner. Noor, kitchen helper, prepared breakfast. | Fresh vegetables ₹185. Tomatoes 4 kg. | ₹22,000 |
| Maple Garden · 1280 px | Ravi, gardener. Isha, plant caretaker, watered balcony herbs. | Potting soil ₹320. Compost 4 bags. A separate ₹65 seedling tray request brought the ledger to ₹385. | ₹23,000 |
| Harbor Commute · 390 px | Anil, housekeeper. Dev, chauffeur, checked tyres before school pickup. | Fuel ₹900. Washer fluid 4 litres. | ₹24,000 |
| Willow Nursery · 1280 px | Leela, housekeeper. Sara, baby caretaker, prepared a feeding kit. | Baby supplies ₹245. Baby wipes 4 packs. | ₹25,000 |
| Birch Pets · 390 px | Ria, dog walker. Omar, pet caretaker, refilled water after the evening walk. | Pet supplies ₹410. Dog food 4 kg. | ₹26,000 |

These are independently verified expense and stock entries. The manual inventory action was separate from logging the expense.

## Findings and reproducible checks

| Priority | What I did and observed | Fix and release check |
|---|---|---|
| High · staff photos | Uploaded five different JPEGs. Every second staff record stored a browser-local `blob:` URL. An independent browser attempted to decode each exact saved address. All five produced zero pixels. A profile image element had been detectable on reload in the first session, so that check alone would have passed. | Upload the file to durable household-scoped storage. Save its object reference after upload. Open the same profile from a second signed-in phone and verify that the image decodes. See `src/pages/StaffProfile.tsx`, `handlePhotoChange`. |
| High · task feedback and syncing | Cedar and Harbor completed immediately and survived reload. In Maple and Willow the completion control did not appear within 16 seconds of assignment, although the assignments reached SQL. Both completed from a fresh sign-in. In Birch, the completion control received the click but no completed state appeared within 16 seconds. SQL and a fresh login later confirmed completion. All five final records had a matching assignee and completion timestamp. In Willow, a second open account session still showed pending after 32 seconds and showed completed after reload. | Reconcile writes by the server-issued task ID and notify open clients of committed changes. Retest an immediate assignment/completion on one phone while a second phone is already on Tasks. Confirm one completion on both without reloading. |
| High · absence and payroll | In Birch, I changed Omar's daily mark from present to absent, saved and reloaded. The downloaded November payroll workbook still showed ₹12,000 base, ₹0 deductions and ₹12,000 net. The attendance editor itself says pay and live check-in are managed separately. Across all five households the displayed total included both staff, while SQL initially had a payroll profile and draft run only for the staff member added during onboarding. | Create payroll records consistently for directory hires. Apply the household's deduction policy to approved absences and reversals, with one adjustment per staff member and date. Reconcile the stored run, payslip and export. |
| High · purchase traceability | In staff preview, Isha requested ₹65. The owner approved and marked it purchased. The request and expense survived reload and the ledger rose from ₹320 to ₹385. SQL recorded the approval amount and purchase time, but both the linked expense and inventory item were null. No seedling tray appeared in inventory. | Post the expense, request link and any applicable inventory movement together. Ask for quantity and unit for stocked items. Retry posting the same request and confirm a single expense and movement. See `src/pages/ExpensesPage.tsx`, `convertRequestToExpense`. |
| Medium · language persistence | In Willow, I selected each language, reloaded and opened Tasks. Telugu, Malayalam and English showed their matching heading and document language. Hindi switched to Hindi initially and reopened in English. Selecting Kannada left the screen in Telugu in that run. Maple also produced inconsistent results. | Acknowledge the saved preference and prevent older account state from overriding it on startup. Retest every language after reload and on a second sign-in. Translation coverage of every string remains unverified. |
| Medium · expense category | I entered all five baseline purchases without changing the preselected category. All five were stored as Fuel, including vegetables, baby supplies, potting soil and pet supplies. The totals remained correct. | Require a deliberate category choice or use an explicit uncategorized value. Check category reports against the ledger. |

## Other observed behavior

- The browser opened the deployed directory and staff form. Isolated Chromium sessions then exercised production Firebase sign-up, onboarding and the live forms at desktop and phone viewport widths. The SQL check queried the QA households directly. A reload alone would have missed several discrepancies.
- The Insights daily mark could be saved and read again in all five households. Maple's first pointer attempt did not open a usable editor. The keyboard retry succeeded, and SQL recorded **Late**. A simulated long press opened **Present**, **Late**, **Absent** and **Off-Duty** on Willow's touch viewport.
- Gemini correctly answered a question about a known Maple Garden expense with **INR 320 on potting soil**. This establishes one grounded answer.
- Receipt scanning correctly extracted **Dog biscuits ₹80** and **Pet soap ₹40** from a synthetic receipt. I approved the biscuits and rejected the soap. Birch Pets' November ledger reopened at **₹490**, exactly ₹80 above its starting total. The receipt review's check and cross buttons need accessible names that identify the line.
- Settings displayed the unsupported-reader guidance in desktop Chromium and the owner Telegram setup control. No physical sticker was programmed and no Telegram message was sent.
- The staff cash request ran through the owner's explicitly labeled staff preview. Independent staff authentication, backend enforcement of staff access, and cross-household denial still need a separate staff-account acceptance test.
- Physical NFC read/write, duplicate physical taps, Telegram recipient delivery, live camera footage, real payments and Google OAuth remain unverified. A desktop browser with a touch viewport cannot establish physical phone or tag behavior. Telegram delivery needs a QA recipient that can confirm receipt.

## Evidence

The bundle includes the ten original profile and Today screenshots, paired by household in the table order, along with browser observations and targeted backend readbacks. The standalone JSON files preserve first attempts and follow-up observations. For photo and language results, use the independent image decode and the recorded document language respectively. Merely finding an image element or finishing a language-selection loop is insufficient evidence of success.

Only the isolated QA households received operational data. No production code was changed or deployed during this audit.
