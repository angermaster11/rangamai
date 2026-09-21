import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from "express";
import { UsersService } from "../users/users.service";
import type { AuthUser } from "../common/decorators/current-user.decorator";
import type { AppConfig } from "../config/configuration";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/** Reads the JWT from the HttpOnly cookie (falls back to Bearer for tooling). */
function cookieExtractor(cookieName: string) {
  return (req: Request): string | null => {
    const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
    return cookies?.[cookieName] ?? null;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService<AppConfig, true>,
    private readonly users: UsersService,
  ) {
    const cookieName = config.get("cookie", { infer: true }).name;
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(cookieName),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get("jwt", { infer: true }).secret,
    });
  }

  /** Runs after signature/expiry checks pass; confirms the user still exists. */
  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Session no longer valid");
    }
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
