import * as admin from "firebase-admin";

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
  if (admin.apps.length) return admin.app();
  return admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

export async function requireFirebaseUser(req: ApiRequest): Promise<admin.auth.DecodedIdToken> {
  const authorization = getHeader(req, "authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  if (!token) throw new Error("Missing Firebase auth token.");

  const app = getAdminApp();
  return app.auth().verifyIdToken(token);
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
