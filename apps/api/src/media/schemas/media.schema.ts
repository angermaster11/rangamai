import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MediaDocument = HydratedDocument<Media>;

/** A media asset stored in Cloudinary and catalogued here. Spec §17. */
@Schema({ timestamps: true, collection: "media" })
export class Media {
  @Prop({ required: true })
  url!: string;

  @Prop({ required: true, unique: true, index: true })
  publicId!: string;

  @Prop({ required: true, default: "" })
  alt!: string;

  @Prop() width?: number;
  @Prop() height?: number;
  @Prop() bytes?: number;
  @Prop() format?: string;

  // Added by { timestamps: true } at runtime; declared for typing.
  createdAt?: Date;
  updatedAt?: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
