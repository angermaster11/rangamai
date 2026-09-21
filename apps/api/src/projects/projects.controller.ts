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
import type { Project as ProjectDto } from "@rangamai/shared";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ReorderDto } from "../common/dto/reorder.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

/** Public read endpoints for published projects / case studies. */
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findPublished(): Promise<ProjectDto[]> {
    return this.projects.findPublished();
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string): Promise<ProjectDto> {
    return this.projects.findPublishedBySlug(slug);
  }
}

@Controller("admin/projects")
@UseGuards(JwtAuthGuard)
export class AdminProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findAll(): Promise<ProjectDto[]> {
    return this.projects.findAll();
  }

  @Post("reorder")
  reorder(@Body() dto: ReorderDto): Promise<ProjectDto[]> {
    return this.projects.reorder(dto.ids);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<ProjectDto> {
    return this.projects.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProjectDto): Promise<ProjectDto> {
    return this.projects.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectDto> {
    return this.projects.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.projects.remove(id);
  }
}
