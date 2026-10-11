import { describe, expect, it } from "vitest";
import { localDateKey } from "@/lib/localDate";

describe("localDateKey", () => {
  it("uses the local calendar date shortly after midnight", () => {
    expect(localDateKey(new Date(2026, 9, 12, 0, 10))).toBe("2026-10-12");
  });
});
