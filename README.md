🏠 Homemates: Premium Homehelp Manager
Homemates is an elite estate management platform designed to eliminate the cognitive load of managing multiple household staff. Built for premium households with diverse help—including chefs, drivers, security, and housekeepers—it provides a single source of truth for attendance, task completion, and automated payroll.

🚀 The Problem
Modern premium households often manage 4–8 different staff members with overlapping shifts. Tracking who showed up, what tasks were completed (cleaning vs. deep cleaning), and calculating monthly salaries with deductions for leaves is a manual, error-prone nightmare.

Homemates automates this via physical NFC touchpoints, an AI-driven Telegram Bot, and a Real-time Dashboard.

✨ Key Features
1. NFC "Tap-to-Track" Attendance
Hardware Integration: Each staff member is issued a unique NFC tag (keychain or card).

Zero Friction: Staff simply tap their tag against a stationary reader (tablet/phone) at the entry point.

Instant Verification: Real-time logging of "Check-in" and "Check-out" times directly to Firestore.

2. AI-Powered Telegram Bot
Manual Overrides: Send a simple message: "Driver is on leave today" or "Security is running 30 mins late."

Gemini 2.5 Logic: The bot uses Gemini 2.5 Flash to parse natural language and update the database automatically.

Daily Briefing: Get a 9:00 AM summary of who has arrived and who is missing.

3. The Premium Dashboard
Task Granularity: Tracks specific tasks (e.g., mopping, laundry, babysitting) instead of just "work."

Live Status: See at a glance who is currently on-site.

Automated Payroll: One-click salary calculation: (Base Pay) - (Prorated Absence) + (Bonuses).

🛠 Tech Stack
IDE: Antigravity (Agentic Development Environment)

Frontend: React / Tailwind CSS (Exported from Lovable)

Backend: Google Firebase (Firestore, Auth, Cloud Functions)

Intelligence: Gemini 2.5 Flash (NLP for Telegram & Task Analysis)

Automation: n8n (for complex workflow bridging)

Interface: Telegram Bot API

📦 Installation & Setup
1. Repository Setup
Bash
git clone https://github.com/yourusername/homemates-app.git
cd homemates-app
npm install
2. Antigravity Configuration
Open the project in Antigravity. Use the Agent sidebar to initialize the environment:

Prompt: "Initialize Firebase for this project and link the 'staff' and 'attendance' collections."

3. Telegram Bot
Create a bot via @BotFather on Telegram.

Add your TELEGRAM_BOT_TOKEN to the .env file.

Deploy the bot listener using Antigravity's serverless agent.

4. NFC Enrollment
Navigate to the /admin/enroll route on your dashboard.

Tap a new NFC tag against the reader.

Assign the unique Serial ID to a staff member profile.

📱 Usage
For the Owner: Use the web dashboard for payroll and bird's-eye view monitoring.

For the Staff: Physical NFC tap at the door. No app installation required on their personal phones.

For the Senior Help: A simplified "Manager View" on a tablet to verify tasks like "Kitchen Cleaned" or "Dog Walked."

🗺 Roadmap
[ ] GPS Geofencing: Auto-clock-in for drivers when the car leaves/enters the driveway.

[ ] Inventory Management: Track grocery/pantry levels through the same dashboard.

[ ] One-Click UPI: Integrated salary payouts via UPI deep-linking.

Note: This project is built using an AI-native workflow. To contribute or modify, use Antigravity's Agent Mode to ensure database schemas remain synced with the UI components.
