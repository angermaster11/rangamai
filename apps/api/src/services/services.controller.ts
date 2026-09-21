import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { Service as ServiceDto } from "@rangamai/shared";
import { ServicesService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ReorderDto } from "../common/dto/reorder.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

/** Public, unauthenticated read endpoints for published services. */
@Controller("services")
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  findPublished(): Promise<ServiceDto[]> {
    return this.services.findPublished();
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string): Promise<ServiceDto> {
    return this.services.findPublishedBySlug(slug);
  }
}

/** Admin CRUD — every route behind the JWT cookie guard. */
@Controller("admin/services")
@UseGuards(JwtAuthGuard)
export class AdminServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  findAll(): Promise<ServiceDto[]> {
    return this.services.findAll();
  }

  @Post("reorder")
  reorder(@Body() dto: ReorderDto): Promise<ServiceDto[]> {
    return this.services.reorder(dto.ids);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<ServiceDto> {
    return this.services.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateServiceDto): Promise<ServiceDto> {
    return this.services.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceDto> {
    return this.services.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.services.remove(id);
  }
}
