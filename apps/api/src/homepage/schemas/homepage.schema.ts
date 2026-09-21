import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  CtaSchema,
  CtaSchemaClass,
  MediaRefSchema,
  MediaRefSchemaClass,
} from "../../common/schemas/embedded.schema";

export type HomepageDocument = HydratedDocument<Homepage>;

@Schema({ _id: false })
export class ValuePropSchemaClass {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) description!: string;
  @Prop() icon?: string;
}
export const ValuePropSchema = SchemaFactory.createForClass(ValuePropSchemaClass);

@Schema({ _id: false })
export class ProcessStepSchemaClass {
  @Prop({ required: true }) step!: number;
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) description!: string;
  @Prop() icon?: string;
}
export const ProcessStepSchema = SchemaFactory.createForClass(
  ProcessStepSchemaClass,
);

/** Homepage CMS singleton. Spec §4, §14, §17. */
@Schema({ timestamps: true, collection: "homepage" })
export class Homepage {
  @Prop({ required: true, unique: true, default: "default" })
  singletonKey!: string;

  @Prop({ required: true }) heroHeading!: string;
  @Prop({ required: true }) heroSubheading!: string;

  @Prop({ type: CtaSchema, required: true })
  heroPrimaryCta!: CtaSchemaClass;

  @Prop({ type: CtaSchema })
  heroSecondaryCta?: CtaSchemaClass;

  @Prop({ type: MediaRefSchema })
  heroImage?: MediaRefSchemaClass;

  @Prop({ type: [String], default: [] })
  featuredServiceSlugs!: string[];

  @Prop({ type: [String], default: [] })
  featuredProjectSlugs!: string[];

  @Prop({ required: true }) whyHeading!: string;
  @Prop() whySubheading?: string;

  @Prop({ type: [ValuePropSchema], default: [] })
  valueProps!: ValuePropSchemaClass[];

  @Prop({ required: true }) processHeading!: string;

  @Prop({ type: [ProcessStepSchema], default: [] })
  processSteps!: ProcessStepSchemaClass[];

  @Prop({ required: true }) finalCtaHeading!: string;
  @Prop() finalCtaSubheading?: string;

  @Prop({ type: CtaSchema, required: true })
  finalCta!: CtaSchemaClass;
}

export const HomepageSchema = SchemaFactory.createForClass(Homepage);
