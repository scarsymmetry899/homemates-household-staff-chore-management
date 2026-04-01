import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { staffMembers } from "@/data/staff";

export const seedDatabase = async () => {
  try {
    const batch = writeBatch(db);

    for (const member of staffMembers) {
      // 1. Create Staff Document
      const staffRef = doc(collection(db, "staff"));
      const staffId = staffRef.id;

      batch.set(staffRef, {
        name: member.name,
        role: member.role,
        department: member.department,
        salary: member.salary,
        status: member.status,
        reliabilityScore: member.reliabilityScore,
        punctualityScore: member.punctualityScore,
        shiftStart: member.shiftStart,
        shiftEnd: member.shiftEnd,
        telegramChatId: "", // To be populated later
        createdAt: new Date().toISOString(),
      });

      // 2. Create Tasks
      if (member.assignments) {
        for (const task of member.assignments) {
          const taskRef = doc(collection(db, "tasks"));
          batch.set(taskRef, {
            staffId: staffId,
            taskName: task.task,
            isDone: task.done,
            dueDate: task.dueDate || null,
            notifiedViaTelegram: false,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // 3. Create Attendance Records
      if (member.attendance) {
        for (const record of member.attendance) {
          const attendanceRef = doc(collection(db, "attendance"));
          batch.set(attendanceRef, {
            staffId: staffId,
            date: record.date.split(",")[0], // Basic cleanup
            type: record.type,
            detail: record.detail,
            logMethod: "manual",
            timestamp: new Date().toISOString(),
          });
        }
      }

      // 4. Create Mock NFC Tag for each member
      const nfcRef = doc(collection(db, "nfc_tags"));
      batch.set(nfcRef, {
        tagId: `mock-nfc-${staffId.substring(0, 6)}`,
        staffId: staffId,
        assignedAt: new Date().toISOString(),
      });
    }

    // 5. Initial Expenses
    const initialExpenses = [
      { category: "Fuel", amount: 1200, description: "Petrol for weekly commute", staffName: "Marcus Thorne", date: "Oct 25, 2023" },
      { category: "Groceries", amount: 3500, description: "Weekly pantry restock", staffName: "Sienna Brooks", date: "Oct 24, 2023" },
    ];
    for (const exp of initialExpenses) {
      const expRef = doc(collection(db, "expenses"));
      batch.set(expRef, {
        ...exp,
        timestamp: new Date().toISOString(),
      });
    }

    // 6. Initial Alerts
    const initialAlerts = [
      { type: "attendance", severity: "high", title: "Cook hasn't checked in", description: "Sienna Brooks hasn't arrived.", staffName: "Sienna Brooks", time: "9:10 AM", dismissed: false },
    ];
    for (const alert of initialAlerts) {
      const alertRef = doc(collection(db, "alerts"));
      batch.set(alertRef, {
        ...alert,
        timestamp: new Date().toISOString(),
      });
    }

    await batch.commit();
    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database: ", error);
    return false;
  }
};
