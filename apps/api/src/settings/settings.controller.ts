import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import type { SiteSettings as SiteSettingsDto } from "@rangamai/shared";
import { SettingsService } from "./settings.service";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

/** Public read of site settings (contact info, social links, SEO defaults). */
@Controller("settings")
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(): Promise<SiteSettingsDto> {
    return this.settings.get();
  }
}

@Controller("admin/settings")
@UseGuards(JwtAuthGuard)
export class AdminSettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(): Promise<SiteSettingsDto> {
    return this.settings.get();
  }

  @Patch()
  update(@Body() dto: UpdateSettingsDto): Promise<SiteSettingsDto> {
    return this.settings.update(dto);
  }
}
