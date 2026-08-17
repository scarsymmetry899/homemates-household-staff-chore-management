# Homemaker Production Migration Blueprint

This app is currently a polished demo with local React state and a few optional integrations. To turn it into a real household operations system, we should migrate by capability layer instead of trying to wire every feature at once.

## Current State

- UI is production-styled, but core data lives in [`src/context/AppContext.tsx`](C:\Users\abhit\OneDrive\Documents\ChatGPT\homemaker-ai\src\context\AppContext.tsx) as seeded arrays and `useState`.
- Auth is partially real through Firebase in [`src/lib/firebase.ts`](C:\Users\abhit\OneDrive\Documents\ChatGPT\homemaker-ai\src\lib\firebase.ts).
- AI chat exists, but its context is injected directly from client state in [`src/lib/gemini.ts`](C:\Users\abhit\OneDrive\Documents\ChatGPT\homemaker-ai\src\lib\gemini.ts), so it cannot guarantee factual answers once the app becomes multi-user and server-backed.
- Cloud Functions exist, but only for side tasks like Telegram and NFC logging in [`functions/src/index.ts`](C:\Users\abhit\OneDrive\Documents\ChatGPT\homemaker-ai\functions\src\index.ts).

## Selected Target Architecture

We will stay in the Firebase ecosystem, but use the right Firebase product for each job:

- `Firebase Auth` remains the source of identity for Google and email/password sign-ins.
- `Firebase SQL Connect` provides the production Postgres layer backed by Cloud SQL.
- `SQL Connect realtime queries` power dashboards, live flags, attendance, and task updates.
- `Cloud Functions` handle privileged server workflows such as Telegram, NFC validation, scheduled jobs, and AI orchestration.
- `Gemini` powers the assistant, but only from server-grounded household data and validated tools.
- `Firestore` is allowed as a temporary bridge for the existing demo UI state while the screens migrate to SQL Connect.

## Why Postgres Changes The Shape Of The App

The current `AppContext` bundles UI state and business state together. For production, we should separate:

- `domain data`: fetched from backend and subscribed in real time
- `mutations`: API calls with validation, auth, and audit logging
- `derived UI state`: filters, temporary forms, drawers, pending actions

That means `AppContext` should gradually become a thin orchestration layer or disappear in favor of query hooks plus backend mutations.

## Phase 1: Replace Demo State With Real Data

Goal: preserve the existing UI while swapping out the fake state layer.

### Data domains to create first

- households
- owner_profiles
- homemates
- staff_members
- staff_roles
- shift_templates
- attendance_events
- task_templates
- task_instances
- payroll_profiles
- payroll_runs
- expense_entries
- inventory_items
- inventory_movements
- alerts
- nfc_tags
- nfc_locations
- ai_conversations
- ai_messages
- ai_action_logs

### SQL Connect operations to create first

- `UpsertCurrentUser`
- `CreateHousehold`
- `MyHouseholds`
- `AddStaffMember`
- `AddTaskInstance`
- `CompleteTaskInstance`
- `RecordAttendanceEvent`
- `AddExpenseEntry`
- `RegisterNfcTag`
- `RecordNfcTap`

### Frontend migration approach

1. Keep the page components.
2. Generate the SQL Connect web SDK from `dataconnect/web`.
3. Replace seeded `initialStaff`, `initialExpenses`, and `initialAlerts` with generated query hooks.
4. Convert mutating methods like `addTask`, `markAttendance`, and `addExpense` into SQL Connect mutations.
5. Subscribe to SQL Connect realtime queries for the dashboard, alerts, attendance, and task pages.

## Phase 2: Real Onboarding Instead Of Demo Boot Data

The app needs an operational setup flow for a fresh household. The onboarding should create real records, not just dismiss a tour.

### Onboarding steps

- create household
- create owner account and default preferences
- add homemates and define permissions
- add staff members with role, payroll, phone, emergency contact, and shifts
- define household task library
- define rooms and operational zones
- define inventory categories and grocery tracking preferences
- add NFC tags and map each tag to a person, room, or task checkpoint
- review notification channels and AI permissions

### Bootstrap data the user should define

- staff roles and pay structures
- attendance rules and grace periods
- room list
- recurring chores
- grocery and supplies categories
- penalty and payroll policies
- notification preferences

## Phase 3: NFC Model For Real Household Operations

The current NFC support is attendance-oriented. Your room-wise and action-wise model needs a clearer event structure.

### NFC tag types

- `staff_identity_tag`
- `room_zone_tag`
- `task_checkpoint_tag`
- `attendance_station_tag`
- `inventory_station_tag`

### Recommended NFC event payload

- householdId
- actorId
- actorType
- tagId
- tagType
- roomId
- taskTemplateId
- actionType
- deviceId
- recordedAt
- source
- verificationStatus

### Example event flows

- attendance check-in: homemate phone + attendance station tag
- room entry: homemate phone + room zone tag
- cleaning completion: homemate phone + task checkpoint tag
- baby feeding: homemate phone + feeding checkpoint tag
- grocery refill: owner or homemate phone + inventory station tag

### Important product rule

Do not overload one NFC tap path for everything. Attendance, room presence, and task proof should each resolve to different server commands and validations.

## Phase 4: AI That Stays Grounded And Does Not Hallucinate

The current Gemini flow is not reliable enough for production because it depends on a client-supplied prompt and lets the model answer directly from whatever context the browser had at send time.

### Production AI rules

- the model never reads raw browser state as source of truth
- every answer is grounded in fresh backend queries
- every tool action is server-side and permission-checked
- every factual response includes the exact data slice it was derived from
- if data is missing, the assistant says it is missing instead of guessing

### Recommended AI architecture

1. User sends message to server.
2. Server classifies intent.
3. Server fetches household-scoped data from Postgres.
4. Server either:
   - answers from deterministic code for simple queries, or
   - calls the model with structured context and tool constraints.
5. Any write action goes through validated server tools only.
6. Final answer is returned with audit metadata.

### Query types that should bypass free-form generation

- who is on duty
- who is late
- what tasks are pending
- today attendance summary
- payroll totals
- grocery inventory status
- recent household spending

Those should be answered from code, not by asking the model to summarize blindly.

### Model safety pattern

- use retrieval/tool calling
- use household scoping in every query
- store conversation memory as structured facts, not only chat transcripts
- attach citations or source fragments internally for every answer
- log every AI action request and approval path

## Phase 5: Realtime Sync

Realtime should cover only high-signal operational surfaces:

- dashboard counts
- active alerts
- staff status
- attendance feed
- task completion
- inventory movements
- AI-triggered state changes

Recommended behavior:

- optimistic updates only for low-risk UI actions
- server echo remains authoritative
- conflict resolution for concurrent edits
- audit trail for every mutation

## Phase 6: Payroll, Expenses, And Inventory

These need server-grade data integrity.

### Payroll requirements

- per-staff salary basis
- deductions with reasons
- advances ledger
- monthly payroll snapshots
- payout approvals
- exportable payroll statements

### Expense requirements

- household-scoped ledger
- category taxonomy
- optional staff linkage
- receipt storage
- approval state
- anomaly detection inputs for AI

### Grocery and supplies requirements

- item catalog
- units
- room or storage location
- minimum thresholds
- consumption logs
- restock suggestions

## Suggested Build Order

1. Introduce backend schema and API contracts.
2. Replace `AppContext` demo state with query/mutation hooks.
3. Implement real onboarding and household bootstrap.
4. Add realtime subscriptions for staff, alerts, tasks, and attendance.
5. Move AI chat to server-side grounded orchestration.
6. Expand NFC from attendance to room and task checkpoints.
7. Finish payroll and inventory workflows.

## What We Can Implement Next In This Repo

The cleanest next development slice is:

1. run `firebase init dataconnect:sdk` after the Firebase project has SQL Connect enabled
2. generate the web SDK into `src/lib/dataconnect-generated`
3. add a backend adapter layer in the frontend so pages stop depending directly on seeded arrays
4. wire the current dashboard, staff, tasks, expenses, and alerts pages to that adapter
5. add the real onboarding flow for household bootstrap

## Decisions Needed Before Full Build-Out

These are now narrowed down to deployment and product behavior:

- the Firebase project ID, SQL Connect service location, and Cloud SQL instance name
- whether NFC writes originate from browser-only Web NFC or from a dedicated mobile wrapper/PWA strategy
- which Gemini model tier to use for production chat versus receipt vision
- which screens should move from the Firestore compatibility bridge to SQL Connect first

The stack choice is now settled: Firebase Auth, Firebase SQL Connect/Postgres, Cloud Functions, and Gemini.
