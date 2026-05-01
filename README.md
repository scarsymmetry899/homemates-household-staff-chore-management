# Homemaker 🏠

> Your household, simplified.

A full-featured household staff management app built for homeowners who manage domestic staff. Track attendance, assign tasks, monitor expenses, get AI-powered insights, and control everything remotely via Telegram — all from a beautiful mobile-first interface.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Telegram Bot Setup](#telegram-bot-setup)
- [Gemini AI Setup](#gemini-ai-setup)
- [NFC Attendance Tags](#nfc-attendance-tags)
- [Project Structure](#project-structure)
- [Feature Deep-Dive](#feature-deep-dive)
- [Deployment](#deployment)

---

## Overview

Homemaker is a React + TypeScript progressive web app designed to give homeowners complete visibility and control over their household staff. It combines real-time status tracking, AI-powered commands, Telegram bot integration, and NFC-based attendance into a single polished interface.

Built for mobile-first use — the entire UI is optimised for phone screens with native-feel animations, pull-to-refresh, swipe gestures, and haptic-friendly interactions.

---

## Features

### Staff Management
- Add household staff with role, department, salary, shift timings, start date and photo
- Filter staff by department (Hospitality, Security, Grounds, Culinary, Maintenance) or live status (On Duty / Late / Absent)
- View individual staff profiles with editable role, shift timings and Telegram Chat ID
- Swipe-to-remove or use the confirmation delete modal
- Per-staff reliability and punctuality scores

### Attendance & Status
- Live status board: On Duty / Late / Absent / En Route / Off Duty
- Mark attendance via the app, Telegram commands, AI assistant, or NFC tap
- Full attendance history log per staff member
- NFC tag support — physical tags trigger check-in/out automatically (Web NFC API)

### Tasks & Assignments
- Assign tasks to specific staff with optional due dates
- Track completions in real time
- Overdue task actions: extend deadline (+7 days), reassign to another staff member, or delete
- Tasks surface automatically as Live Flags alerts when overdue

### Expense Tracker
- Log expenses by category: Fuel, Groceries, Repairs, Advances, Household
- AI receipt scanner — photograph a receipt and Gemini Vision parses every line item
- Approve or reject scanned items before adding to records
- Edit or delete any existing expense
- Monthly spend totals and category breakdown

### Live Flags & Alerts
- Real-time alert cards for: late check-ins, absences, overdue tasks, expense spikes, security events
- One-tap action buttons per alert (Mark Leave, Apply Penalty, Reassign, Extend Deadline, Investigate, etc.)
- Filter alerts by type: Attendance / Task / Security / Expense
- Swipe to dismiss

### AI Home Assistant (Gemini)
- Powered by Google Gemini 1.5 Flash
- Full multi-turn conversation with live staff + expense context injected
- Natural language commands: "Mark Marcus late", "Add task mop floors for Elena", "Show expenses"
- Quick-action chips for instant guided flows (Mark Late, Mark Absent, Mark Present, Add Task)
- Guided commands ask for staff name → execute action → send Telegram notification
- Regex fallback when Gemini API is not configured

### Telegram Bot
- Full two-way bot integration via polling (no webhook server needed)
- Registered slash commands visible in the Telegram keyboard:

| Command | Description |
|---------|-------------|
| `/status` | Show all staff status |
| `/staff` | List all staff members |
| `/tasks [Name]` | Show pending tasks (all or by staff) |
| `/expenses` | Show expense summary |
| `/checkin Name` | Check in a staff member |
| `/mark_late Name` | Mark staff late |
| `/mark_absent Name` | Mark staff absent |
| `/mark_present Name` | Mark staff present / on duty |
| `/on_duty Name` | Mark staff on duty |
| `/add_task Name \| task` | Add a task for a staff member |
| `/help` | List all commands |

- Natural language also works: "mark Elena absent", "add task polish silver for Marcus"
- Every action sends a reply back to the originating chat
- Owner Chat ID configurable in Settings for push notifications from the app

### Insights & Analytics
- Daily / Weekly / Monthly attendance grid
- Today's column highlighted with a secondary-colour indicator and ring on cells
- Long-press any cell to manually override attendance
- Punctuality score, reliability score and late check-in counters
- **Excel report export** (SheetJS) with 4 sheets: Summary, Staff, Tasks, Expenses — properly formatted with column widths

### First-Time Onboarding
- 9-step animated onboarding tour shown automatically on first login
- Covers every feature with practical tips
- Dot navigation, Back/Next/Skip controls
- Never shown again after completion (localStorage flag)

### Auth & Settings
- Firebase Authentication: Google OAuth (popup → redirect fallback) + Email/Password
- Meaningful error messages for every Firebase auth error code
- Dark mode toggle (persisted)
- Owner name, location and Telegram Chat ID settings
- Per-staff Telegram Chat ID for direct bot messages

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Routing | React Router v6 |
| State | React Context + useState |
| Backend | Firebase (Auth + Firestore + Cloud Functions) |
| AI | Google Gemini 1.5 Flash (chat + vision) |
| Messaging | Telegram Bot API |
| Attendance | Web NFC API + Google Sheets (Apps Script webhook) |
| Export | SheetJS (xlsx) |
| Icons | Lucide React |
| Toasts | Sonner |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/scarsymmetry899/homemates-household-staff-chore-management.git
cd homemates-household-staff-chore-management

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your keys (see Environment Variables section)

# Start development server
npm run dev
```

App will be available at `http://localhost:8080`.

### Other Scripts

```bash
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npm run test         # Run Vitest tests
```

---

## Environment Variables

Create a `.env.local` file in the project root with the following keys:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Telegram Bot
VITE_TELEGRAM_BOT_TOKEN=your_bot_token

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

All three integrations are optional — the app runs in demo mode if keys are not provided.

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) and create a project
2. Enable **Authentication** → Sign-in methods → enable **Google** and **Email/Password**
3. Under **Authentication → Settings → Authorized Domains**, add:
   - `localhost` (for development)
   - Your production domain
4. Create a **Firestore** database (start in test mode for development)
5. Copy your project config keys into `.env.local`

### Cloud Functions (optional)
The `functions/` directory contains Cloud Functions for:
- `sendTelegramMessage` — callable function to proxy Telegram messages server-side
- `telegramWebhook` — HTTP endpoint for webhook mode
- `logNfcAttendance` — callable function to log NFC check-ins to Firestore
- `dailyAttendanceSummary` — scheduled function (9 PM IST) for daily digest

```bash
cd functions
npm install
firebase deploy --only functions
```

---

## Telegram Bot Setup

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts to create your bot
3. Copy the bot token into `VITE_TELEGRAM_BOT_TOKEN` in `.env.local`
4. Start the app — it will automatically register all slash commands with Telegram on first load
5. Go to **Settings** in the app and paste your personal Telegram Chat ID (find it via [@userinfobot](https://t.me/userinfobot))

The bot uses long-polling (no public server required). Commands are processed client-side in the browser.

---

## Gemini AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Add it to `.env.local` as `VITE_GEMINI_API_KEY`

The app uses **Gemini 1.5 Flash** for:
- **Smart Command Box** — multi-turn chat with live staff/expense context injection
- **Receipt Scanner** — vision model reads receipt images and extracts line items

---

## NFC Attendance Tags

> Hardware delivery pending — software is fully implemented and ready.

The app uses the **Web NFC API** (Chrome on Android) to read physical NFC tags for hands-free staff check-in/out.

### How it works
1. Each staff member gets a programmable NFC tag (NTAG213 or similar)
2. The tag is programmed with the staff member's ID
3. When tapped against the device, the app reads the tag, toggles their check-in/out status, logs to Firestore, updates Google Sheets, and sends a Telegram notification

### Programming tags (once delivered)
Navigate to **Settings → NFC Tags** in the app and tap "Program Tag" — follow the on-screen prompts to write the staff ID to the tag.

### Requirements
- Android device with NFC
- Chrome browser (Web NFC is not supported on iOS)
- Tags: NTAG213, NTAG215, or NTAG216

---

## Project Structure

```
src/
├── assets/              # Images (staff photos, logo)
├── components/
│   ├── animations/      # Framer Motion wrappers (PullToRefresh, SwipeableCard, etc.)
│   ├── layout/          # AppLayout, BottomNav, SmartCommandBox
│   ├── ui/              # shadcn/ui primitives
│   └── OnboardingTour.tsx
├── context/
│   └── AppContext.tsx   # Global state (staff, expenses, alerts, actions)
├── data/
│   └── staff.ts         # StaffMember type + seed data
├── hooks/
│   ├── useTelegramPolling.ts  # Telegram bot polling + command handling
│   └── useNfcAttendance.ts    # Web NFC API hook
├── lib/
│   ├── firebase.ts      # Auth, Firestore, Google OAuth
│   ├── gemini.ts        # Gemini chat + receipt vision
│   └── telegram.ts      # Telegram Bot API wrapper
├── pages/
│   ├── Index.tsx        # Home dashboard
│   ├── StaffDirectory.tsx
│   ├── StaffProfile.tsx
│   ├── TasksPage.tsx
│   ├── ExpensesPage.tsx
│   ├── AlertsPage.tsx
│   ├── InsightsPage.tsx
│   ├── PayrollPage.tsx
│   ├── SettingsPage.tsx
│   └── AuthPage.tsx
├── App.tsx
└── main.tsx

functions/
└── src/
    └── index.ts         # Firebase Cloud Functions
```

---

## Feature Deep-Dive

### Smart Command Box
The floating ✨ sparkle button opens the AI assistant. It operates in two modes:

**Gemini mode** (when API key is set): Full natural language understanding with live context injection. Gemini sees all staff names, statuses, tasks, and recent expenses before answering. Action blocks (`<action>{...}</action>`) in responses are parsed and executed automatically.

**Regex fallback**: When Gemini is not configured, a pattern-matching engine handles common queries and commands.

**Guided commands**: Tapping "Mark late", "Mark absent", or "Mark present" chips starts a guided flow — the assistant asks for the staff member's name, executes the action, and sends a Telegram notification to the owner.

### Attendance Grid (Insights)
The grid shows coloured cells per staff member per day:
- 🟢 **Green** — Present
- 🟡 **Amber** — Late
- 🔴 **Red** — Absent
- ⚫ **Grey** — Off duty

Today's column is always highlighted with a secondary-colour header dot and a ring around each cell. Long-press any cell to manually override its status.

### Receipt Scanner
1. Tap **Scan Receipt** in the Expenses tab
2. Upload or photograph a receipt
3. Gemini Vision reads the image and returns a structured list of line items with categories and amounts
4. Review each item — approve ✅ or reject ❌
5. Tap **Add Approved** to log all approved items as expenses

### Excel Export
The **Export Excel Report** button in Insights downloads a `.xlsx` file with:
- **Summary** sheet — staff counts, expense totals by category, active alerts
- **Staff** sheet — name, role, department, status, shift, punctuality %, reliability %
- **Tasks** sheet — all assignments with completion status
- **Expenses** sheet — full ledger with date, category, amount, description

---

## Deployment

### Vercel / Netlify
```bash
npm run build
# Deploy the dist/ folder
```

Set all `VITE_*` environment variables in your hosting provider's dashboard.

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Important: Authorized Domains
After deploying to a custom domain, add it to **Firebase Console → Authentication → Settings → Authorized Domains** so Google sign-in continues to work.

---

## Re-triggering the Onboarding Tour

To show the onboarding tour again (e.g. for a new user on a shared device):

```javascript
// Run in browser console
localStorage.removeItem("homemaker_onboarding_done");
location.reload();
```

---

## Phase 2 Roadmap — NFC Expansion

The Phase 1 NFC work delivers shift-aware attendance: tap-in, tap-out, late/early-leave detection, score auto-updates, full-screen confirmation overlay, app-wide global scanning, midnight auto-checkout, and a Test Mode panel for tag-free simulation. Once the basic attendance flow has been in real-world use for a few weeks and the kinks are out, the following ideas are queued for Phase 2.

### Tier 1 — High value, recommended

**Task Completion Tags.** Stick small NFC stickers on the physical objects tied to recurring tasks: the kitchen counter for "Counter Cleaned," the vacuum for "Living Room Vacuumed," the bin for "Trash Out." A staff member taps their personal tag, then the task tag — the app marks the assignment complete with a timestamp and a location proof (the task tag's name). This solves the "did Sienna actually clean the kitchen, or just tick the box?" trust gap, because completing the task physically requires being at that spot. Build complexity is medium: new "Task Location Tag" data model, new programming flow that distinguishes task tags from staff tags, scan handler that recognises both and pairs them within a 30-second window. Most of the existing infrastructure is reusable.

**Room/Zone Presence Tags.** One tag per major room — kitchen, gym, garage, study, garden shed. Staff tap their personal tag against the room's tag when entering a zone for work. The app updates their `location` field in real time, so the home dashboard can show "Marcus is in the garage right now" instead of just "Marcus is on duty somewhere." Useful for figuring out who's nearest when a delivery arrives, knowing who was in a room when something went missing, and time-on-task reports ("Sienna spent 3.5 hours in the kitchen today, 1.5 in the pantry"). Build complexity is low — the `location` field already exists in `StaffMember`; this is a new "Zone Tag" type and a small extension to the scan handler.

### Tier 2 — Useful but conditional

**Vendor / Delivery Tap-In.** A single "Vendor Sign-In" tag at the main gate. When a milk delivery, courier, plumber, etc. arrives, the gatekeeper (Arthur, in the current setup) taps the vendor tag, then a small visitor-type tag ("Milkman," "Amazon," "Plumber"). The app logs vendor entries with timestamps without needing them to be permanent staff. Useful for a paper trail of who came to the house and when. Build complexity is medium: new "vendor visitor" mini-data-model, new scan path. Worth it only if vendor logging becomes a felt need.

**Vehicle Log for the Chauffeur.** Tags on the steering wheel of each vehicle. Marcus taps his own tag, then the vehicle tag at the start of a trip and again at the end. The app logs trips automatically — start/end times, which car was used, total kilometres driven that day. Especially useful for fuel reimbursement and for separating work vs personal vehicle usage. Build complexity is medium-high: new trip data model, vehicle entity, mileage estimation. Worth it only if vehicle/fuel tracking becomes a felt need.

### Tier 3 — Considered and de-prioritised

**Inventory / supplies tags.** Sounds great in theory ("tap the detergent shelf when refilled"), but household supplies don't refill at predictable cadences and the proliferation of tags would outweigh the value. App-based reminders work better.

**Expense receipt linking.** A "tap to attach this expense to..." flow doesn't save real time vs just typing in the app. The data entry is the bottleneck, not the linking.

**Payroll signoff.** Payroll review requires actually looking at numbers. NFC adds nothing.

**Emergency / panic tag.** Romantic idea — staff in trouble taps SOS, alert fires — but in practice, by the time someone is in trouble enough to need an SOS, an actual phone or wall button is more reliable. Skip.

### Open questions to resolve before building

- For task completion: should the flow be two-tap (staff tag + task tag), auto-pick staff from the last NFC scan within 60 seconds, or tap-task-tag-then-pick-staff-from-screen?
- Should task tags only complete tasks assigned to the tapping staff, or any task that exists at that location?
- Where should physical tags live in the home — carried by staff (lanyards, ID badges) or fixed on a "punch card board" near the entrance? Each has trade-offs around theft, loss, and convenience.

---

*Built with React, Firebase, Gemini AI, and a lot of ☕*
