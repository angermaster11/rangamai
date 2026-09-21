import { Injectable } from "@nestjs/common";
import { LeadStatus, type AdminStats } from "@rangamai/shared";
import { LeadsService } from "../leads/leads.service";
import { ServicesService } from "../services/services.service";
import { ProjectsService } from "../projects/projects.service";
import { ClientsService } from "../clients/clients.service";
import { MediaService } from "../media/media.service";

@Injectable()
export class StatsService {
  constructor(
    private readonly leads: LeadsService,
    private readonly services: ServicesService,
    private readonly projects: ProjectsService,
    private readonly clients: ClientsService,
    private readonly media: MediaService,
  ) {}

  /** Real counts straight from the collections — no fabricated analytics. */
  async summary(): Promise<AdminStats> {
    const [
      totalLeads,
      newLeads,
      totalServices,
      publishedServices,
      totalProjects,
      publishedProjects,
      totalClients,
      totalMedia,
    ] = await Promise.all([
      this.leads.count(),
      this.leads.count({ status: LeadStatus.NEW }),
      this.services.count(),
      this.services.count({ published: true }),
      this.projects.count(),
      this.projects.count({ published: true }),
      this.clients.count(),
      this.media.count(),
    ]);

    return {
      totalLeads,
      newLeads,
      totalServices,
      publishedServices,
      totalProjects,
      publishedProjects,
      totalClients,
      totalMedia,
    };
  }
}
