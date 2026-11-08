import { describe, expect, it } from "vitest";
import { expenseMonth } from "@/lib/expensePeriod";

describe("monthly expense ledger", () => {
  it("excludes October entries from November and includes them when October is selected", () => {
    const ledger = [{ date: "Oct 12, 2026", amount: 50 }, { date: "2026-10-12", amount: 25 }];
    const total = (month: string) => ledger.filter(item => expenseMonth(item.date) === month)
      .reduce((sum, item) => sum + item.amount, 0);
    expect(total("2026-11")).toBe(0);
    expect(total("2026-10")).toBe(75);
  });
});
