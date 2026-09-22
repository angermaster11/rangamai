import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";
import type { CookieOptions, Response } from "express";
import type { AdminUser as AdminUserDto } from "@rangamai/shared";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser, AuthUser } from "../common/decorators/current-user.decorator";
import type { AppConfig } from "../config/configuration";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  private cookieOptions(): CookieOptions {
    const cookie = this.config.get("cookie", { infer: true });
    return {
      httpOnly: true,
      secure: cookie.secure,
      sameSite: "lax",
      path: "/",
      // Shared across subdomains (e.g. ".rangamai.in") when configured, so the
      // admin app's middleware can see the cookie the API sets. Undefined in
      // dev → host-only cookie on localhost.
      domain: cookie.domain,
      // 1 day in ms — matches JWT_EXPIRES_IN default; JWT expiry is the real gate.
      maxAge: 24 * 60 * 60 * 1000,
    };
  }

  /** Validates credentials, sets the HttpOnly cookie, returns the safe user. */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  // Tight per-route limit on top of the global 60/min: blunts password
  // brute-forcing — 5 attempts / minute / IP, then 429.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AdminUserDto> {
    const { token, user } = await this.auth.login(dto.email, dto.password);
    const cookieName = this.config.get("cookie", { infer: true }).name;
    res.cookie(cookieName, token, this.cookieOptions());
    return user;
  }

  /** Clears the auth cookie. */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response): { loggedOut: true } {
    const cookieName = this.config.get("cookie", { infer: true }).name;
    res.clearCookie(cookieName, { ...this.cookieOptions(), maxAge: undefined });
    return { loggedOut: true };
  }

  /** Returns the authenticated user, or 401 if the cookie is invalid. */
  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser): Promise<AdminUserDto> {
    return this.auth.me(user.id);
  }
}
