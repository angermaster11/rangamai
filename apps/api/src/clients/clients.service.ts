import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { Client as ClientDto } from "@rangamai/shared";
import { Client, ClientDocument } from "./schemas/client.schema";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly model: Model<ClientDocument>,
  ) {}

  static toDto(doc: ClientDocument): ClientDto {
    const o = doc.toObject({ versionKey: false });
    return {
      id: doc._id.toString(),
      companyName: o.companyName,
      logo: o.logo,
      website: o.website,
      industry: o.industry,
      description: o.description,
      showPublicly: o.showPublicly,
      displayOrder: o.displayOrder,
    };
  }

  /* -------------------------------- Public ------------------------------- */

  /** Only publicly-shown clients, ordered — for "Trusted By". */
  async findPublic(): Promise<ClientDto[]> {
    const docs = await this.model
      .find({ showPublicly: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .exec();
    return docs.map(ClientsService.toDto);
  }

  /* -------------------------------- Admin -------------------------------- */

  async findAll(): Promise<ClientDto[]> {
    const docs = await this.model
      .find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .exec();
    return docs.map(ClientsService.toDto);
  }

  async findOne(id: string): Promise<ClientDto> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException("Client not found");
    return ClientsService.toDto(doc);
  }

  async create(dto: CreateClientDto): Promise<ClientDto> {
    const created = await this.model.create({ ...dto });
    return ClientsService.toDto(created);
  }

  async update(id: string, dto: UpdateClientDto): Promise<ClientDto> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .exec();
    if (!doc) throw new NotFoundException("Client not found");
    return ClientsService.toDto(doc);
  }

  async remove(id: string): Promise<{ id: string }> {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException("Client not found");
    return { id };
  }

  async reorder(ids: string[]): Promise<ClientDto[]> {
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
