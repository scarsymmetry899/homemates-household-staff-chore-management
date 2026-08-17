# Homemates Project Roadmap

This document tracks the current build status, what still needs to be wired, and the phase-wise plan for moving Homemates from a polished demo into a production household operations system.

## Live Project

- Production app: <https://homemates.vercel.app>
- GitHub repository: <https://github.com/scarsymmetry899/homemates-household-staff-chore-management>
- Frontend: React, TypeScript, Vite, Tailwind, shadcn/ui
- Auth: Firebase Authentication
- Primary data direction: Firebase SQL Connect with Cloud SQL Postgres
- Deployment: Vercel production deployment linked to the GitHub project

## What Is Working Now

- Firebase Auth sign-in gate is active for the deployed app.
- Per-account fresh household onboarding exists.
- Onboarding can create household, owner profile, homemates, rooms, staff, payroll base, inventory, and staff task assignments.
- Staff can have combined responsibilities such as Cook + Cleaner + Nanny.
- The app has backend foundations for staff, tasks, expenses, payroll, attendance, NFC, cash requests, inventory, alerts, AI logs, and CCTV scaffolding.
- Gemini and Telegram production secrets are configured in Vercel.
- Server-side Vercel API routes exist for Gemini and Telegram.
- Staff avatar fallback is fixed for profiles without uploaded photos.
- Attendance grid no longer invents fake historical red/orange data before real attendance exists.
- Language preference foundation exists for English, Hindi, Telugu, Kannada, and Malayalam.
- Core shell, Home, Tasks, and Settings are partially wired into the central i18n layer.
- Production build and test suite are passing.

## Still To Wire

- Full owner vs staff gated views.
- Staff-only app mode showing only the staff member's daily tasks, attendance, payments, and request flows.
- Full app-wide translations for Staff, Expenses, Payroll, Insights, Alerts, onboarding, toast messages, forms, and AI chat.
- Staff cash request UI and owner approval workflow.
- Expense request to purchase to bill upload to monthly expense linking.
- Attendance discrepancy request flow.
- Automatic payroll deductions from absence and late rules.
- Realtime refresh/subscription patterns across all SQL-backed mutations.
- NFC tag management UI for room-wise, task-wise, and staff attendance tags.
- Gemini assistant server-side grounded data querying.
- CCTV owner module UI and real camera integration.
- Production-grade audit logs, permissions, and backend documentation.

## Phase 1: Make The Current App Trustworthy

Goal: remove demo assumptions and make the current app dependable for real household setup and daily use.

- Finish owner/staff role gating.
- Complete staff mobile mode entry points.
- Remove remaining seeded/demo data assumptions.
- Polish onboarding with progress saving, photos, richer staff templates, and language selection.
- Wire all visible app actions to Firebase SQL Connect/Postgres.
- Complete app-wide language support.
- Make attendance, payroll, expenses, tasks, and inventory consistent and auditable.
- Add clear empty states for fresh accounts.

## Phase 2: Make It Operational

Goal: support the real workflows of staff, owners, household purchases, attendance, and NFC.

- Staff daily mode: tasks, check-in status, payment view, attendance history, requests.
- Cash request workflow: request, owner approval, amount given, purchase, receipt, expense linking.
- Grocery/fuel/supplies tracking by category, staff member, item, date, and household ledger.
- NFC setup flow: write tag, assign tag, test tap, link to staff, room, task, attendance station, or inventory station.
- Realtime sync for task completion, attendance, expenses, payroll, inventory, alerts, and NFC taps.
- Telegram notifications for owner/staff operational events.
- Gemini assistant grounded only in the signed-in user's household data.

## Phase 3: Make It Advanced And Enterprise-Ready

Goal: make Homemates a complete household operations platform.

- CCTV monitoring dashboard with room-wise camera views.
- Camera health reporting when a stream stops working.
- Advanced analytics for reliability, punctuality, payroll trends, task trends, and category expenses.
- Multi-household support.
- Staff documents: ID proof, police verification, contracts, medical documents, emergency contacts.
- Visitor, package, vendor, vehicle, pet, and appliance modules.
- Owner audit trails and permission logs.
- AI-generated monthly household reports and operational recommendations.

## UI/UX Improvements

- Make onboarding feel like a guided setup wizard rather than a form dump.
- Add staff photo upload during onboarding and staff creation.
- Clean task card button placement and long-role truncation everywhere.
- Separate Owner Mode and Staff Mode visually.
- Add language selection during first onboarding.
- Add better empty states for new households.
- Improve mobile spacing for long Indian names, combined roles, and regional-language text.
- Add focused "Today only" task and attendance views.
- Add request and approval screens for cash, expenses, attendance disputes, and purchase bills.
- Make NFC setup visual: Write Tag, Assign Location, Test Tap, Activate.

## Backend Improvements

- Make Postgres the source of truth for production household data.
- Keep Firestore only for lightweight compatibility/preferences unless a specific realtime use case needs it.
- Add explicit tables for attendance corrections, cash approvals, receipts, staff documents, audit logs, and permission grants.
- Add payroll rules as configurable backend data instead of hard-coded deduction logic.
- Add role and permission model: owner, homemate, staff, manager.
- Move Gemini grounding to server-side endpoints that query household-scoped data.
- Add backend validation and authorization checks for every mutation.
- Add receipt/file storage strategy through Firebase Storage or Vercel Blob.

## Sync Strategy

- Every operational action should write once to Postgres and refresh all dependent UI from the backend.
- Tasks, attendance, expenses, payroll, alerts, inventory, and NFC taps should not rely on isolated local state.
- Payroll should derive from attendance and approved deduction rules.
- Punctuality and reliability should derive from attendance/task history.
- Staff status should derive from the latest attendance event and shift rules.
- Add sync status and retry/error recovery in the UI.
- Use optimistic updates only for low-risk interactions, with server echo remaining authoritative.
- Add audit logs for all owner/staff/AI-triggered mutations.

