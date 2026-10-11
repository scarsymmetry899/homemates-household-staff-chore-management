import { GoogleGenerativeAI } from "@google/generative-ai";
import { allowOnlyPost, ApiRequest, ApiResponse, parseJsonBody, requireFirebaseUser } from "./_auth.js";

const categories = new Set(["Fuel", "Groceries", "Repairs", "Advances", "Household"]);
const mimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

interface ScanRequest {
  imageBase64?: string;
  mimeType?: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!allowOnlyPost(req, res)) return;
  try {
    await requireFirebaseUser(req);
  } catch {
    res.status(401).json({ error: "Sign in is required." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Receipt scanning is not configured." });
    return;
  }

  const { imageBase64, mimeType } = parseJsonBody<ScanRequest>(req.body);
  if (!mimeTypes.has(mimeType || "") || !imageBase64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(imageBase64) || imageBase64.length > 2_700_000) {
    res.status(400).json({ error: "A JPG, PNG, or WebP image under 2 MB is required." });
    return;
  }

  try {
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite" });
    const result = await model.generateContent([
      "Extract up to 10 individual purchased line items from this household receipt. Return only a JSON array of objects with description, numeric amount in INR, and category from Fuel, Groceries, Repairs, Advances, Household. If this is not a receipt, return []. Do not include a grand total when individual line items are present.",
      { inlineData: { data: imageBase64, mimeType: mimeType! } },
    ]);
    const response = result.response.text().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const parsed: unknown = JSON.parse(response);
    const items = Array.isArray(parsed) ? parsed.slice(0, 10).filter((item) =>
      item && typeof item.description === "string" && item.description.trim().length > 0 &&
      typeof item.amount === "number" && Number.isFinite(item.amount) && item.amount > 0 &&
      categories.has(item.category)
    ).map((item) => ({ description: item.description.trim().slice(0, 200), amount: Math.round(item.amount), category: item.category })) : [];
    res.status(200).json({ items });
  } catch (error) {
    console.error("Receipt extraction failed", error);
    res.status(502).json({ error: "Receipt extraction failed." });
  }
}
