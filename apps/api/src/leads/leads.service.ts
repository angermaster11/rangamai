import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { LeadStatus, type Lead as LeadDto } from "@rangamai/shared";
import { Lead, LeadDocument } from "./schemas/lead.schema";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { QueryLeadsDto } from "./dto/query-leads.dto";

export interface PaginatedLeads {
  items: LeadDto[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

@Injectable()
export class LeadsService {
  private readonly logger = new Logger("Leads");

  constructor(
    @InjectModel(Lead.name)
    private readonly model: Model<LeadDocument>,
  ) {}

  static toDto(doc: LeadDocument): LeadDto {
    const o = doc.toObject({ versionKey: false });
    return {
      id: doc._id.toString(),
      name: o.name,
      email: o.email,
      phone: o.phone,
      company: o.company,
      service: o.service,
      budgetRange: o.budgetRange,
      projectType: o.projectType,
      message: o.message,
      source: o.source,
      status: o.status,
      notes: o.notes,
      createdAt: o.createdAt?.toISOString?.(),
      updatedAt: o.updatedAt?.toISOString?.(),
    };
  }

  /* -------------------------------- Public ------------------------------- */

  /** Stores a new lead and fires the (stubbed) notification. */
  async create(dto: CreateLeadDto, source = "website"): Promise<LeadDto> {
    const created = await this.model.create({
      ...dto,
      source,
      status: LeadStatus.NEW,
    });
    this.notify(LeadsService.toDto(created));
    return LeadsService.toDto(created);
  }

  /**
   * Email notification — intentionally a dev-log stub.
   *
   * RANGAMAI has no official sending address yet, and we will NOT send from a
   * personal Gmail (it reads as untrustworthy). The lead IS persisted above;
   * this only logs that a notification would go out. Wire a real provider
   * (Resend, SES, etc.) here once an official domain/mailbox exists.
   *
   * TODO(email): replace with a real transactional email provider.
   */
  private notify(lead: LeadDto): void {
    this.logger.log(
      `New lead #${lead.id} from ${lead.name} <${lead.email}>` +
        (lead.service ? ` (service: ${lead.service})` : "") +
        ` — email notification skipped (no provider configured yet).`,
    );
  }

  /* -------------------------------- Admin -------------------------------- */

  async findPaginated(query: QueryLeadsDto): Promise<PaginatedLeads> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: FilterQuery<LeadDocument> = {};

    if (query.status) filter.status = query.status;
    if (query.search) {
      // Case-insensitive match across the fields an admin would search by.
      const rx = new RegExp(escapeRegExp(query.search), "i");
      filter.$or = [
        { name: rx },
        { email: rx },
        { company: rx },
        { message: rx },
        { service: rx },
      ];
    }

    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      items: docs.map(LeadsService.toDto),
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: string): Promise<LeadDto> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException("Lead not found");
    return LeadsService.toDto(doc);
  }

  async update(id: string, dto: UpdateLeadDto): Promise<LeadDto> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .exec();
    if (!doc) throw new NotFoundException("Lead not found");
    return LeadsService.toDto(doc);
  }

  async remove(id: string): Promise<{ id: string }> {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException("Lead not found");
    return { id };
  }

  async count(filter: FilterQuery<LeadDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  /** Most-recent leads, for the dashboard. */
  async recent(limit = 5): Promise<LeadDto[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).limit(limit).exec();
    return docs.map(LeadsService.toDto);
  }
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
