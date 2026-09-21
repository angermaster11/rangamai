import { Controller, Get, UseGuards } from "@nestjs/common";
import type { AdminStats, Lead as LeadDto } from "@rangamai/shared";
import { StatsService } from "./stats.service";
import { LeadsService } from "../leads/leads.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("admin/stats")
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(
    private readonly stats: StatsService,
    private readonly leads: LeadsService,
  ) {}

  @Get()
  summary(): Promise<AdminStats> {
    return this.stats.summary();
  }

  /** Recent leads for the dashboard's activity panel. */
  @Get("recent-leads")
  recentLeads(): Promise<LeadDto[]> {
    return this.leads.recent(5);
  }
}
