import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

type HeaderValue = string | string[] | undefined;

export interface ApiRequest {
  method?: string;
  headers: Record<string, HeaderValue>;
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

function getHeader(req: ApiRequest, name: string): string | undefined {
  const value = req.headers[name] ?? req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;
  return initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

export async function requireFirebaseUser(req: ApiRequest): Promise<DecodedIdToken> {
  const authorization = getHeader(req, "authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  if (!token) throw new Error("Missing Firebase auth token.");

  const app = getAdminApp();
  try {
    return await getAuth(app).verifyIdToken(token);
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
    console.warn("Firebase token verification failed", { code, projectId: app.options.projectId });
    throw error;
  }
}

export function parseJsonBody<T>(body: unknown): T {
  return typeof body === "string" ? JSON.parse(body) as T : body as T;
}

export function allowOnlyPost(req: ApiRequest, res: ApiResponse): boolean {
  if (req.method === "POST") return true;
  res.setHeader("Allow", "POST");
  res.status(405).json({ error: "Method not allowed." });
  return false;
}
