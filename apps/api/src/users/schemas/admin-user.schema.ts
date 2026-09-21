import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import type { AdminRole } from "@rangamai/shared";

export type AdminUserDocument = HydratedDocument<AdminUser>;

/**
 * Admin dashboard account. The password is stored ONLY as a bcrypt hash
 * (`passwordHash`), never in plaintext, and is excluded from queries by
 * default (`select: false`) so it can't leak through a generic find.
 */
@Schema({ timestamps: true, collection: "admin_users" })
export class AdminUser {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop({ required: true, default: "ADMIN", enum: ["ADMIN", "EDITOR"] })
  role!: AdminRole;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
