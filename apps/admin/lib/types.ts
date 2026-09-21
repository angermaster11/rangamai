import type { Lead } from "@rangamai/shared";

/** Mirror of the API's PaginatedLeads response (apps/api leads.service). */
export interface PaginatedLeads {
  items: Lead[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
