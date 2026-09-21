/**
 * Seed script: idempotently populates MongoDB with
 *  (a) an admin account from ADMIN_EMAIL / ADMIN_PASSWORD, and
 *  (b) the canonical content from @rangamai/shared (services, projects,
 *      clients, site settings, homepage).
 *
 * Safe to run repeatedly — everything upserts by a stable key (email / slug /
 * singleton), so it never creates duplicates.
 *
 *   npm run seed        (from repo root, or apps/api)
 */
import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import { seed } from "@rangamai/shared";

// Load apps/api/.env.local before reading any secret.
loadEnv({ path: resolve(__dirname, "../../.env.local") });
loadEnv({ path: resolve(__dirname, "../../.env") });

const BCRYPT_ROUNDS = 12;

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`✗ Missing required env var ${name} (set it in apps/api/.env.local)`);
    process.exit(1);
  }
  return value;
}

async function run(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/rangamai";
  const adminEmail = required("ADMIN_EMAIL").toLowerCase().trim();
  const adminPassword = required("ADMIN_PASSWORD");
  const adminName = process.env.ADMIN_NAME ?? "RANGAMAI Admin";

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database handle after connect");
  console.log(`• Connected to ${uri}`);

  /* ---- Admin user ---- */
  const passwordHash = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);
  await db.collection("admin_users").updateOne(
    { email: adminEmail },
    {
      $set: { name: adminName, passwordHash, role: "ADMIN", updatedAt: new Date() },
      $setOnInsert: { email: adminEmail, createdAt: new Date() },
    },
    { upsert: true },
  );
  console.log(`✓ Admin user ready: ${adminEmail}`);

  /* ---- Services (upsert by slug) ---- */
  for (const s of seed.services) {
    const { id: _id, ...doc } = s;
    void _id;
    await db.collection("services").updateOne(
      { slug: s.slug },
      { $set: { ...doc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }
  console.log(`✓ Services: ${seed.services.length}`);

  /* ---- Projects (upsert by slug) ---- */
  for (const p of seed.projects) {
    const { id: _id, ...doc } = p;
    void _id;
    await db.collection("projects").updateOne(
      { slug: p.slug },
      { $set: { ...doc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }
  console.log(`✓ Projects: ${seed.projects.length}`);

  /* ---- Clients (upsert by companyName) ---- */
  for (const c of seed.clients) {
    const { id: _id, ...doc } = c;
    void _id;
    await db.collection("clients").updateOne(
      { companyName: c.companyName },
      { $set: { ...doc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }
  console.log(`✓ Clients: ${seed.clients.length}`);

  /* ---- Site settings (singleton) ---- */
  await db.collection("site_settings").updateOne(
    { singletonKey: "default" },
    {
      $set: { ...seed.siteSettings, updatedAt: new Date() },
      $setOnInsert: { singletonKey: "default", createdAt: new Date() },
    },
    { upsert: true },
  );
  console.log("✓ Site settings ready");

  /* ---- Homepage (singleton) ---- */
  await db.collection("homepage").updateOne(
    { singletonKey: "default" },
    {
      $set: { ...seed.homepage, updatedAt: new Date() },
      $setOnInsert: { singletonKey: "default", createdAt: new Date() },
    },
    { upsert: true },
  );
  console.log("✓ Homepage ready");

  await mongoose.disconnect();
  console.log("✔ Seed complete.");
}

run().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
