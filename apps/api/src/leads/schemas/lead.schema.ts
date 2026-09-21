import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { LeadStatus } from "@rangamai/shared";

export type LeadDocument = HydratedDocument<Lead>;

/** A contact-form submission. Spec §10, §12, §17. */
@Schema({ timestamps: true, collection: "leads" })
export class Lead {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop() phone?: string;
  @Prop() company?: string;
  @Prop() service?: string;
  @Prop() budgetRange?: string;
  @Prop() projectType?: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ default: "website" })
  source?: string;

  @Prop({
    required: true,
    default: LeadStatus.NEW,
    enum: Object.values(LeadStatus),
    index: true,
  })
  status!: LeadStatus;

  @Prop()
  notes?: string;

  // Added by { timestamps: true } at runtime; declared for typing.
  createdAt?: Date;
  updatedAt?: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
// Newest-first listing is the default admin view.
LeadSchema.index({ createdAt: -1 });
