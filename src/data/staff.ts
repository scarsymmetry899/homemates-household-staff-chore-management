import elenaImg from "@/assets/staff/elena-moretti.jpg";
import marcusImg from "@/assets/staff/marcus-thorne.jpg";
import julianImg from "@/assets/staff/julian-reed.jpg";
import siennaImg from "@/assets/staff/sienna-brooks.jpg";
import arthurImg from "@/assets/staff/arthur-penhaligon.jpg";
import mariaImg from "@/assets/staff/maria-gomez.jpg";

export type StaffStatus = "on-duty" | "late" | "absent" | "en-route" | "off-duty";
export type Department = "Hospitality" | "Security" | "Grounds" | "Culinary" | "Maintenance" | "Other";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: Department;
  customDepartment?: string;
  photo: string;
  phone: string;
  salary: number;
  status: StaffStatus;
  reliabilityScore: number;
  punctualityScore: number;
  tenure: string;
  location: string;
  skills: string[];
  arrivalTime?: string;
  shiftStart: string;
  shiftEnd: string;
  assignments: { task: string; done: boolean; dueDate?: string }[];
  notes?: string;
  attendance: { date: string; type: string; detail: string }[];
  payroll: {
    baseSalary: number;
    deductions: number;
    netPay: number;
    month: string;
  };
}

export const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Elena Moretti",
    role: "Housekeeper",
    department: "Hospitality",
    photo: elenaImg,
    phone: "+91 98765 43210",
    salary: 25000,
    status: "on-duty",
    reliabilityScore: 99.4,
    punctualityScore: 98.5,
    tenure: "4 Years, 2 Months",
    location: "West Wing Annex",
    skills: ["Deep cleaning", "Linen management", "Event setup"],
    arrivalTime: "07:50 AM",
    shiftStart: "08:00 AM",
    shiftEnd: "05:00 PM",
    assignments: [
      { task: "Linens inventory check", done: true },
      { task: "Supervise silver polishing", done: false },
      { task: "Floral arrangement - Dining Hall", done: false },
    ],
    notes: "Elena has shown exceptional attention to detail during the winter gala preparations. Recommended for recognition.",
    attendance: [
      { date: "Today, 08:00 AM", type: "check-in", detail: "Check-in: Main Gate\nShift: Morning Duty" },
      { date: "Yesterday", type: "on-site", detail: "On-Site: 08:05 AM - 05:45 PM\nAll duties completed on schedule." },
      { date: "Oct 24, 2023", type: "leave", detail: "Approved Absence\nReason: Medical Appointment" },
      { date: "Oct 23, 2023", type: "on-site", detail: "On-Site: 07:55 AM - 06:00 PM\nOvertime: 1.0 hr (Kitchen Support)" },
    ],
    payroll: { baseSalary: 25000, deductions: 0, netPay: 25000, month: "October 2023" },
  },
  {
    id: "2",
    name: "Marcus Thorne",
    role: "Chauffeur",
    department: "Security",
    photo: marcusImg,
    phone: "+91 98765 43211",
    salary: 22000,
    status: "late",
    reliabilityScore: 87.2,
    punctualityScore: 72.0,
    tenure: "2 Years, 8 Months",
    location: "Main Gate",
    skills: ["Driving", "Vehicle maintenance", "Route planning"],
    arrivalTime: "08:25 AM",
    shiftStart: "08:00 AM",
    shiftEnd: "06:00 PM",
    assignments: [
      { task: "Morning school drop-off", done: true },
      { task: "Vehicle inspection & cleaning", done: false },
      { task: "Evening airport pickup", done: false },
    ],
    attendance: [
      { date: "Today, 08:25 AM", type: "late", detail: "Check-in: Main Gate\nLate by 25 minutes" },
      { date: "Yesterday", type: "on-site", detail: "On-Site: 08:00 AM - 06:00 PM" },
    ],
    payroll: { baseSalary: 22000, deductions: 0, netPay: 22000, month: "October 2023" },
  },
  {
    id: "3",
    name: "Julian Reed",
    role: "Gardener",
    department: "Grounds",
    photo: julianImg,
    phone: "+91 98765 43212",
    salary: 20000,
    status: "on-duty",
    reliabilityScore: 95.8,
    punctualityScore: 97.2,
    tenure: "3 Years, 1 Month",
    location: "Garden Wing",
    skills: ["Landscaping", "Irrigation systems", "Botanical care"],
    arrivalTime: "07:45 AM",
    shiftStart: "07:30 AM",
    shiftEnd: "04:30 PM",
    assignments: [
      { task: "Lawn mowing - front yard", done: true },
      { task: "Hedge trimming", done: true },
      { task: "Irrigation check", done: false },
    ],
    attendance: [
      { date: "Today, 07:45 AM", type: "check-in", detail: "Check-in: Garden Gate\nShift: Morning Duty" },
    ],
    payroll: { baseSalary: 20000, deductions: 0, netPay: 20000, month: "October 2023" },
  },
  {
    id: "4",
    name: "Sienna Brooks",
    role: "Cook",
    department: "Culinary",
    photo: siennaImg,
    phone: "+91 98765 43213",
    salary: 30000,
    status: "absent",
    reliabilityScore: 92.1,
    punctualityScore: 85.0,
    tenure: "5 Years, 6 Months",
    location: "Main Kitchen",
    skills: ["North Indian cooking", "Continental", "Menu planning"],
    shiftStart: "07:00 AM",
    shiftEnd: "03:00 PM",
    assignments: [
      { task: "Breakfast prep", done: false },
      { task: "Lunch menu planning", done: false },
    ],
    attendance: [
      { date: "Today", type: "absent", detail: "No check-in recorded\nStatus: Absent" },
    ],
    payroll: { baseSalary: 30000, deductions: 0, netPay: 30000, month: "October 2023" },
  },
  {
    id: "5",
    name: "Arthur Penhaligon",
    role: "Caretaker",
    department: "Maintenance",
    photo: arthurImg,
    phone: "+91 98765 43214",
    salary: 18000,
    status: "on-duty",
    reliabilityScore: 96.5,
    punctualityScore: 99.0,
    tenure: "6 Years, 3 Months",
    location: "Storage Wing",
    skills: ["Inventory management", "Vendor coordination", "Procurement"],
    arrivalTime: "07:30 AM",
    shiftStart: "07:30 AM",
    shiftEnd: "04:00 PM",
    assignments: [
      { task: "Monthly stock audit", done: true },
      { task: "Vendor delivery coordination", done: false },
    ],
    attendance: [
      { date: "Today, 07:30 AM", type: "check-in", detail: "Check-in: Staff Entrance\nShift: Morning Duty" },
    ],
    payroll: { baseSalary: 18000, deductions: 0, netPay: 18000, month: "October 2023" },
  },
  {
    id: "6",
    name: "Maria Gomez",
    role: "Nanny",
    department: "Hospitality",
    photo: mariaImg,
    phone: "+91 98765 43215",
    salary: 20000,
    status: "on-duty",
    reliabilityScore: 98.9,
    punctualityScore: 96.8,
    tenure: "3 Years, 9 Months",
    location: "East Wing",
    skills: ["Childcare", "Meal prep for kids", "First aid"],
    arrivalTime: "07:55 AM",
    shiftStart: "08:00 AM",
    shiftEnd: "05:00 PM",
    assignments: [
      { task: "Kids morning routine", done: true },
      { task: "Lunch & snack prep", done: true },
      { task: "Evening activities", done: false },
    ],
    attendance: [
      { date: "Today, 07:55 AM", type: "check-in", detail: "Check-in: Main Entrance\nShift: Morning Duty" },
    ],
    payroll: { baseSalary: 20000, deductions: 0, netPay: 20000, month: "October 2023" },
  },
];

export const departments: Department[] = ["Hospitality", "Security", "Grounds", "Culinary", "Maintenance", "Other"];
