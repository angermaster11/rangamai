import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  SeoMetaSchema,
  SeoMetaSchemaClass,
} from "../../common/schemas/embedded.schema";

export type SiteSettingsDocument = HydratedDocument<SiteSettings>;

/** Embedded contact/social link (no own _id). */
@Schema({ _id: false })
export class ContactLinkSchemaClass {
  @Prop({ required: true }) kind!: string;
  @Prop({ required: true }) label!: string;
  @Prop({ required: true }) href!: string;
}
export const ContactLinkSchema = SchemaFactory.createForClass(
  ContactLinkSchemaClass,
);

/**
 * Site-wide settings singleton. `singletonKey` is unique so there can only ever
 * be one document (spec §11, §17).
 */
@Schema({ timestamps: true, collection: "site_settings" })
export class SiteSettings {
  @Prop({ required: true, unique: true, default: "default" })
  singletonKey!: string;

  @Prop({ required: true, default: "RANGAMAI" })
  companyName!: string;

  @Prop() tagline?: string;
  @Prop() email?: string;
  @Prop() phone?: string;
  @Prop() whatsapp?: string;
  @Prop() address?: string;

  @Prop({ type: [ContactLinkSchema], default: [] })
  socialLinks!: ContactLinkSchemaClass[];

  @Prop({ type: SeoMetaSchema })
  seo?: SeoMetaSchemaClass;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
