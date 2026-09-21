import { Module } from "@nestjs/common";
import { StatsService } from "./stats.service";
import { StatsController } from "./stats.controller";
import { LeadsModule } from "../leads/leads.module";
import { ServicesModule } from "../services/services.module";
import { ProjectsModule } from "../projects/projects.module";
import { ClientsModule } from "../clients/clients.module";
import { MediaModule } from "../media/media.module";

@Module({
  imports: [LeadsModule, ServicesModule, ProjectsModule, ClientsModule, MediaModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
