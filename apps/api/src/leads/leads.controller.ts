import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Lead as LeadDto } from "@rangamai/shared";
import { LeadsService, PaginatedLeads } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

/** Public contact endpoint — no auth, but rate-limited to deter spam. */
@Controller("leads")
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  // Tighter than the global limit: 5 submissions per minute per IP.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  create(@Body() dto: CreateLeadDto): Promise<LeadDto> {
    return this.leads.create(dto);
  }
}

@Controller("admin/leads")
@UseGuards(JwtAuthGuard)
export class AdminLeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  findAll(@Query() query: QueryLeadsDto): Promise<PaginatedLeads> {
    return this.leads.findPaginated(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<LeadDto> {
    return this.leads.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateLeadDto,
  ): Promise<LeadDto> {
    return this.leads.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.leads.remove(id);
  }
}
