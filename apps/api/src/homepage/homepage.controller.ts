import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import type { Homepage as HomepageDto } from "@rangamai/shared";
import { HomepageService } from "./homepage.service";
import { UpdateHomepageDto } from "./dto/update-homepage.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

/** Public read of homepage CMS content. */
@Controller("homepage")
export class HomepageController {
  constructor(private readonly homepage: HomepageService) {}

  @Get()
  get(): Promise<HomepageDto> {
    return this.homepage.get();
  }
}

@Controller("admin/homepage")
@UseGuards(JwtAuthGuard)
export class AdminHomepageController {
  constructor(private readonly homepage: HomepageService) {}

  @Get()
  get(): Promise<HomepageDto> {
    return this.homepage.get();
  }

  @Patch()
  update(@Body() dto: UpdateHomepageDto): Promise<HomepageDto> {
    return this.homepage.update(dto);
  }
}
