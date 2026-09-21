import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { Media as MediaDto } from "@rangamai/shared";
import { Media, MediaDocument } from "./schemas/media.schema";
import { CloudinaryService } from "./cloudinary.service";

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name)
    private readonly model: Model<MediaDocument>,
    private readonly cloudinary: CloudinaryService,
  ) {}

  static toDto(doc: MediaDocument): MediaDto {
    const o = doc.toObject({ versionKey: false });
    return {
      id: doc._id.toString(),
      url: o.url,
      publicId: o.publicId,
      alt: o.alt,
      width: o.width,
      height: o.height,
      bytes: o.bytes,
      format: o.format,
      createdAt: o.createdAt?.toISOString?.(),
      updatedAt: o.updatedAt?.toISOString?.(),
    };
  }

  /** Uploads to Cloudinary, then catalogues the asset in Mongo. */
  async upload(buffer: Buffer, alt = ""): Promise<MediaDto> {
    const result = await this.cloudinary.uploadImage(buffer);
    const created = await this.model.create({
      url: result.secure_url,
      publicId: result.public_id,
      alt,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    });
    return MediaService.toDto(created);
  }

  async findAll(): Promise<MediaDto[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).exec();
    return docs.map(MediaService.toDto);
  }

  async updateAlt(id: string, alt: string): Promise<MediaDto> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: { alt } }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException("Media not found");
    return MediaService.toDto(doc);
  }

  /** Removes from Cloudinary first, then drops the catalogue entry. */
  async remove(id: string): Promise<{ id: string }> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException("Media not found");
    await this.cloudinary.deleteImage(doc.publicId);
    await doc.deleteOne();
    return { id };
  }

  async count(): Promise<number> {
    return this.model.countDocuments().exec();
  }
}
