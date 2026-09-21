import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  MediaRefSchema,
  MediaRefSchemaClass,
  SeoMetaSchema,
  SeoMetaSchemaClass,
} from "../../common/schemas/embedded.schema";

export type ServiceDocument = HydratedDocument<Service>;

/** A service offering. Spec §5, §17. */
@Schema({ timestamps: true, collection: "services" })
export class Service {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true })
  slug!: string;

  @Prop({ required: true })
  shortDescription!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: MediaRefSchema })
  banner?: MediaRefSchemaClass;

  @Prop({ type: [MediaRefSchema], default: undefined })
  images?: MediaRefSchemaClass[];

  @Prop()
  icon?: string;

  @Prop({ type: [String], default: undefined })
  highlights?: string[];

  @Prop({ required: true, default: 0, index: true })
  displayOrder!: number;

  @Prop({ required: true, default: false, index: true })
  featured!: boolean;

  @Prop({ required: true, default: true, index: true })
  published!: boolean;

  @Prop({ type: SeoMetaSchema })
  seo?: SeoMetaSchemaClass;

  // Added by { timestamps: true } at runtime; declared for typing.
  createdAt?: Date;
  updatedAt?: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
