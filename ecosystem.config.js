// PM2 process definitions for RANGAMAI production (single EC2 host).
// api  → :4000 (NestJS, /api prefix)   web → :3000   admin → :3001
// Each app reads its own apps/<name>/.env.local from its cwd.
const path = require("path");
const root = __dirname;

module.exports = {
  apps: [
    {
      name: "rangamai-api",
      cwd: path.join(root, "apps/api"),
      script: "dist/main.js",
      env: { NODE_ENV: "production" },
      max_memory_restart: "300M",
    },
    {
      name: "rangamai-web",
      cwd: path.join(root, "apps/web"),
      script: path.join(root, "node_modules/next/dist/bin/next"),
      args: "start -p 3000",
      env: { NODE_ENV: "production" },
      max_memory_restart: "350M",
    },
    {
      name: "rangamai-admin",
      cwd: path.join(root, "apps/admin"),
      script: path.join(root, "node_modules/next/dist/bin/next"),
      args: "start -p 3001",
      env: { NODE_ENV: "production" },
      max_memory_restart: "350M",
    },
  ],
};
