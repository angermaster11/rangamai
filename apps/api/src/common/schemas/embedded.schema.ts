import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

/** Embedded SEO metadata (no own _id). Mirrors shared `SeoMeta`. */
@Schema({ _id: false })
export class SeoMetaSchemaClass {
  @Prop() metaTitle?: string;
  @Prop() metaDescription?: string;
  @Prop() canonicalUrl?: string;
  @Prop() ogImage?: string;
}
export const SeoMetaSchema = SchemaFactory.createForClass(SeoMetaSchemaClass);

/** Embedded media reference (no own _id). Mirrors shared `MediaRef`. */
@Schema({ _id: false })
export class MediaRefSchemaClass {
  @Prop({ required: true }) url!: string;
  @Prop({ required: true, default: "" }) alt!: string;
  @Prop() width?: number;
  @Prop() height?: number;
}
export const MediaRefSchema = SchemaFactory.createForClass(MediaRefSchemaClass);

/** Embedded CTA link (no own _id). */
@Schema({ _id: false })
export class CtaSchemaClass {
  @Prop({ required: true }) label!: string;
  @Prop({ required: true }) href!: string;
}
export const CtaSchema = SchemaFactory.createForClass(CtaSchemaClass);
