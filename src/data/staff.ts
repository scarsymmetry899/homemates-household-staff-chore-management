import elenaImg from "@/assets/staff/elena-moretti.jpg";
import marcusImg from "@/assets/staff/marcus-thorne.jpg";
import julianImg from "@/assets/staff/julian-reed.jpg";
import siennaImg from "@/assets/staff/sienna-brooks.jpg";
import arthurImg from "@/assets/staff/arthur-penhaligon.jpg";
import mariaImg from "@/assets/staff/maria-gomez.jpg";

export type StaffStatus = "on-duty" | "late" | "absent" | "en-route" | "off-duty";
export type Department = "Hospitality" | "Security" | "Grounds" | "Culinary" | "Maintenance";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: Department;
  photo: string;
  phone: string;
  salary: number;
  status: StaffStatus;
  reliabilityScore: number;
  tenure: string;
  location: string;
  skills: string[];
  arrivalTime?: string;
  assignments: { task: string; done: boolean }[];
  notes?: string;
  attendance: { date: string; type: string; detail: string }[];
  payroll: {
    baseSalary: number;
    bonus: number;
    deductions: number;
    netPay: number;
    month: string;
  };
}

export const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Elena Moretti",
    role: "Head of Housekeeping",
    department: "Hospitality",
    photo: elenaImg,
    phone: "+91 98765 43210",
    salary: 25000,
    status: "on-duty",
    reliabilityScore: 99.4,
    tenure: "4 Years, 2 Months",
    location: "West Wing Annex",
    skills: ["Deep cleaning", "Linen management", "Event setup"],
    arrivalTime: "07:50 AM",
    assignments: [
      { task: "Linens inventory check", done: true },
      { task: "Supervise silver polishing", done: false },
      { task: "Floral arrangement - Dining Hall", done: false },
    ],
    notes: "Eleanor has shown exceptional attention to detail during the winter gala preparations. Recommended for annual bonus.",
    attendance: [
      { date: "Today, 08:00 AM", type: "check-in", detail: "Check-in: Main Gate\nShift: Morning Duty" },
      { date: "Yesterday", type: "on-site", detail: "On-Site: 08:05 AM - 05:45 PM\nAll duties completed on schedule." },
      { date: "Oct 24, 2023", type: "leave", detail: "Approved Absence\nReason: Medical Appointment" },
      { date: "Oct 23, 2023", type: "on-site", detail: "On-Site: 07:55 AM - 06:00 PM\nOvertime: 1.0 hr (Kitchen Support)" },
    ],
    payroll: { baseSalary: 4850, bonus: 450, deductions: 120, netPay: 5180, month: "October 2023" },
  },
  {
    id: "2",
    name: "Marcus Thorne",
    role: "Security Detail",
    department: "Security",
    photo: marcusImg,
    phone: "+91 98765 43211",
    salary: 22000,
    status: "late",
    reliabilityScore: 87.2,
    tenure: "2 Years, 8 Months",
    location: "Main Gate",
    skills: ["Perimeter patrol", "CCTV monitoring", "Emergency response"],
    arrivalTime: "08:25 AM",
    assignments: [
      { task: "Morning perimeter check", done: true },
      { task: "CCTV log review", done: false },
      { task: "Gate visitor log update", done: false },
    ],
    attendance: [
      { date: "Today, 08:25 AM", type: "late", detail: "Check-in: Main Gate\nLate by 25 minutes" },
      { date: "Yesterday", type: "on-site", detail: "On-Site: 08:00 AM - 06:00 PM" },
    ],
    payroll: { baseSalary: 4200, bonus: 0, deductions: 200, netPay: 4000, month: "October 2023" },
  },
  {
    id: "3",
    name: "Julian Reed",
    role: "Grounds Manager",
    department: "Grounds",
    photo: julianImg,
    phone: "+91 98765 43212",
    salary: 20000,
    status: "on-duty",
    reliabilityScore: 95.8,
    tenure: "3 Years, 1 Month",
    location: "Garden Wing",
    skills: ["Landscaping", "Irrigation systems", "Botanical care"],
    arrivalTime: "07:45 AM",
    assignments: [
      { task: "Lawn mowing - front estate", done: true },
      { task: "Hedge trimming", done: true },
      { task: "Irrigation check", done: false },
    ],
    attendance: [
      { date: "Today, 07:45 AM", type: "check-in", detail: "Check-in: Garden Gate\nShift: Morning Duty" },
    ],
    payroll: { baseSalary: 3800, bonus: 200, deductions: 80, netPay: 3920, month: "October 2023" },
  },
  {
    id: "4",
    name: "Sienna Brooks",
    role: "Culinary Lead",
    department: "Culinary",
    photo: siennaImg,
    phone: "+91 98765 43213",
    salary: 30000,
    status: "absent",
    reliabilityScore: 92.1,
    tenure: "5 Years, 6 Months",
    location: "Main Kitchen",
    skills: ["North Indian cooking", "Continental", "Menu planning"],
    assignments: [
      { task: "Breakfast prep", done: false },
      { task: "Lunch menu planning", done: false },
    ],
    attendance: [
      { date: "Today", type: "absent", detail: "No check-in recorded\nStatus: Absent" },
    ],
    payroll: { baseSalary: 5500, bonus: 300, deductions: 500, netPay: 5300, month: "October 2023" },
  },
  {
    id: "5",
    name: "Arthur Penhaligon",
    role: "Inventory Specialist",
    department: "Maintenance",
    photo: arthurImg,
    phone: "+91 98765 43214",
    salary: 18000,
    status: "on-duty",
    reliabilityScore: 96.5,
    tenure: "6 Years, 3 Months",
    location: "Storage Wing",
    skills: ["Inventory management", "Vendor coordination", "Procurement"],
    arrivalTime: "07:30 AM",
    assignments: [
      { task: "Monthly stock audit", done: true },
      { task: "Vendor delivery coordination", done: false },
    ],
    attendance: [
      { date: "Today, 07:30 AM", type: "check-in", detail: "Check-in: Staff Entrance\nShift: Morning Duty" },
    ],
    payroll: { baseSalary: 3500, bonus: 150, deductions: 60, netPay: 3590, month: "October 2023" },
  },
  {
    id: "6",
    name: "Maria Gomez",
    role: "Senior Stewardess",
    department: "Hospitality",
    photo: mariaImg,
    phone: "+91 98765 43215",
    salary: 20000,
    status: "on-duty",
    reliabilityScore: 98.9,
    tenure: "3 Years, 9 Months",
    location: "East Wing",
    skills: ["Guest reception", "Table setting", "Event coordination"],
    arrivalTime: "07:55 AM",
    assignments: [
      { task: "Guest room inspection", done: true },
      { task: "Dining room setup", done: true },
      { task: "Evening tea service prep", done: false },
    ],
    attendance: [
      { date: "Today, 07:55 AM", type: "check-in", detail: "Check-in: Main Entrance\nShift: Morning Duty" },
    ],
    payroll: { baseSalary: 3800, bonus: 200, deductions: 50, netPay: 3950, month: "October 2023" },
  },
];

export const departments: Department[] = ["Hospitality", "Security", "Grounds", "Culinary", "Maintenance"];
