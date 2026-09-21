import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { Service as ServiceDto } from "@rangamai/shared";
import { Service, ServiceDocument } from "./schemas/service.schema";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name)
    private readonly model: Model<ServiceDocument>,
  ) {}

  static toDto(doc: ServiceDocument): ServiceDto {
    const o = doc.toObject({ versionKey: false });
    return {
      id: doc._id.toString(),
      title: o.title,
      slug: o.slug,
      shortDescription: o.shortDescription,
      description: o.description,
      banner: o.banner,
      images: o.images,
      icon: o.icon,
      highlights: o.highlights,
      displayOrder: o.displayOrder,
      featured: o.featured,
      published: o.published,
      seo: o.seo,
      createdAt: o.createdAt?.toISOString?.(),
      updatedAt: o.updatedAt?.toISOString?.(),
    };
  }

  /* -------------------------------- Public ------------------------------- */

  /** All published services, ordered. */
  async findPublished(): Promise<ServiceDto[]> {
    const docs = await this.model
      .find({ published: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .exec();
    return docs.map(ServicesService.toDto);
  }

  /** A single published service by slug. */
  async findPublishedBySlug(slug: string): Promise<ServiceDto> {
    const doc = await this.model.findOne({ slug, published: true }).exec();
    if (!doc) throw new NotFoundException("Service not found");
    return ServicesService.toDto(doc);
  }

  /* -------------------------------- Admin -------------------------------- */

  /** Every service (published or not), ordered — for the admin list. */
  async findAll(): Promise<ServiceDto[]> {
    const docs = await this.model
      .find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .exec();
    return docs.map(ServicesService.toDto);
  }

  async findOne(id: string): Promise<ServiceDto> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException("Service not found");
    return ServicesService.toDto(doc);
  }

  async create(dto: CreateServiceDto): Promise<ServiceDto> {
    const created = await this.model.create({ ...dto });
    return ServicesService.toDto(created);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceDto> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .exec();
    if (!doc) throw new NotFoundException("Service not found");
    return ServicesService.toDto(doc);
  }

  async remove(id: string): Promise<{ id: string }> {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException("Service not found");
    return { id };
  }

  /** Persists a new order given a full list of ids. */
  async reorder(ids: string[]): Promise<ServiceDto[]> {
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
