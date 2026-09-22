/**
 * Central typed configuration, loaded from environment variables.
 * Secrets (JWT_SECRET, Cloudinary keys, admin password) come ONLY from the
 * environment — never hardcoded, never committed. See apps/api/.env.local.
 */
export interface AppConfig {
  port: number;
  mongodbUri: string;
  jwt: { secret: string; expiresIn: string };
  cors: { origins: string[] };
  cookie: { secure: boolean; name: string; domain?: string };
  admin: { email: string; password: string; name: string };
  cloudinary: { cloudName: string; apiKey: string; apiSecret: string; folder: string };
}

const splitList = (value?: string): string[] =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? "4000", 10),
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/rangamai",
  jwt: {
    secret: process.env.JWT_SECRET ?? "",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  },
  cors: {
    origins: splitList(process.env.CORS_ORIGINS) .length
      ? splitList(process.env.CORS_ORIGINS)
      : ["http://localhost:3000", "http://localhost:3001"],
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === "true",
    name: process.env.COOKIE_NAME ?? "rangamai_token",
    // Set to ".rangamai.in" in prod so the cookie is shared across the
    // web/admin/api subdomains. Leave unset in dev (host-only on localhost).
    domain: process.env.COOKIE_DOMAIN || undefined,
  },
  admin: {
    email: process.env.ADMIN_EMAIL ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    name: process.env.ADMIN_NAME ?? "RANGAMAI Admin",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    folder: process.env.CLOUDINARY_FOLDER ?? "rangamai",
  },
});
