import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { Project as ProjectDto } from "@rangamai/shared";
import { Project, ProjectDocument } from "./schemas/project.schema";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly model: Model<ProjectDocument>,
  ) {}

  static toDto(doc: ProjectDocument): ProjectDto {
    const o = doc.toObject({ versionKey: false });
    return {
      id: doc._id.toString(),
      title: o.title,
      slug: o.slug,
      shortDescription: o.shortDescription,
      coverImage: o.coverImage,
      description: o.description,
      problem: o.problem,
      solution: o.solution,
      keyFeatures: o.keyFeatures,
      techStack: o.techStack,
      metrics: o.metrics,
      client: o.client,
      industry: o.industry,
      servicesUsed: o.servicesUsed,
      gallery: o.gallery,
      liveUrl: o.liveUrl,
      githubUrl: o.githubUrl,
      displayOrder: o.displayOrder,
      featured: o.featured,
      published: o.published,
      seo: o.seo,
      createdAt: o.createdAt?.toISOString?.(),
      updatedAt: o.updatedAt?.toISOString?.(),
    };
  }

  /* -------------------------------- Public ------------------------------- */

  async findPublished(): Promise<ProjectDto[]> {
    const docs = await this.model
      .find({ published: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .exec();
    return docs.map(ProjectsService.toDto);
  }

  async findPublishedBySlug(slug: string): Promise<ProjectDto> {
    const doc = await this.model.findOne({ slug, published: true }).exec();
    if (!doc) throw new NotFoundException("Project not found");
    return ProjectsService.toDto(doc);
  }

  /* -------------------------------- Admin -------------------------------- */

  async findAll(): Promise<ProjectDto[]> {
    const docs = await this.model
      .find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .exec();
    return docs.map(ProjectsService.toDto);
  }

  async findOne(id: string): Promise<ProjectDto> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException("Project not found");
    return ProjectsService.toDto(doc);
  }

  async create(dto: CreateProjectDto): Promise<ProjectDto> {
    const created = await this.model.create({ ...dto });
    return ProjectsService.toDto(created);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectDto> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .exec();
    if (!doc) throw new NotFoundException("Project not found");
    return ProjectsService.toDto(doc);
  }

  async remove(id: string): Promise<{ id: string }> {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException("Project not found");
    return { id };
  }

  async reorder(ids: string[]): Promise<ProjectDto[]> {
    await Promise.all(
      ids.map((id, index) =>
        this.model.updateOne({ _id: id }, { $set: { displayOrder: index + 1 } }).exec(),
      ),
    );
    return this.findAll();
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
