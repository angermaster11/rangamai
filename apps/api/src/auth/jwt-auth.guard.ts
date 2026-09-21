import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Protects every mutating/admin route. Applied per-controller (not globally)
 * so public GETs and POST /leads stay open. Rejects with 401 when the cookie
 * is missing, malformed, or expired.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
