import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import type { AdminUser as AdminUserDto, AdminRole } from "@rangamai/shared";
import { AdminUser, AdminUserDocument } from "./schemas/admin-user.schema";

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(AdminUser.name)
    private readonly userModel: Model<AdminUserDocument>,
  ) {}

  /** Maps a Mongo doc to the safe public shape (never includes the hash). */
  static toDto(doc: AdminUserDocument): AdminUserDto {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      role: doc.role,
      createdAt: (doc as unknown as { createdAt?: Date }).createdAt?.toISOString(),
      updatedAt: (doc as unknown as { updatedAt?: Date }).updatedAt?.toISOString(),
    };
  }

  /** Finds a user by email, INCLUDING the password hash (for login only). */
  async findByEmailWithHash(email: string): Promise<AdminUserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select("+passwordHash")
      .exec();
  }

  async findById(id: string): Promise<AdminUserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  /**
   * Idempotently ensures an admin exists with the given credentials
   * (used by the seed script). Updates name/role/password if it already exists.
   */
  async upsertAdmin(params: {
    email: string;
    password: string;
    name: string;
    role?: AdminRole;
  }): Promise<AdminUserDocument> {
    const passwordHash = await bcrypt.hash(params.password, BCRYPT_ROUNDS);
    const email = params.email.toLowerCase().trim();
    return this.userModel
      .findOneAndUpdate(
        { email },
        {
          $set: {
            name: params.name,
            passwordHash,
            role: params.role ?? "ADMIN",
          },
          $setOnInsert: { email },
        },
        { new: true, upsert: true },
      )
      .exec();
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
