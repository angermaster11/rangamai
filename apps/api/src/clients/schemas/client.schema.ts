import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  MediaRefSchema,
  MediaRefSchemaClass,
} from "../../common/schemas/embedded.schema";

export type ClientDocument = HydratedDocument<Client>;

/** A client / partner. Spec §9, §17. */
@Schema({ timestamps: true, collection: "clients" })
export class Client {
  @Prop({ required: true, trim: true })
  companyName!: string;

  @Prop({ type: MediaRefSchema })
  logo?: MediaRefSchemaClass;

  @Prop() website?: string;
  @Prop() industry?: string;
  @Prop() description?: string;

  @Prop({ required: true, default: true, index: true })
  showPublicly!: boolean;

  @Prop({ required: true, default: 0, index: true })
  displayOrder!: number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
