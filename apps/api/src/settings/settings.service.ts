import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { SiteSettings as SiteSettingsDto } from "@rangamai/shared";
import { siteSettings as seedSiteSettings } from "@rangamai/shared";
import {
  SiteSettings,
  SiteSettingsDocument,
} from "./schemas/site-settings.schema";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

const SINGLETON = "default";

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly model: Model<SiteSettingsDocument>,
  ) {}

  static toDto(doc: SiteSettingsDocument): SiteSettingsDto {
    const o = doc.toObject({ versionKey: false });
    return {
      companyName: o.companyName,
      tagline: o.tagline,
      email: o.email,
      phone: o.phone,
      whatsapp: o.whatsapp,
      address: o.address,
      socialLinks: o.socialLinks ?? [],
      seo: o.seo,
    };
  }

  /**
   * Returns the settings singleton, creating it from seed defaults on first
   * access so the public site and admin always have something to read.
   */
  async get(): Promise<SiteSettingsDto> {
    const doc = await this.model
      .findOneAndUpdate(
        { singletonKey: SINGLETON },
        { $setOnInsert: { singletonKey: SINGLETON, ...seedSiteSettings } },
        { new: true, upsert: true },
      )
      .exec();
    return SettingsService.toDto(doc);
  }

  async update(dto: UpdateSettingsDto): Promise<SiteSettingsDto> {
    const doc = await this.model
      .findOneAndUpdate(
        { singletonKey: SINGLETON },
        { $set: dto, $setOnInsert: { singletonKey: SINGLETON } },
        { new: true, upsert: true, runValidators: true },
      )
      .exec();
    return SettingsService.toDto(doc);
  }
}
