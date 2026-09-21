import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { Homepage as HomepageDto } from "@rangamai/shared";
import { homepage as seedHomepage } from "@rangamai/shared";
import { Homepage, HomepageDocument } from "./schemas/homepage.schema";
import { UpdateHomepageDto } from "./dto/update-homepage.dto";

const SINGLETON = "default";

@Injectable()
export class HomepageService {
  constructor(
    @InjectModel(Homepage.name)
    private readonly model: Model<HomepageDocument>,
  ) {}

  static toDto(doc: HomepageDocument): HomepageDto {
    const o = doc.toObject({ versionKey: false });
    return {
      heroHeading: o.heroHeading,
      heroSubheading: o.heroSubheading,
      heroPrimaryCta: o.heroPrimaryCta,
      heroSecondaryCta: o.heroSecondaryCta,
      heroImage: o.heroImage,
      featuredServiceSlugs: o.featuredServiceSlugs ?? [],
      featuredProjectSlugs: o.featuredProjectSlugs ?? [],
      whyHeading: o.whyHeading,
      whySubheading: o.whySubheading,
      valueProps: o.valueProps ?? [],
      processHeading: o.processHeading,
      processSteps: o.processSteps ?? [],
      finalCtaHeading: o.finalCtaHeading,
      finalCtaSubheading: o.finalCtaSubheading,
      finalCta: o.finalCta,
    };
  }

  /** Returns the homepage singleton, seeding it on first access. */
  async get(): Promise<HomepageDto> {
    const doc = await this.model
      .findOneAndUpdate(
        { singletonKey: SINGLETON },
        { $setOnInsert: { singletonKey: SINGLETON, ...seedHomepage } },
        { new: true, upsert: true },
      )
      .exec();
    return HomepageService.toDto(doc);
  }

  async update(dto: UpdateHomepageDto): Promise<HomepageDto> {
    const doc = await this.model
      .findOneAndUpdate(
        { singletonKey: SINGLETON },
        { $set: dto, $setOnInsert: { singletonKey: SINGLETON } },
        { new: true, upsert: true, runValidators: true },
      )
      .exec();
    return HomepageService.toDto(doc);
  }
}
