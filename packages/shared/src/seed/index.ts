/**
 * Canonical seed content — the single source of truth shared by:
 *  - the API seed script (`apps/api`), which imports this into MongoDB, and
 *  - the public site (`apps/web`), which falls back to it when the API is down.
 *
 * Exported both individually and bundled as `seed` for convenience.
 */
import { services } from "./services";
import { projects } from "./projects";
import { clients } from "./clients";
import { siteSettings } from "./siteSettings";
import { homepage } from "./homepage";

export { services, projects, clients, siteSettings, homepage };

export const seed = {
  services,
  projects,
  clients,
  siteSettings,
  homepage,
};
