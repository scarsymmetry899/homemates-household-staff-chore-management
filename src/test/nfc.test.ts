import { afterEach, expect, it, vi } from "vitest";
import { writeNfcTag } from "@/lib/nfc";

afterEach(() => vi.unstubAllGlobals());

it.each([true, false])("checks the actual sticker after writing (match %s)", async (matches) => {
  let written = "";
  class Reader {
    onreading?: (event: unknown) => void;
    async write(message: { records: { data: string }[] }) {
      written = message.records[0].data;
    }
    async scan() {
      this.onreading?.({ message: { records: [{
        recordType: "text",
        data: new TextEncoder().encode(matches ? written : "another sticker"),
      }] } });
    }
  }
  vi.stubGlobal("NDEFReader", Reader);
  const result = writeNfcTag("helper-1");
  if (matches) await expect(result).resolves.toBeUndefined();
  else await expect(result).rejects.toThrow("Different sticker");
  expect(written).toBe("homemates:staffId:helper-1");
});
