import { LeadStatus } from "@rangamai/shared";

/** Ordered list of statuses for filter dropdowns and the pipeline select. */
export const LEAD_STATUSES: LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.CONVERTED,
  LeadStatus.CLOSED,
  LeadStatus.LOST,
];

/** Badge tone per status, so the pipeline reads at a glance. */
export const LEAD_STATUS_TONE: Record<
  LeadStatus,
  "muted" | "accent" | "success" | "danger"
> = {
  [LeadStatus.NEW]: "accent",
  [LeadStatus.CONTACTED]: "muted",
  [LeadStatus.QUALIFIED]: "muted",
  [LeadStatus.CONVERTED]: "success",
  [LeadStatus.CLOSED]: "muted",
  [LeadStatus.LOST]: "danger",
};
