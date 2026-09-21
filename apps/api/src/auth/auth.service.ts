import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { AdminUser as AdminUserDto } from "@rangamai/shared";
import { UsersService } from "../users/users.service";
import type { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Validates credentials and returns a signed JWT plus the safe user shape.
   * Uses a single generic error for both "no such email" and "wrong password"
   * so the endpoint doesn't reveal which accounts exist.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: AdminUserDto }> {
    const user = await this.users.findByEmailWithHash(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const ok = await this.users.verifyPassword(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = await this.jwt.signAsync(payload);
    return { token, user: UsersService.toDto(user) };
  }

  /** Re-reads the current user for GET /auth/me. */
  async me(userId: string): Promise<AdminUserDto> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Session no longer valid");
    }
    return UsersService.toDto(user);
  }
}
