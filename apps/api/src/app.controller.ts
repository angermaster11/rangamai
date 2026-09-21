import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  /** Liveness probe. */
  @Get("health")
  health(): { status: "ok"; service: string; time: string } {
    return { status: "ok", service: "rangamai-api", time: new Date().toISOString() };
  }
}
