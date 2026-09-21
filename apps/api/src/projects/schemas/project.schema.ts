import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  MediaRefSchema,
  MediaRefSchemaClass,
  SeoMetaSchema,
  SeoMetaSchemaClass,
} from "../../common/schemas/embedded.schema";

export type ProjectDocument = HydratedDocument<Project>;

/** Embedded before/after metric (no own _id). */
@Schema({ _id: false })
export class ProjectMetricSchemaClass {
  @Prop({ required: true }) label!: string;
  @Prop({ required: true }) value!: string;
}
export const ProjectMetricSchema = SchemaFactory.createForClass(
  ProjectMetricSchemaClass,
);

/** A portfolio project / case study. Spec §7, §8, §17. */
@Schema({ timestamps: true, collection: "projects" })
export class Project {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true, index: true })
  slug!: string;

  @Prop({ required: true })
  shortDescription!: string;

  @Prop({ type: MediaRefSchema })
  coverImage?: MediaRefSchemaClass;

  @Prop({ required: true })
  description!: string;

  @Prop() problem?: string;
  @Prop() solution?: string;

  @Prop({ type: [String], default: undefined })
  keyFeatures?: string[];

  @Prop({ type: [String], default: undefined })
  techStack?: string[];

  @Prop({ type: [ProjectMetricSchema], default: undefined })
  metrics?: ProjectMetricSchemaClass[];

  @Prop() client?: string;
  @Prop() industry?: string;

  @Prop({ type: [String], default: undefined })
  servicesUsed?: string[];

  @Prop({ type: [MediaRefSchema], default: undefined })
  gallery?: MediaRefSchemaClass[];

  @Prop() liveUrl?: string;
  @Prop() githubUrl?: string;

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
