import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Lead, LeadSchema } from "./schemas/lead.schema";
import { LeadsService } from "./leads.service";
import { AdminLeadsController, LeadsController } from "./leads.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ],
  controllers: [LeadsController, AdminLeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
